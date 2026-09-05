"use client";

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Phone, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('ke-theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
    const syncThemeIcon = window.setTimeout(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    }, 0);
    return () => window.clearTimeout(syncThemeIcon);
  }, []);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('ke-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/services', label: t('services') },
    { href: '/#about', label: t('about') },
    { href: '/#contact', label: t('contact') },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-md border-b border-white/60'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-[4.5rem] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-2.5" aria-label="Kalyani Enterprises Home">
              <img
                src="/images/KE_Logo.png"
                alt="Kalyani Enterprises Logo"
                className="h-10 w-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] transition-transform group-hover:scale-105 sm:h-12 sm:w-12"
              />
              <span className="flex flex-col items-start whitespace-nowrap font-serif leading-none">
                <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="brand-shimmer text-[0.82rem] font-bold tracking-[0.08em] text-[#7e8f21] sm:text-[0.9rem]">KALYANI</motion.span>
                <motion.span initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12, duration: 0.5 }} className="brand-shimmer mt-1 text-[0.68rem] font-bold tracking-[0.12em] text-[#716400] sm:text-[0.77rem]">ENTERPRISES</motion.span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative rounded-full px-2 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="flex items-center rounded-full border border-gray-200 bg-white/80 p-1 text-xs font-semibold" aria-label={t('language')}>
              <button type="button" onClick={() => setLanguage('en')} className={cn('rounded-full px-2.5 py-1 transition', language === 'en' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-orange-600')}>EN</button>
              <button type="button" onClick={() => setLanguage('hi')} className={cn('rounded-full px-2.5 py-1 transition', language === 'hi' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-orange-600')}>हिन्दी</button>
            </div>
            <Button variant="call" size="sm" asChild>
              <a href="tel:+919162461804" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{t('callUs')}</span>
              </a>
            </Button>
            <Button variant="whatsapp" size="sm" asChild>
              <a href="https://wa.me/919162461804" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{t('whatsapp')}</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            <div className="pt-4 border-t flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="text-sm font-semibold text-gray-700">{t('language')}</span>
                  <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 text-xs font-semibold">
                    <button type="button" onClick={() => setLanguage('en')} className={cn('rounded-full px-3 py-1', language === 'en' ? 'bg-orange-500 text-white' : 'text-gray-500')}>EN</button>
                    <button type="button" onClick={() => setLanguage('hi')} className={cn('rounded-full px-3 py-1', language === 'hi' ? 'bg-orange-500 text-white' : 'text-gray-500')}>हिन्दी</button>
                  </div>
                </div>
                <Button variant="call" className="w-full" asChild>
                  <a href="tel:+919162461804" className="flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>{t('callUs')}: +91 9162461804</span>
                  </a>
                </Button>
                <Button variant="whatsapp" className="w-full" asChild>
                  <a href="https://wa.me/919162461804" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>{t('chatWhatsapp')}</span>
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
