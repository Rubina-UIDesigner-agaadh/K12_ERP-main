// Small browser-only XLSX reader for single-sheet configuration imports.
// It reads the first worksheet from an OOXML workbook without adding a dependency.
async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot read .xlsx files. Save the workbook as CSV and retry.');
  }
  const stream = new ReadableStream<Uint8Array>({
    start(controller) { controller.enqueue(data); controller.close(); }
  }).pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function readXlsxRows(file: File): Promise<string[][]> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let endRecord = -1;
  for (let index = bytes.length - 22; index >= Math.max(0, bytes.length - 65557); index -= 1) {
    if (view.getUint32(index, true) === 0x06054b50) { endRecord = index; break; }
  }
  if (endRecord < 0) throw new Error('The selected file is not a valid Excel workbook.');

  const entries = new Map<string, { method: number; compressedSize: number; offset: number }>();
  const decoder = new TextDecoder();
  let pointer = view.getUint32(endRecord + 16, true);
  const entryCount = view.getUint16(endRecord + 10, true);
  for (let remaining = entryCount; remaining > 0 && view.getUint32(pointer, true) === 0x02014b50; remaining -= 1) {
    const nameLength = view.getUint16(pointer + 28, true);
    const name = decoder.decode(bytes.subarray(pointer + 46, pointer + 46 + nameLength));
    entries.set(name, {
      method: view.getUint16(pointer + 10, true),
      compressedSize: view.getUint32(pointer + 20, true),
      offset: view.getUint32(pointer + 42, true)
    });
    pointer += 46 + nameLength + view.getUint16(pointer + 30, true) + view.getUint16(pointer + 32, true);
  }

  const readEntry = async (name: string) => {
    const entry = entries.get(name);
    if (!entry) return '';
    const start = entry.offset + 30 + view.getUint16(entry.offset + 26, true) + view.getUint16(entry.offset + 28, true);
    const compressed = bytes.subarray(start, start + entry.compressedSize);
    if (entry.method === 0) return decoder.decode(compressed);
    if (entry.method !== 8) throw new Error('The workbook uses an unsupported compression method.');
    return decoder.decode(await inflateRaw(compressed));
  };
  const parseXml = (text: string) => new DOMParser().parseFromString(text, 'application/xml');
  const elements = (root: Document | Element, tag: string) => Array.from(root.getElementsByTagNameNS('*', tag));

  let sheetPath = '';
  const workbookText = await readEntry('xl/workbook.xml');
  const relsText = await readEntry('xl/_rels/workbook.xml.rels');
  if (workbookText && relsText) {
    const relationshipId = elements(parseXml(workbookText), 'sheet')[0]?.getAttribute('r:id');
    const target = elements(parseXml(relsText), 'Relationship').find((item) => item.getAttribute('Id') === relationshipId)?.getAttribute('Target') || '';
    if (target) sheetPath = target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.\//, '')}`;
  }
  if (!entries.has(sheetPath)) {
    sheetPath = Array.from(entries.keys()).filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name)).sort()[0] || '';
  }
  if (!sheetPath) throw new Error('No worksheet was found in this workbook.');

  const sharedText = await readEntry('xl/sharedStrings.xml');
  const sharedStrings = sharedText ? elements(parseXml(sharedText), 'si').map((item) => elements(item, 't').map((node) => node.textContent || '').join('')) : [];
  const columnIndex = (letters: string) => letters.toUpperCase().split('').reduce((value, letter) => value * 26 + letter.charCodeAt(0) - 64, 0) - 1;
  const rows: string[][] = [];
  elements(parseXml(await readEntry(sheetPath)), 'row').forEach((rowElement, rowIndex) => {
    const rowNumber = Number(rowElement.getAttribute('r')) || rowIndex + 1;
    const cells: string[] = [];
    elements(rowElement, 'c').forEach((cell, cellIndex) => {
      const reference = (cell.getAttribute('r') || '').replace(/\d+/g, '');
      const cellType = cell.getAttribute('t');
      const rawValue = elements(cell, 'v')[0]?.textContent || '';
      const value = cellType === 'inlineStr'
        ? elements(cell, 't').map((node) => node.textContent || '').join('')
        : cellType === 's' ? (sharedStrings[Number(rawValue)] || '')
        : cellType === 'b' ? (rawValue === '1' ? 'TRUE' : 'FALSE')
        : rawValue;
      cells[reference ? columnIndex(reference) : cellIndex] = value;
    });
    rows[rowNumber - 1] = Array.from(cells, (value) => value || '');
  });
  return rows.map((row) => row || []);
}
