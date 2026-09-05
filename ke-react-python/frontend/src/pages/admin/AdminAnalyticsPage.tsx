import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminGetAnalytics } from '@/lib/api';
import { VisitRecord } from '@/types';

export default function AdminAnalyticsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ke-admin-token');
    if (!token) {
      setError('Admin access required.');
      setLoading(false);
      return;
    }
    adminGetAnalytics(token)
      .then((data) => {
        setVisits(data.recent_visits);
        setTotalVisits(data.total_visits);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-20 flex items-center justify-center"><p className="text-gray-500">Loading analytics...</p></div>;
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3 text-sm text-orange-600">
          <Link to="/admin" className="inline-flex items-center gap-2 font-semibold hover:text-orange-700">
            <ArrowLeft className="h-4 w-4" /> Back to admin
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Visit analytics</p>
            <h1 className="mt-2 text-4xl font-bold text-gray-950">Recorded page visits</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              Total visits: <strong>{totalVisits}</strong>. Showing the most recent 100 visit events captured from the internal database.
            </p>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900">When</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Path</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Referer</th>
                <th className="px-4 py-3 font-semibold text-gray-900">User agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {visits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                    No visits recorded yet. The analytics tracker will log page views for every visit.
                  </td>
                </tr>
              ) : (
                visits.map((visit) => (
                  <tr key={visit.id}>
                    <td className="px-4 py-4 text-sm text-gray-700">{new Date(visit.visited_at).toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{visit.page_path}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{visit.referer || '—'}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words max-w-[28rem]">{visit.user_agent || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}