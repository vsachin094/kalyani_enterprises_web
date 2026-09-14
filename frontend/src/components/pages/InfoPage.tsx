import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">{intro}</p>
          <div className="mt-10 space-y-8 text-gray-700 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_p]:mt-3 [&_p]:leading-7 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
