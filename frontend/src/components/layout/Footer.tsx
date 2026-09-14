import { Link } from 'react-router-dom';
// Using regular img tags
import { ArrowRight } from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'Solar Panels', href: '/products/solar-panels' },
    { label: 'Solar Inverters', href: '/products/solar-inverters' },
    { label: 'Solar Batteries', href: '/products/solar-batteries' },
    { label: 'Energy Storage', href: '/products/energy-storage' },
    { label: 'Power Inverters', href: '/products/power-inverters' },
    { label: 'EV Battery Solutions', href: '/products/ev-batteries' },
    { label: 'Home Power Packages', href: '/products/home-energy-solutions' },
  ],
  services: [
    { label: 'Solar Installation', href: '/services/solar-installation' },
    { label: 'Power Solutions', href: '/services/power-solutions' },
    { label: 'Site Inspection', href: '/services/site-inspection' },
    { label: 'Maintenance & Support', href: '/services/maintenance-support' },
  ],
  company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Our Portfolio', href: '/#portfolio' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog — Coming Soon', href: '#' },
  ],
  support: [
    { label: 'Contact Us', href: '/#contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Warranty Info', href: '/warranty' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-orange-400/20 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300" role="contentinfo">
      <div className="h-1 bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          {/* Company Info */}
          <div className="max-w-sm">
            <Link to="/#home" className="group inline-flex items-center gap-2.5" aria-label="Kalyani Enterprises Home">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 shadow-lg shadow-black/20 sm:h-12 sm:w-12">
                <img
                  src="/images/KE_Logo.png"
                  alt="Kalyani Enterprises Logo"
                  className="h-full w-full object-contain transition-transform group-hover:scale-105"
                />
              </span>
              <span className="flex flex-col items-start whitespace-nowrap font-serif leading-none">
                <span className="text-[0.82rem] font-bold tracking-[0.08em] text-[#9aaa2a] transition-colors group-hover:text-orange-400 sm:text-[0.9rem]">KALYANI</span>
                <span className="mt-1 text-[0.68rem] font-bold tracking-[0.12em] text-[#d1bd19] transition-colors group-hover:text-orange-400 sm:text-[0.77rem]">ENTERPRISES</span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-7 text-gray-400">
              Kalyani Enterprises is a proprietorship business and authorized
              distributor of Livguard Solar and Livguard Energy. Our trusted
              channel partnerships support multi-brand and custom power solutions.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Products</h3>
              <ul className="space-y-3" role="list">
                {footerLinks.products.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      {link.label}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Services</h3>
              <ul className="space-y-3" role="list">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      {link.label}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Company</h3>
              <ul className="space-y-3" role="list">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      {link.label}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Support</h3>
              <ul className="space-y-3" role="list">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      {link.label}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Kalyani Enterprises. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/#contact" className="hover:text-orange-400 transition-colors">Contact us</Link>
            <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-orange-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
