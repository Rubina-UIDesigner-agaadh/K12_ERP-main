import React, { lazy, createElement } from 'react';

const lazyCache = new Map<string, React.LazyExoticComponent<any>>();

/**
 * A page is loaded through a dynamic `import()`. That can fail for a transient
 * reason — the dev server was rebuilding, the browser cached an old chunk hash
 * after an HMR update, a network blip — and in all of those cases a single retry
 * succeeds. Only a real failure (missing file, syntax error, bad export) should
 * ever reach the user.
 */
async function loadWithRetry(
importFn: () => Promise<any>,
retries = 1)
: Promise<any> {
  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await importFn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        // brief pause, then try the chunk again
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  }
  throw lastError;
}

/**
 * Shown when a page really could not be loaded. It names the page and prints the
 * underlying error instead of hiding it, and offers the one action that fixes a
 * stale-chunk failure: a reload.
 */
function PageLoadFailure({
  exportName,
  message
}: {exportName: string;message: string;}) {
  return createElement(
    'div',
    {
      className:
      'flex-1 flex flex-col items-center justify-center gap-2 p-12 text-center'
    },
    createElement(
      'p',
      { className: 'text-sm font-semibold text-rose-700' },
      `Could not load "${exportName}".`
    ),
    createElement(
      'p',
      { className: 'text-xs text-gray-500 max-w-xl break-all' },
      message
    ),
    createElement(
      'button',
      {
        onClick: () => {
          if (typeof window !== 'undefined') window.location.reload();
        },
        className:
        'mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700'
      },
      'Reload page'
    )
  );
}

/**
 * rp - registry page loader
 * Uses a static import function that the bundler CAN analyze.
 * Pages are lazy-loaded on demand with proper code splitting.
 */
export function rp(
importFn: () => Promise<any>,
exportName: string)
: () => React.LazyExoticComponent<any> {
  const cacheKey = `rp_${exportName}_${Math.random().toString(36).slice(2, 8)}`;
  let cached: React.LazyExoticComponent<any> | null = null;

  return () => {
    if (cached) {
      return cached;
    }
    const LazyComponent = lazy(() =>
    loadWithRetry(importFn).
    then((m: any) => {
      const component = m[exportName] || m.default;
      if (!component) {
        const available = Object.keys(m).join(', ') || '(none)';
        console.error(
          `[PageRegistry] "${exportName}" is not exported by its module. Exports found: ${available}`
        );
        return {
          default: () =>
          createElement(PageLoadFailure, {
            exportName,
            message: `The module does not export "${exportName}". Exports found: ${available}`
          })
        };
      }
      return { default: component };
    }).
    catch((err: any) => {
      const message = err && (err.message || String(err)) || 'Unknown error';
      console.error(`[PageRegistry] Failed to load page "${exportName}":`, err);
      return {
        default: () => createElement(PageLoadFailure, { exportName, message })
      };
    })
    );
    cached = LazyComponent;
    return LazyComponent;
  };
}
