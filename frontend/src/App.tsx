import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { AnalyticsTracker } from '@/components/privacy/AnalyticsTracker';
import HomePage from '@/pages/HomePage';
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));
const CareersPage = lazy(() => import('@/pages/CareersPage'));
const FAQsPage = lazy(() => import('@/pages/FAQsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const WarrantyPage = lazy(() => import('@/pages/WarrantyPage'));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminFeedbackPage = lazy(() => import('@/pages/admin/AdminFeedbackPage'));
const AdminQueriesPage = lazy(() => import('@/pages/admin/AdminQueriesPage'));
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/AdminAnalyticsPage'));
const AdminContentPage = lazy(() => import('@/pages/admin/AdminContentPage'));
const AdminEditContentPage = lazy(() => import('@/pages/admin/AdminEditContentPage'));
import { OfferBanner } from '@/components/sections/OfferBanner';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      if (!target) return;

      const headerOffset = 88;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return (
    <LanguageProvider>
      <div className="min-h-full flex flex-col overflow-x-hidden bg-white text-gray-900">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center bg-gray-50 text-sm text-gray-500">Loading page...</div>}><Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/warranty" element={<WarrantyPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
              <Route path="/admin/queries" element={<AdminQueriesPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/content" element={<AdminContentPage />} />
              <Route path="/admin/content/edit/:type/:id" element={<AdminEditContentPage />} />
            </Route>
          </Routes></Suspense>
        </main>
        <Footer />
        <FloatingActions />
        <AnalyticsTracker />
        <OfferBanner />
      </div>
    </LanguageProvider>
  );
}
