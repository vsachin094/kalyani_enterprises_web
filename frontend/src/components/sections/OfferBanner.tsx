import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Maximize2, X } from 'lucide-react';
import { getOffers } from '@/lib/api';
import { OfferBanner as Offer } from '@/types';

export function OfferBanner() {
  const location = useLocation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewCloseRef = useRef<HTMLButtonElement>(null);
  const offer = offers[index];

  useEffect(() => { getOffers().then(setOffers).catch(() => undefined); }, []);
  useEffect(() => {
    if (!offers.length || !open) return;
    const timer = window.setTimeout(() => {
      if (index < offers.length - 1) {
        setIndex((current) => current + 1);
      } else {
        setOpen(false);
      }
    }, 30000);
    return () => window.clearTimeout(timer);
  }, [offers.length, index, open]);

  useEffect(() => {
    const closePreview = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewOpen(false);
    };
    window.addEventListener('keydown', closePreview);
    return () => window.removeEventListener('keydown', closePreview);
  }, []);

  useEffect(() => {
    if (!previewOpen) return;
    previewCloseRef.current?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !previewRef.current) return;
      const controls = Array.from(previewRef.current.querySelectorAll<HTMLElement>('button, a[href]'));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, [previewOpen]);

  useEffect(() => {
    setPreviewOpen(false);
    setIsWide(false);
  }, [offer?.id]);

  if (location.pathname.startsWith('/admin') || !offer || !open) return null;

  return (
    <>
    <aside className={`fixed bottom-4 right-4 z-[60] ${isWide ? 'w-[min(34rem,calc(100vw-2rem))]' : 'w-[min(21rem,calc(100vw-2rem))]'} animate-in fade-in slide-in-from-right-4 duration-500 sm:bottom-6 sm:right-6`} aria-label="Current offer">
      <button type="button" onClick={() => setOpen(false)} aria-label="Close offer" className="absolute right-2 top-2 z-10 rounded-full bg-gray-950/70 p-1.5 text-white hover:bg-gray-950"><X className="h-4 w-4" /></button>
      <button type="button" onClick={() => setPreviewOpen(true)} className="group relative block w-full overflow-hidden rounded-2xl text-left shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-400/60" aria-label={`Open ${offer.title} offer`}>
        <img src={offer.image} alt={offer.title} onLoad={(event) => setIsWide(event.currentTarget.naturalWidth > event.currentTarget.naturalHeight)} className="block h-auto max-h-56 w-full rounded-2xl object-contain" />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gray-950/70 px-3 py-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus:opacity-100"><Maximize2 className="h-3.5 w-3.5" /> View offer</span>
      </button>
    </aside>
    {previewOpen && <div role="dialog" aria-modal="true" aria-label={offer.title} className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/90 p-4 sm:p-8" onClick={() => setPreviewOpen(false)}>
      <div ref={previewRef} className="relative flex max-h-full max-w-full flex-col items-center" onClick={(event) => event.stopPropagation()}>
        <button ref={previewCloseRef} type="button" onClick={() => setPreviewOpen(false)} aria-label="Close offer preview" className="absolute right-2 top-2 z-10 rounded-full bg-gray-950/75 p-2 text-white hover:bg-gray-950"><X className="h-5 w-5" /></button>
        <img src={offer.image} alt={offer.title} className="block h-auto max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" />
        {offer.link && <a href={offer.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"><ExternalLink className="h-4 w-4" /> Open offer link</a>}
      </div>
    </div>}
    </>
  );
}
