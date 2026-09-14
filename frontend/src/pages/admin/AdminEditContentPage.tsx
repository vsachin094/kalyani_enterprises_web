import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminGetPortfolio, adminGetProducts, adminGetServices, adminUpdatePortfolio, adminUpdateProduct, adminUploadImage } from '@/lib/api';
import { PortfolioProject, Product } from '@/types';

export default function AdminEditContentPage() {
  const { type, id } = useParams<{ type: 'product' | 'service' | 'project'; id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('ke-admin-token') || '';
  const [product, setProduct] = useState<Product | null>(null);
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [details, setDetails] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id || !type) return;
    const load = type === 'project'
      ? adminGetPortfolio(token).then((items) => {
          const item = items.find((entry) => entry.id === id) || null;
          setProject(item);
          setDetails(JSON.stringify(item?.details || {}, null, 2));
        })
      : Promise.all([adminGetProducts(token), adminGetServices(token)]).then(([products, services]) => {
          setProduct([...products, ...services].find((entry) => entry.id === id) || null);
        });
    load.catch((error) => setMessage(error instanceof Error ? error.message : 'Could not load content.')).finally(() => setLoading(false));
  }, [id, type, token]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!id || !type) return;
    setSaving(true);
    try {
      if (type === 'project' && project) {
        const uploaded = image ? (await adminUploadImage(token, image)).url : project.image;
        await adminUpdatePortfolio(token, id, { title: project.title, type: project.type, capacity: project.capacity, location: project.location, date: project.date, client: project.client, description: project.description, image: uploaded, details: JSON.parse(details || '{}') });
      } else if (product) {
        const uploaded = image ? (await adminUploadImage(token, image)).url : product.image;
        await adminUpdateProduct(token, id, { name: product.name, short_description: product.short_description, full_description: product.full_description, image: uploaded, features: product.features, benefits: product.benefits, applications: product.applications, brands: product.brands, price_range: product.price_range, availability: product.availability, duration: product.duration, warranty: product.warranty, service_areas: product.service_areas, included_services: product.included_services });
      }
      navigate('/admin/content');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 px-4 py-24 text-center text-gray-500">Loading content...</div>;
  if (!product && !project) return <div className="min-h-screen bg-gray-50 px-4 py-24 text-center"><p className="text-red-700">Content not found.</p><Link to="/admin/content" className="mt-4 inline-block font-semibold text-orange-600">Back to content</Link></div>;

  return <section className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><Link to="/admin/content" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600"><ArrowLeft className="h-4 w-4" /> Back to content</Link><h1 className="mt-6 text-4xl font-bold text-gray-950">Edit {type === 'project' ? 'project' : type}</h1>{message && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
    <form onSubmit={save} className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      {project ? <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Title<input required value={project.title} onChange={(event) => setProject({ ...project, title: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Type<input value={project.type} onChange={(event) => setProject({ ...project, type: event.target.value as PortfolioProject['type'] })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Capacity<input value={project.capacity || ''} onChange={(event) => setProject({ ...project, capacity: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Location<input value={project.location || ''} onChange={(event) => setProject({ ...project, location: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Date<input value={project.date || ''} onChange={(event) => setProject({ ...project, date: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Client<input value={project.client || ''} onChange={(event) => setProject({ ...project, client: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Description<textarea value={project.description || ''} onChange={(event) => setProject({ ...project, description: event.target.value })} className="mt-1 min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Technical details JSON<textarea value={details} onChange={(event) => setDetails(event.target.value)} className="mt-1 min-h-32 w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-xs font-normal" /></label></div> : <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Name<input required value={product!.name} onChange={(event) => setProduct({ ...product!, name: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Short description<textarea value={product!.short_description || ''} onChange={(event) => setProduct({ ...product!, short_description: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Full description<textarea value={product!.full_description || ''} onChange={(event) => setProduct({ ...product!, full_description: event.target.value })} className="mt-1 min-h-28 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Features, comma separated<input value={product!.features.join(', ')} onChange={(event) => setProduct({ ...product!, features: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label>{product!.type === 'Product' ? <><label className="text-sm font-semibold text-gray-700">Price range<input value={product!.price_range || ''} onChange={(event) => setProduct({ ...product!, price_range: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Availability<input value={product!.availability || ''} onChange={(event) => setProduct({ ...product!, availability: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label></> : <><label className="text-sm font-semibold text-gray-700">Duration<input value={product!.duration || ''} onChange={(event) => setProduct({ ...product!, duration: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Warranty<input value={product!.warranty || ''} onChange={(event) => setProduct({ ...product!, warranty: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label></>}</div>}
      <label className="mt-5 block text-sm font-semibold text-gray-700">Replace image <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} className="mt-1 block w-full text-sm font-normal" /></label><button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300"><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save changes'}</button>
    </form></div></section>;
}
