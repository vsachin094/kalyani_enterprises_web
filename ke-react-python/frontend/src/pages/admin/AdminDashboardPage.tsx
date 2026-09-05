import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, FolderKanban, Image as ImageIcon, Package, Wrench } from 'lucide-react';

const areas = [
  { title: "Visitor analytics", description: "View visitor counts and recent page visits stored in the internal database.", href: "/admin/analytics", icon: FolderKanban, action: "View visitor analytics" },
  { title: "Feedback review", description: "Review, edit, approve, or reject customer feedback before it appears publicly.", href: "/admin/feedback", icon: CheckCircle2, action: "Open feedback review" },
  { title: "Submitted queries", description: "Review customer enquiries and contact requests sent through the website.", href: "/admin/queries", icon: ImageIcon, action: "View enquiries" },
  { title: "Products", description: "Add or update products through the product JSON files and related images.", href: "/products", icon: Package, action: "View product catalogue" },
  { title: "Services", description: "Maintain service descriptions, processes, galleries, and related service links.", href: "/services", icon: Wrench, action: "View services" },
  { title: "Projects", description: "Add recent project entries and project images to the portfolio data.", href: "/#portfolio", icon: FolderKanban, action: "View project portfolio" },
  { title: "Images and logos", description: "Store product, service, project, and partner images in the documented public folders.", href: "/admin", icon: ImageIcon, action: "See project guide" },
];

export default function AdminDashboardPage() {
  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Kalyani Enterprises</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">Admin dashboard</h1>
            <p className="mt-4 max-w-2xl text-gray-600">Manage customer feedback here and use the content guide to safely extend the catalogue, services, project portfolio, and media.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"><BookOpen className="h-4 w-4 text-orange-600" /> CONTENT_GUIDE.md in project root</span>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const Icon = area.icon;
            return <article key={area.title} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Icon className="h-5 w-5" /></div><h2 className="mt-5 text-xl font-bold text-gray-900">{area.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{area.description}</p><Link to={area.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">{area.action}<ArrowRight className="h-4 w-4" /></Link></article>;
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900"><strong>Current content model:</strong> feedback has an in-site approval workflow. Products, services, projects, brand logos, and images are file-managed so changes remain version-controlled and can be reviewed before publishing.</div>
      </div>
    </section>
  );
}