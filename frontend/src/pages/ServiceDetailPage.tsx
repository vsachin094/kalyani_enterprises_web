import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ClipboardCheck, ClipboardList, Clock3, Lightbulb, MapPinned, MessageSquare, Phone, Search, Wrench } from 'lucide-react';
import { getServices } from '@/lib/api';
import { Product } from '@/types';
import { DetailGallery } from '@/components/ui/DetailGallery';
import { CompactRelatedCard } from '@/components/ui/CompactRelatedCard';

const serviceIcons = { "Solar Installation": Wrench, "Maintenance & Support": Wrench, "Site Inspection & Consultation": Search, "Custom Power Solutions": Lightbulb };

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Product | null>(null);
  const [allServices, setAllServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then((services) => {
      setAllServices(services);
      setService(services.find((item) => item.id === slug) || null);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="bg-gray-50 pt-28 pb-20 min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading service...</p></div>;
  }

  if (!service) {
    return <div className="bg-gray-50 pt-28 pb-20 min-h-screen flex items-center justify-center"><p className="text-gray-500">Service not found.</p></div>;
  }

  const images = [service.image, ...(service.gallery || [])].filter((image): image is string => Boolean(image));
  const relatedServices = allServices.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <div className="bg-gray-50 pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link to="/#services" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600"><ArrowLeft className="h-4 w-4" /> Back to services</Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <DetailGallery images={images} title={service.name} />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Power & energy services</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-5xl">{service.name}</h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">{service.full_description || service.short_description}</p>
            <div className="mt-8 space-y-3">{service.features.map((feature) => <div key={feature} className="flex gap-3 text-gray-700"><Check className="mt-1 h-5 w-5 shrink-0 text-green-600" />{feature}</div>)}</div>
            <div className="mt-9 flex flex-wrap gap-3"><a href="tel:+919162461804" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white"><Phone className="h-4 w-4" /> Talk to an expert</a><a href="https://wa.me/919162461804" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800"><MessageSquare className="h-4 w-4" /> WhatsApp</a></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-gray-200 bg-white p-4"><Clock3 className="h-5 w-5 text-orange-600" /><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Timeline</p><p className="mt-1 text-sm font-semibold text-gray-900">{service.duration || "As agreed"}</p></div><div className="rounded-2xl border border-gray-200 bg-white p-4"><MapPinned className="h-5 w-5 text-orange-600" /><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Coverage</p><p className="mt-1 text-sm font-semibold text-gray-900">{service.service_areas?.join(", ") || "Across Jharkhand"}</p></div><div className="rounded-2xl border border-gray-200 bg-white p-4"><ClipboardCheck className="h-5 w-5 text-orange-600" /><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Support</p><p className="mt-1 text-sm font-semibold text-gray-900">Requirement-led</p></div></div>
          </div>
        </div>
        {service.process && <div className="mt-16 rounded-3xl bg-gray-950 p-6 text-white sm:p-8"><h2 className="text-2xl font-bold">How it works</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{service.process.map((step) => <div key={step.step} className="relative"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold">{step.step}</div><h3 className="mt-4 font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-gray-400">{step.description}</p></div>)}</div></div>}
        {service.included_services && <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-bold text-gray-950">What this service can include</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{service.included_services.map((item) => <div key={item} className="flex gap-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700"><Check className="h-5 w-5 shrink-0 text-green-600" />{item}</div>)}</div></section>}
        {service.warranty && <p className="mt-8 text-center text-sm text-gray-500">{service.warranty}</p>}
        {relatedServices.length > 0 && <section className="mt-16"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Complete the journey</p><h2 className="mt-2 text-3xl font-bold text-gray-950">Related services</h2><p className="mt-2 text-gray-600">A few other services you may want to explore.</p></div><Link to="/services" className="text-sm font-semibold text-orange-600">View all services →</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{relatedServices.map((item) => { const Icon = serviceIcons[item.name as keyof typeof serviceIcons] ?? ClipboardList; return <CompactRelatedCard key={item.id} name={item.name} description={item.short_description} icon={<Icon className="h-5 w-5" />} image={item.image ? (item.image.startsWith("/") ? item.image : `/images/${item.image}`) : undefined} href={`/services/${item.id}`} category="service" />; })}</div></section>}
      </div>
    </div>
  );
}