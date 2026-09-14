import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { submitFeedback } from '@/lib/api';

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await submitFeedback({
        name: String(form.get('name') || ''),
        location: String(form.get('location') || ''),
        text: String(form.get('text') || ''),
        rating: Number(form.get('rating') || 5),
        project_type: String(form.get('project_type') || 'Customer experience'),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-orange-50 via-white to-amber-50 py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link to="/#testimonials" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800">
          <ArrowLeft className="h-4 w-4" /> Back to testimonials
        </Link>
        <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/40 sm:p-10">
          {submitted ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
              <h1 className="mt-5 text-3xl font-bold text-gray-900">Thank you for your feedback</h1>
              <p className="mt-3 text-gray-600">Your feedback has been submitted for review. Once approved, it may appear in our customer testimonials.</p>
              <Button asChild className="mt-8"><Link to="/#testimonials">Return to website</Link></Button>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Customer feedback</p>
              <h1 className="mt-3 text-4xl font-bold text-gray-900">Tell us about your experience</h1>
              <p className="mt-4 text-gray-600">Tell us about any Kalyani Enterprises product, service, installation, support, or power solution. Every submission is reviewed before it is published.</p>
              <form onSubmit={submit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-gray-700">Name<input required name="name" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" placeholder="Your name" /></label>
                  <label className="text-sm font-semibold text-gray-700">Location<input required name="location" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" placeholder="District / area" /></label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-gray-700">Product or service<select name="project_type" className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500"><option>Solar solution</option><option>Inverter / power backup</option><option>Battery / energy storage</option><option>Electrical product or solution</option><option>Installation or commissioning</option><option>Maintenance and support</option><option>Customer experience</option></select></label>
                  <label className="text-sm font-semibold text-gray-700">Rating<select name="rating" defaultValue="5" className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500"><option value="5">★★★★★ Excellent</option><option value="4">★★★★ Very good</option><option value="3">★★★ Good</option><option value="2">★★ Needs improvement</option><option value="1">★ Poor</option></select></label>
                </div>
                <label className="block text-sm font-semibold text-gray-700">Your feedback<textarea required minLength={10} name="text" rows={6} className="mt-2 w-full resize-y rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" placeholder="Share your experience with Kalyani Enterprises..." /></label>
                {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full sm:w-auto"><Send className="h-4 w-4" />{loading ? 'Submitting...' : 'Submit feedback'}</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}