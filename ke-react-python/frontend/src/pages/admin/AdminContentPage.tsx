import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Upload, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminCreateOffer, adminCreatePortfolio, adminCreateProduct, adminDeleteOffer, adminGetOffers, adminGetPortfolio, adminGetProducts, adminGetServices, adminSetOfferActive, adminSetVisibility, adminUploadImage } from '@/lib/api';
import { OfferBanner, PortfolioProject, Product } from '@/types';

const emptyProject = { title: '', type: 'Residential', capacity: '', location: '', date: '', description: '', client: '', details: '{}' };
const emptyProduct = { type: 'Product' as 'Product' | 'Service', name: '', short_description: '', full_description: '', features: '', benefits: '', applications: '', brands: '', price_range: '', availability: '', duration: '', warranty: '', service_areas: '', included_services: '', image: '' };

function remainingExpiry(expiresAt?: string) {
  if (!expiresAt) return 'No expiry';
  const remaining = new Date(expiresAt).getTime() - Date.now();
  if (remaining <= 0) return 'Expired';
  const minutes = Math.floor(remaining / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const leftoverMinutes = minutes % 60;
  return days ? `${days}d ${hours}h remaining` : hours ? `${hours}h ${leftoverMinutes}m remaining` : `${Math.max(1, leftoverMinutes)}m remaining`;
}

export default function AdminContentPage() {
  const token = localStorage.getItem('ke-admin-token') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Product[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [offers, setOffers] = useState<OfferBanner[]>([]);
  const [project, setProject] = useState(emptyProject);
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerLink, setOfferLink] = useState('');
  const [offerExpiresAt, setOfferExpiresAt] = useState('');
  const [offerImage, setOfferImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [publishingOffer, setPublishingOffer] = useState(false);
  const [previewOffer, setPreviewOffer] = useState<OfferBanner | null>(null);
  const [, refreshExpiry] = useState(0);
  const [product, setProduct] = useState(emptyProduct);
  const [productImage, setProductImage] = useState<File | null>(null);

  async function load() {
    const [nextProducts, nextServices, nextProjects, nextOffers] = await Promise.all([
      adminGetProducts(token), adminGetServices(token), adminGetPortfolio(token), adminGetOffers(token),
    ]);
    setProducts(nextProducts); setServices(nextServices); setProjects(nextProjects); setOffers(nextOffers);
  }

  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);
  useEffect(() => { const timer = window.setInterval(() => refreshExpiry((value) => value + 1), 30000); return () => window.clearInterval(timer); }, []);

  async function toggle(type: 'products' | 'services' | 'portfolio', item: Product | PortfolioProject) {
    await adminSetVisibility(token, type, item.id || '', !(item.visible ?? true));
    await load();
  }

  async function createProject(event: FormEvent) {
    event.preventDefault();
    try {
      const image = projectImage ? (await adminUploadImage(token, projectImage)).url : undefined;
      await adminCreatePortfolio(token, {
        title: project.title, type: project.type as PortfolioProject['type'], capacity: project.capacity,
        location: project.location, date: project.date, description: project.description,
        client: project.client, image: image || '', details: JSON.parse(project.details || '{}'), visible: true,
      });
      setProject(emptyProject); setProjectImage(null); setMessage('Project added successfully.'); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not add project.'); }
  }

  async function createProduct(event: FormEvent) {
    event.preventDefault();
    try {
      const image = productImage ? (await adminUploadImage(token, productImage)).url : product.image || undefined;
      await adminCreateProduct(token, {
        name: product.name,
        type: product.type,
        order: 999,
        short_description: product.short_description,
        full_description: product.full_description,
        image,
        features: product.features.split(',').map((item) => item.trim()).filter(Boolean),
        benefits: product.benefits.split(',').map((item) => item.trim()).filter(Boolean),
        applications: product.applications.split(',').map((item) => item.trim()).filter(Boolean),
        brands: product.brands.split(',').map((item) => item.trim()).filter(Boolean),
        price_range: product.type === 'Product' ? product.price_range : undefined,
        availability: product.type === 'Product' ? product.availability : undefined,
        duration: product.type === 'Service' ? product.duration : undefined,
        warranty: product.type === 'Service' ? product.warranty : undefined,
        service_areas: product.type === 'Service' ? product.service_areas.split(',').map((item) => item.trim()).filter(Boolean) : [],
        included_services: product.type === 'Service' ? product.included_services.split(',').map((item) => item.trim()).filter(Boolean) : [],
        visible: true,
      });
      setProduct(emptyProduct); setProductImage(null); setMessage(`${product.type} added successfully.`); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not add item.'); }
  }

  async function createOffer(event: FormEvent) {
    event.preventDefault();
    if (!offerImage) return setMessage('Choose an offer banner image first.');
    setPublishingOffer(true);
    setMessage('Uploading and publishing offer banner...');
    try {
      const image = await adminUploadImage(token, offerImage);
      await adminCreateOffer(token, { title: offerTitle, image: image.url, link: offerLink || undefined, expires_at: offerExpiresAt ? new Date(offerExpiresAt).toISOString() : undefined, active: true });
      setOfferTitle(''); setOfferLink(''); setOfferExpiresAt(''); setOfferImage(null); setMessage('Offer banner is live.'); await load();
    } catch (error) { setMessage(error instanceof Error ? `Could not publish offer: ${error.message}` : 'Could not publish offer.'); }
    finally { setPublishingOffer(false); }
  }

  async function removeOffer(id: string) { await adminDeleteOffer(token, id); await load(); }

  const VisibilityList = ({ title, items, type }: { title: string; items: Product[] | PortfolioProject[]; type: 'products' | 'services' | 'portfolio' }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-950">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-3"><span className="min-w-0 truncate text-sm font-medium text-gray-800">{'name' in item ? item.name : item.title}</span><div className="flex shrink-0 items-center gap-2"><Link to={`/admin/content/edit/${'name' in item ? (item.type === 'Service' ? 'service' : 'product') : 'project'}/${item.id}`} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-orange-700 ring-1 ring-gray-200 hover:bg-orange-50">Edit</Link><button type="button" onClick={() => toggle(type, item)} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold ${item.visible === false ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{item.visible === false ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}{item.visible === false ? 'Hidden' : 'Visible'}</button></div></div>)}
      </div>
    </div>
  );

  return <section className="min-h-[calc(100vh-8rem)] bg-gray-50 px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600"><ArrowLeft className="h-4 w-4" /> Back to admin</Link>
    <div className="mt-6"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Content controls</p><h1 className="mt-2 text-4xl font-bold text-gray-950">Projects, visibility & offers</h1><p className="mt-3 max-w-3xl text-gray-600">Add projects with images, hide products or services temporarily, and publish rotating offer banners.</p></div>
    {message && <p role="status" className="mt-5 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-800">{message}</p>}
    <div className="mt-8 grid gap-6 lg:grid-cols-3"><VisibilityList title="Products" items={products} type="products" /><VisibilityList title="Services" items={services} type="services" /><VisibilityList title="Projects" items={projects} type="portfolio" /></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <form onSubmit={createProduct} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-950">Add product or service</h2><p className="mt-2 text-sm text-gray-600">Choose what you are adding; the relevant fields will be used.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Type<select value={product.type} onChange={(event) => setProduct({ ...product, type: event.target.value as 'Product' | 'Service' })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal"><option value="Product">Product</option><option value="Service">Service</option></select></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Name<input required value={product.name} onChange={(event) => setProduct({ ...product, name: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Short description<textarea value={product.short_description} onChange={(event) => setProduct({ ...product, short_description: event.target.value })} className="mt-1 min-h-16 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Full description<textarea value={product.full_description} onChange={(event) => setProduct({ ...product, full_description: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Features <span className="font-normal text-gray-500">(comma separated)</span><input value={product.features} onChange={(event) => setProduct({ ...product, features: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label>{product.type === 'Product' ? <><label className="text-sm font-semibold text-gray-700">Price range<input value={product.price_range} onChange={(event) => setProduct({ ...product, price_range: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Availability<input value={product.availability} onChange={(event) => setProduct({ ...product, availability: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Applications<input value={product.applications} onChange={(event) => setProduct({ ...product, applications: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label></> : <><label className="text-sm font-semibold text-gray-700">Duration<input value={product.duration} onChange={(event) => setProduct({ ...product, duration: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Warranty<input value={product.warranty} onChange={(event) => setProduct({ ...product, warranty: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Service areas <span className="font-normal text-gray-500">(comma separated)</span><input value={product.service_areas} onChange={(event) => setProduct({ ...product, service_areas: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold text-gray-700 sm:col-span-2">Included services <span className="font-normal text-gray-500">(comma separated)</span><input value={product.included_services} onChange={(event) => setProduct({ ...product, included_services: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label></>}<label className="text-sm font-semibold text-gray-700 sm:col-span-2">Image<input type="file" accept="image/*" onChange={(event) => setProductImage(event.target.files?.[0] || null)} className="mt-1 block w-full text-sm font-normal" /></label></div><button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"><Upload className="h-4 w-4" /> Add {product.type}</button></form>
      <form onSubmit={createProject} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-950">Add project</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">
        {([['title','Title'],['type','Type'],['capacity','Capacity'],['location','Location'],['date','Date'],['client','Client']] as const).map(([key,label]) => <label key={key} className="text-sm font-semibold text-gray-700">{label}<input required={key === 'title'} value={project[key]} onChange={(event) => setProject({ ...project, [key]: event.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label>)}
        <label className="text-sm font-semibold text-gray-700 sm:col-span-2">Description<textarea value={project.description} onChange={(event) => setProject({ ...project, description: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal" /></label>
        <label className="text-sm font-semibold text-gray-700 sm:col-span-2">Technical details JSON<textarea value={project.details} onChange={(event) => setProject({ ...project, details: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-xs font-normal" /></label>
        <label className="text-sm font-semibold text-gray-700 sm:col-span-2">Project image<input type="file" accept="image/*" onChange={(event) => setProjectImage(event.target.files?.[0] || null)} className="mt-1 block w-full text-sm font-normal" /></label>
      </div><button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"><Upload className="h-4 w-4" /> Add project</button></form>
      <div className="space-y-6"><form onSubmit={createOffer} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-950">Publish offer banner</h2><p className="mt-2 text-sm text-gray-600">It appears for 30 seconds, rotates to the next offer, and stops appearing after the expiry time.</p><div className="mt-4 space-y-3"><label className="block text-sm font-semibold text-gray-700">Offer title<input required disabled={publishingOffer} value={offerTitle} onChange={(event) => setOfferTitle(event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal disabled:bg-gray-100" /></label><label className="block text-sm font-semibold text-gray-700">Optional link<input type="url" disabled={publishingOffer} value={offerLink} onChange={(event) => setOfferLink(event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal disabled:bg-gray-100" /></label><label className="block text-sm font-semibold text-gray-700">Expiry date and time <span className="font-normal text-gray-500">(optional)</span><input type="datetime-local" disabled={publishingOffer} value={offerExpiresAt} onChange={(event) => setOfferExpiresAt(event.target.value)} min={new Date().toISOString().slice(0, 16)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal disabled:bg-gray-100" /></label><input required disabled={publishingOffer} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={(event) => setOfferImage(event.target.files?.[0] || null)} className="block w-full text-sm" /></div><button type="submit" disabled={publishingOffer} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-wait disabled:bg-orange-300"><Upload className="h-4 w-4" /> {publishingOffer ? 'Publishing...' : 'Publish banner'}</button></form><div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-950">Published offers</h2><div className="mt-4 space-y-2">{offers.map((offer) => <div key={offer.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-3"><div className="min-w-0"><span className="block truncate text-sm font-medium">{offer.title}</span><span className="block text-xs text-gray-500">{remainingExpiry(offer.expires_at)}{offer.expires_at && ` · ${new Date(offer.expires_at).toLocaleString()}`}</span></div><div className="flex items-center gap-2"><button type="button" onClick={() => setPreviewOffer(offer)} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100">Preview</button><button type="button" onClick={() => adminSetOfferActive(token, offer.id, !offer.active).then(load).catch((error) => setMessage(error.message))} className={`rounded-lg px-3 py-2 text-xs font-semibold ${offer.active ? 'bg-green-50 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{offer.active ? 'Enabled' : 'Disabled'}</button><button type="button" onClick={() => removeOffer(offer.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${offer.title}`}><Trash2 className="h-4 w-4" /></button></div></div>)}</div></div></div>
      {previewOffer && <div role="dialog" aria-modal="true" aria-label={`Preview ${previewOffer.title}`} className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/80 p-4" onClick={() => setPreviewOffer(null)}><div className="relative max-h-full max-w-3xl" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setPreviewOffer(null)} className="absolute right-2 top-2 rounded-full bg-gray-950/75 px-3 py-2 text-white" aria-label="Close preview">×</button><img src={previewOffer.image} alt={previewOffer.title} className="max-h-[85vh] max-w-full rounded-xl object-contain" /></div></div>}
    </div>
  </div></section>;
}
