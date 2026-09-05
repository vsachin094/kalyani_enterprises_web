import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Battery, Box, House, Sun, Zap } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/Card';

const icons = { "Solar Panels": Sun, "Solar Batteries": Battery, "Solar Inverters": Zap, "Power Inverters": Zap, "Energy Storage Systems": Box, "EV Battery Solutions": Battery, "Home Power Packages": House };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="bg-gray-50 pt-28 pb-20 min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading products...</p></div>;
  }

  return (
    <div className="bg-gray-50 pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/#products" className="text-sm font-semibold text-orange-600">← Back to home</Link>
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-[0.2em] text-orange-600">Our catalogue</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">Power products for every need</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">Reliable solar, inverter, battery, EV, electrical, and energy-storage products supplied across Jharkhand through our brand and channel network.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const Icon = icons[product.name as keyof typeof icons] ?? Box;
            return <ProductCard key={product.id} name={product.name} icon={<Icon className="h-6 w-6" />} features={product.features} image={product.image ? "/images/" + product.image : undefined} href={"/products/" + product.id} category="product" />;
          })}
        </div>
      </div>
    </div>
  );
}