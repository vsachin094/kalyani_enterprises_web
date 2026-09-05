import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminGetFeedback, adminUpdateFeedback } from '@/lib/api';
import { FeedbackSubmission } from '@/types';

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ke-admin-token');
    if (!token) {
      setError('Admin access required.');
      setLoading(false);
      return;
    }
    adminGetFeedback(token)
      .then(setFeedback)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    const token = localStorage.getItem('ke-admin-token');
    if (!token) return;
    try {
      const updated = await adminUpdateFeedback(token, id, { status });
      setFeedback((items) => items.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feedback');
    }
  }

  if (loading) {
    return <div className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-20 flex items-center justify-center"><p className="text-gray-500">Loading feedback...</p></div>;
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Feedback review</p>
            <h1 className="mt-2 text-4xl font-bold text-gray-950">Customer feedback</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">Review, edit, approve, or reject customer feedback before it appears publicly.</p>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900">When</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Location</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Rating</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Feedback</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {feedback.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">No feedback submissions yet.</td>
                </tr>
              ) : (
                feedback.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 text-sm text-gray-700">{new Date(item.createdAt || '').toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.location}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{'★'.repeat(item.rating)}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 max-w-[26rem] break-words">{item.text}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'approved' ? 'bg-green-50 text-green-700' : item.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(item.id, 'approved')} className="rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-100">Approve</button>
                        <button onClick={() => updateStatus(item.id, 'rejected')} className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100">Reject</button>
                      </div>
                    </td>
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