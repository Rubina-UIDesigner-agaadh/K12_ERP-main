import React, { Suspense, Component } from 'react';
import { pageRegistry } from '../pages/PageRegistry';
import { FileQuestion, Loader2, AlertTriangle, Copy, Check, RotateCcw } from 'lucide-react';
interface DynamicPageProps {
  moduleName: string;
  subModuleName: string;
  screenName: string;
  pageId: string;
}
function PageLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading page...</p>
      </div>
    </div>);

}
function PageNotFound({
  screenName,
  pageId




}: {screenName: string;pageId: string;}) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Page Under Development
        </h2>
        <p className="text-gray-500">
          The <span className="font-medium text-gray-700">{screenName}</span>{' '}
          page is currently being developed.
        </p>
        <p className="text-xs text-gray-400 mt-4">Page ID: {pageId}</p>
      </div>
    </div>);

}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  componentStack: string;
  copied: boolean;
}

/**
 * Error boundary for every dynamically loaded page.
 *
 * A page that throws used to show only "Something went wrong with Page ID: x",
 * which makes a render crash impossible to diagnose without DevTools. The card
 * below now shows the error name, message and the component stack on screen
 * (copyable with one click) so the failing file can be identified from a
 * screenshot alone.
 */
class PageErrorBoundary extends Component<
  {
    children: React.ReactNode;
    pageId: string;
  },
  ErrorBoundaryState>
{
  constructor(props: {children: React.ReactNode;pageId: string;}) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      componentStack: '',
      copied: false
    };
  }
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[DynamicPage] Error loading page "${this.props.pageId}":`,
      error,
      errorInfo
    );
    this.setState({
      componentStack: errorInfo?.componentStack || ''
    });
  }
  componentDidUpdate(prevProps: {children: React.ReactNode;pageId: string;}) {
    if (prevProps.pageId !== this.props.pageId && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
        componentStack: '',
        copied: false
      });
    }
  }
  /** Plain-text version of the failure, for pasting into a bug report. */
  private report(): string {
    const { error, componentStack } = this.state;
    return [
      `Page ID: ${this.props.pageId}`,
      `Error: ${error?.name || 'Error'}: ${error?.message || 'unknown'}`,
      error?.stack ? `Stack:\n${error.stack}` : '',
      componentStack ? `Component stack:${componentStack}` : ''
    ].
    filter(Boolean).
    join('\n');
  }
  private copyReport = () => {
    const text = this.report();
    const done = () => this.setState({ copied: true });
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => this.fallbackCopy(text, done));
        return;
      }
    } catch { /* fall through to the legacy path */ }
    this.fallbackCopy(text, done);
  };
  private fallbackCopy(text: string, done: () => void) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', 'true');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch { /* clipboard unavailable — the text is still selectable on screen */ }
    done();
  }
  render() {
    if (this.state.hasError) {
      const { error, componentStack, copied } = this.state;
      const stackLines = (componentStack || '').
      split('\n').
      map((l) => l.trim()).
      filter(Boolean).
      slice(0, 8);
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-3xl rounded-xl border border-red-200 bg-white shadow-sm">
            <div className="flex items-start gap-3 p-5 border-b border-red-100 bg-red-50/60 rounded-t-xl">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  This page failed to load
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  The screen threw an error while rendering. The technical details below
                  identify the exact file and line.
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Page ID
                  </p>
                  <p className="text-xs font-mono text-gray-800 break-all">{this.props.pageId}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Error
                  </p>
                  <p className="text-xs font-mono text-red-700 break-words">
                    {error?.name || 'Error'}: {error?.message || 'unknown error'}
                  </p>
                </div>
              </div>

              {error?.stack &&
              <details className="rounded-lg border border-gray-200 bg-gray-50 p-3" open>
                  <summary className="text-[11px] font-semibold text-gray-700 cursor-pointer">
                    Stack trace (first lines point at the failing file)
                  </summary>
                  <pre className="mt-2 max-h-52 overflow-auto text-[10px] leading-relaxed text-gray-700 whitespace-pre-wrap break-words select-all">
                    {error.stack.split('\n').slice(0, 12).join('\n')}
                  </pre>
                </details>
              }

              {stackLines.length > 0 &&
              <details className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <summary className="text-[11px] font-semibold text-gray-700 cursor-pointer">
                    React component stack
                  </summary>
                  <pre className="mt-2 max-h-40 overflow-auto text-[10px] leading-relaxed text-gray-700 whitespace-pre-wrap break-words select-all">
                    {stackLines.join('\n')}
                  </pre>
                </details>
              }

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => this.setState({ hasError: false, error: null, componentStack: '', copied: false })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  Reload Page
                </button>
                <button
                  onClick={this.copyReport}
                  className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy details'}
                </button>
                <span className="text-[11px] text-gray-400">
                  Also logged to the browser console as{' '}
                  <span className="font-mono">[DynamicPage] Error loading page "{this.props.pageId}"</span>
                </span>
              </div>
            </div>
          </div>
        </div>);

    }
    return this.props.children;
  }
}
export function DynamicPage({
  screenName,
  pageId
}: DynamicPageProps) {
  // Guard: a registry entry must be a loader function returning a component.
  // Calling a broken entry here would crash the whole layout instead of the page.
  let SpecificComponent: any = null;
  try {
    const factory = pageRegistry[pageId];
    SpecificComponent = factory ? factory() : null;
  } catch (err) {
    console.error(`[DynamicPage] Registry entry for "${pageId}" failed:`, err);
    SpecificComponent = null;
  }
  return (
    <div className="flex-1 bg-gray-50/50 min-h-full flex flex-col">
      <PageErrorBoundary pageId={pageId}>
        <Suspense fallback={<PageLoadingFallback />}>
          {SpecificComponent ?
          <SpecificComponent /> :

          <PageNotFound screenName={screenName} pageId={pageId} />
          }
        </Suspense>
      </PageErrorBoundary>
    </div>);

}
