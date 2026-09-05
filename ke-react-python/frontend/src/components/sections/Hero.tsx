"use client";

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { HeroScene } from '@/components/3d/HeroScene';
import { Button } from '@/components/ui/Button';
import { getBrandLogos } from '@/lib/data';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Hero() {
  const { t } = useLanguage();
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <HeroScene />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-gray-950/80 via-gray-900/40 to-gray-950/80"
        aria-hidden="true"
      />

      {/* Subtle energy-wave backdrop */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[58vw] max-h-[680px] w-[105vw] max-w-[1250px] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] rounded-[50%] border border-orange-300/15 animate-[spin_32s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[42vw] max-h-[500px] w-[78vw] max-w-[950px] -translate-x-1/2 -translate-y-1/2 rotate-[18deg] rounded-[50%] border border-amber-200/15 animate-[spin_24s_linear_infinite_reverse]" />
        <div className="absolute left-1/2 top-[46%] h-px w-[70%] -translate-x-1/2 rotate-[-8deg] bg-gradient-to-r from-transparent via-orange-300/30 to-transparent blur-[1px]" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8 lg:py-48">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex justify-center" aria-label="Kalyani Enterprises">
              <img src="/images/KE_Logo.png" alt="Kalyani Enterprises logo" className="h-20 w-20 object-contain drop-shadow-2xl sm:h-24 sm:w-24" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-5 sm:mb-6"
          >
            {t('heroTitle')} <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">{t('heroTitleAccent')}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t('heroDescription')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button variant="default" size="lg" className="h-12 px-5 text-sm sm:h-14 sm:px-8 sm:text-base" asChild>
              <a href="https://wa.me/919162461804" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                {t('requestQuote')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-5 text-sm sm:h-14 sm:px-8 sm:text-base" asChild>
              <a href="tel:+919162461804" className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {t('callNow')}
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
          aria-hidden="true"
        >
          <ArrowDown className="w-8 h-8 text-white/50" />
        </motion.div>
      </div>

      {/* Brand Logos Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-4 sm:py-8">
        <BrandMarquee />
      </div>
    </section>
  );
}

// Brand Marquee Component
function BrandMarquee() {
  const brandLogos = getBrandLogos();
  const brands = [...brandLogos, ...brandLogos];

  return (
    <div className="overflow-hidden" aria-label="Brands we work with through direct and channel partnerships">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Brands we work with</p>
      <div className="flex items-center gap-6 sm:gap-12 animate-marquee whitespace-nowrap" style={{ animationDuration: '30s' }}>{
        brands.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="flex h-16 w-36 flex-shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/90 px-4 shadow-lg shadow-black/10 backdrop-blur-sm sm:h-20 sm:w-44 sm:px-5"
          >
            {brand.image ? (
              <img
                src={brand.image}
                alt={brand.alt}
                className="max-h-12 max-w-full object-contain transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            ) : (
              <span className="text-center text-sm font-semibold leading-tight text-gray-700">{brand.name}</span>
            )}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
