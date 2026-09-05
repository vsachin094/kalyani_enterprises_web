"use client";

import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { getPortfolioProjects } from '@/lib/data';
import { PortfolioCard } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Portfolio() {
  const projects = getPortfolioProjects();
  const { t } = useLanguage();
  const [activeType, setActiveType] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);
  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);
  const filteredProjects = activeType === 'All' ? projects : projects.filter((project) => project.type === activeType);
  const maxIndex = Math.max(0, filteredProjects.length - itemsPerView);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  useEffect(() => {
    if (!autoPlay || maxIndex === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((index) => index >= maxIndex ? 0 : index + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, maxIndex]);

  return (
    <section
      id="portfolio"
      className="section-transition relative overflow-hidden bg-white py-14 sm:py-24"
      aria-labelledby="portfolio-heading"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-100/50 blur-3xl pointer-events-none" aria-hidden="true" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-5 py-2.5 text-base font-semibold tracking-wide text-orange-700 mb-5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            {t('portfolioLabel')}
          </span>
          <h2 id="portfolio-heading" className="text-3xl sm:text-5xl lg:text-6xl leading-tight font-bold text-gray-900 mb-4 sm:mb-5">
            {t('portfolioHeading')} <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{t('recentProjects')}</span>
          </h2>
          <p className="text-lg text-gray-600">
            {t('portfolioDescription')}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12" role="tablist"
        >
          {['All', 'Residential', 'Commercial', 'Industrial', 'Institutional', 'Off-Grid'].map((type) => (
            <button
              key={type}
              role="tab"
              aria-selected={activeType === type}
              onClick={() => {
                setActiveType(type);
                setCurrentIndex(0);
              }}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                activeType === type
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
              )}
            >
              {type}
            </button>
          ))}
        </motion.div>

        {/* Projects Carousel */}
        <div className="relative" onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={cn(
              'absolute left-1 top-1/2 -translate-y-1/2 sm:-translate-x-12 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all disabled:opacity-30 disabled:pointer-events-none',
              'text-gray-600 hover:text-orange-600'
            )}
            aria-label="Previous projects"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: -currentIndex * (100 / itemsPerView) + '%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 30 }}
              className="flex pb-4"
              role="list"
            >
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    flex: `0 0 ${100 / itemsPerView}%`,
                    paddingRight: itemsPerView > 1 ? '24px' : '0',
                    minWidth: itemsPerView === 1 ? '280px' : undefined,
                  }}
                  role="listitem"
                >
                  <PortfolioCard
                    title={project.title}
                    type={project.type}
                    capacity={project.capacity}
                    location={project.location}
                    date={project.date}
                    image={project.image}
                    description={project.description}
                    client={project.client}
                  />
                </motion.article>
              ))}
            </motion.div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={cn(
              'absolute right-1 top-1/2 -translate-y-1/2 sm:translate-x-12 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all disabled:opacity-30 disabled:pointer-events-none',
              'text-gray-600 hover:text-orange-600'
            )}
            aria-label="Next projects"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  );
}
