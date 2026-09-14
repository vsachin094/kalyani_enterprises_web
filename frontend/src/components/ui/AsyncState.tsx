import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';

export function LoadingGrid({ count = 4 }: { count?: number }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading content" aria-busy="true">{Array.from({ length: count }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-gray-100/80"><div className="m-6 h-14 w-14 rounded-xl bg-gray-200" /><div className="mx-6 h-5 w-2/3 rounded bg-gray-200" /><div className="mx-6 mt-5 h-3 w-5/6 rounded bg-gray-200" /><div className="mx-6 mt-3 h-3 w-3/5 rounded bg-gray-200" /></div>)}</div>;
}

export function SectionError({ onRetry }: { onRetry: () => void }) {
  return <div role="alert" className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center"><AlertTriangle className="mx-auto h-8 w-8 text-red-500" /><p className="mt-3 font-semibold text-red-900">We could not load this section.</p><p className="mt-1 text-sm text-red-700">Please check your connection and try again.</p><button type="button" onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"><RefreshCw className="h-4 w-4" /> Try again</button></div>;
}

export function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><Inbox className="mx-auto h-8 w-8 text-gray-400" /><p className="mt-3 text-sm font-medium text-gray-600">{label}</p></div>;
}
