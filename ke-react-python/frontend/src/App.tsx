import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { ConsentBanner } from '@/components/privacy/ConsentBanner';
import { AnalyticsTracker } from '@/components/privacy/AnalyticsTracker';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import FeedbackPage from '@/pages/FeedbackPage';
import CareersPage from '@/pages/CareersPage';
import FAQsPage from '@/pages/FAQsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import WarrantyPage from '@/pages/WarrantyPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminFeedbackPage from '@/pages/admin/AdminFeedbackPage';
import AdminQueriesPage from '@/pages/admin/AdminQueriesPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-full flex flex-col overflow-x-hidden bg-white text-gray-900">
        <Header />
        <main className="flex-1">
          <Routes>
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
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
            <Route path="/admin/queries" element={<AdminQueriesPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingActions />
        <AnalyticsTracker />
        <ConsentBanner />
      </div>
    </LanguageProvider>
  );
}