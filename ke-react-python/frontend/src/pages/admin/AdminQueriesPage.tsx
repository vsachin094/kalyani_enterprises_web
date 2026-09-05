import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminGetQueries } from '@/lib/api';
import { QuerySubmission } from '@/types';

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<QuerySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ke-admin-token');
    if (!token) {
      setError('Admin access required.');
      setLoading(false);
      return;
    }
    adminGetQueries(token)
      .then(setQueries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-20 flex items-center justify-center"><p className="text-gray-500">Loading queries...</p></div>;
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Submitted queries</p>
            <h1 className="mt-2 text-4xl font-bold text-gray-950">Customer enquiries</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">Review the latest enquiries submitted through the website contact form.</p>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900">When</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Phone</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Interested in</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {queries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No enquiries have been submitted yet.</td>
                </tr>
              ) : (
                queries.map((query) => (
                  <tr key={query.id}>
                    <td className="px-4 py-4 text-sm text-gray-700">{new Date(query.createdAt || '').toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{query.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{query.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{query.phone}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{query.project_type}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 max-w-[26rem] break-words">{query.message}</td>
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