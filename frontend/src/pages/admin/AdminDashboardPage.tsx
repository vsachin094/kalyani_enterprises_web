import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, FolderKanban } from 'lucide-react';

const areas = [
  { title: "Content controls", description: "Add projects, upload project images, show or hide products and services, and manage offer banners.", href: "/admin/content", icon: FolderKanban, action: "Manage content" },
  { title: "Feedback approval", description: "Review customer feedback and approve only the entries you want to show publicly.", href: "/admin/feedback", icon: CheckCircle2, action: "Review feedback" },
  { title: "Unique visitors", description: "See anonymous unique visitors, total page views, and recent visits.", href: "/admin/analytics", icon: BarChart3, action: "View visitors" },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem('ke-admin-token');
    navigate('/admin/login', { replace: true });
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Kalyani Enterprises</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">Admin dashboard</h1>
            <p className="mt-4 max-w-2xl text-gray-600">Use the three simple tools below to manage what customers see and understand website activity.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={signOut} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600">Sign out</button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const Icon = area.icon;
            return <article key={area.title} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Icon className="h-5 w-5" /></div><h2 className="mt-5 text-xl font-bold text-gray-900">{area.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{area.description}</p><Link to={area.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">{area.action}<ArrowRight className="h-4 w-4" /></Link></article>;
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900"><strong>Simple workflow:</strong> approve feedback, add projects, toggle visibility, or check anonymous visitor numbers. Changes take effect through the website API.</div>
      </div>
    </section>
  );
}
