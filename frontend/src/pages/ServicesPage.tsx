import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Search, ToolCase, Wrench } from 'lucide-react';
import { getServices } from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/Card';

const icons = { "Solar Installation": ToolCase, "Maintenance & Support": Wrench, "Site Inspection & Consultation": Search, "Custom Power Solutions": Lightbulb };

export default function ServicesPage() {
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then(setServices).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="bg-gray-50 pt-28 pb-20 min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading services...</p></div>;
  }

  return (
    <div className="bg-gray-50 pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/#services" className="text-sm font-semibold text-orange-600">← Back to home</Link>
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-[0.2em] text-orange-600">End-to-end support</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">Power & energy services built around you</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">From feasibility and design to installation and long-term support, our team manages the full journey.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = icons[service.name as keyof typeof icons] ?? ToolCase;
            return <ProductCard key={service.id} name={service.name} icon={<Icon className="h-6 w-6" />} features={service.features} image={service.image ? "/images/" + service.image : undefined} href={"/services/" + service.id} category="service" />;
          })}
        </div>
      </div>
    </div>
  );
}