import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Battery, Box, Check, House, Phone, MessageSquare, ShieldCheck, Sparkles, Sun, Zap } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { DetailGallery } from '@/components/ui/DetailGallery';
import { CompactRelatedCard } from '@/components/ui/CompactRelatedCard';

const productIcons = { "Solar Panels": Sun, "Solar Batteries": Battery, "Solar Inverters": Zap, "Power Inverters": Zap, "Energy Storage Systems": Box, "EV Battery Solutions": Battery, "Home Power Packages": House };

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((products) => {
      setAllProducts(products);
      setProduct(products.find((item) => item.id === slug) || null);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="bg-gray-50 pt-28 pb-20 min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading product...</p></div>;
  }

  if (!product) {
    return <div className="bg-gray-50 pt-28 pb-20 min-h-screen flex items-center justify-center"><p className="text-gray-500">Product not found.</p></div>;
  }

  const images = [product.image, ...(product.gallery || [])].filter((image): image is string => Boolean(image));
  const relatedProducts = (product.related_products?.map((id) => allProducts.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)) || allProducts.filter((item) => item.id !== product.id)).slice(0, 3);

  return (
    <div className="bg-gray-50 pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link to="/#products" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600"><ArrowLeft className="h-4 w-4" /> Back to products</Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <DetailGallery images={images} title={product.name} />
          <div>
            <div className="flex flex-wrap items-center gap-3"><p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Power & energy products</p>{product.availability && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{product.availability}</span>}</div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">{product.full_description || product.short_description}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{product.features.map((feature) => <div key={feature} className="flex gap-3 text-gray-700"><Check className="mt-1 h-5 w-5 shrink-0 text-green-600" />{feature}</div>)}</div>
            <div className="mt-9 flex flex-wrap gap-3"><a href="tel:+919162461804" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white"><Phone className="h-4 w-4" /> Get a quote</a><a href="https://wa.me/919162461804" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800"><MessageSquare className="h-4 w-4" /> WhatsApp</a></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4"><ShieldCheck className="h-5 w-5 text-orange-600" /><p className="mt-2 text-sm font-semibold text-gray-900">Brand-backed options</p><p className="mt-1 text-xs leading-5 text-gray-600">Product and warranty terms depend on the selected brand and model.</p></div><div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4"><Sparkles className="h-5 w-5 text-blue-600" /><p className="mt-2 text-sm font-semibold text-gray-900">Requirement-led selection</p><p className="mt-1 text-xs leading-5 text-gray-600">We help match capacity, application, budget, and future needs.</p></div></div>
          </div>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {product.specifications && <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2 sm:p-8"><h2 className="text-2xl font-bold text-gray-950">Specifications</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{Object.entries(product.specifications).map(([key, value]) => <div key={key} className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm"><span className="font-medium text-gray-500">{key}</span><span className="text-right font-semibold text-gray-900">{value}</span></div>)}</div></div>}
          {product.applications && <div className="rounded-3xl bg-gray-950 p-6 text-white sm:p-8"><h2 className="text-2xl font-bold">Suitable for</h2><ul className="mt-6 space-y-3">{product.applications.map((item) => <li key={item} className="flex gap-3 text-sm text-gray-300"><Check className="h-5 w-5 shrink-0 text-orange-400" />{item}</li>)}</ul></div>}
        </div>
        {product.benefits && <section className="mt-10 rounded-3xl border border-orange-100 bg-orange-50/60 p-6 sm:p-8"><h2 className="text-2xl font-bold text-gray-950">Why consider this option?</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{product.benefits.map((benefit) => <div key={benefit} className="rounded-2xl bg-white p-4 text-sm text-gray-700 shadow-sm">{benefit}</div>)}</div></section>}
        {relatedProducts.length > 0 && <section className="mt-16"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Continue exploring</p><h2 className="mt-2 text-3xl font-bold text-gray-950">Related products</h2><p className="mt-2 text-gray-600">A few other options you may want to explore.</p></div><Link to="/products" className="text-sm font-semibold text-orange-600">View all products →</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{relatedProducts.map((item) => { const Icon = productIcons[item.name as keyof typeof productIcons] ?? Box; return <CompactRelatedCard key={item.id} name={item.name} description={item.short_description} icon={<Icon className="h-5 w-5" />} image={item.image ? (item.image.startsWith("/") ? item.image : `/images/${item.image}`) : undefined} href={`/products/${item.id}`} category="product" />; })}</div></section>}
      </div>
    </div>
  );
}