"use client";

import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { getTestimonials } from '@/lib/data';
import { TestimonialCard } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Testimonials() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState(getTestimonials());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  const [itemsPerView, setItemsPerView] = useState(1);
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  useEffect(() => {
    fetch('/api/feedback?status=approved')
      .then((response) => response.ok ? response.json() : [])
      .then((approved) => {
        if (Array.isArray(approved) && approved.length) {
          setTestimonials([...approved, ...getTestimonials()]);
        }
      })
      .catch(() => undefined);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      if (currentIndex >= maxIndex) {
        goToSlide(0);
      } else {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, maxIndex, autoPlay, goToSlide, nextSlide]);

  // Update items per view on resize
  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    };
    updateItemsPerView();
    const handleResize = () => {
      const newItemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      const newMaxIndex = Math.max(0, testimonials.length - newItemsPerView);
      setItemsPerView(newItemsPerView);
      setCurrentIndex(prev => Math.min(prev, newMaxIndex));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [testimonials.length]);

  return (
    <section
      id="testimonials"
      className="section-transition relative overflow-hidden bg-gray-50 py-14 sm:py-24"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-orange-100/50 blur-3xl pointer-events-none" aria-hidden="true" />
      
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
            {t('testimonialLabel')}
          </span>
          <h2 id="testimonials-heading" className="text-3xl sm:text-5xl lg:text-6xl leading-tight font-bold text-gray-900 mb-4 sm:mb-5">
            {t('testimonialHeading')} <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{t('customersSay')}</span>
          </h2>
          <p className="text-lg text-gray-600">
            {t('testimonialDescription')}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all disabled:opacity-30 disabled:pointer-events-none',
              'text-gray-600 hover:text-orange-600'
            )}
            aria-label="Previous testimonial"
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
              {testimonials.map((testimonial, index) => (
                <motion.article
                  key={`${testimonial.name}-${testimonial.date}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    flex: `0 0 ${100 / itemsPerView}%`,
                    paddingRight: itemsPerView > 1 ? '24px' : '0',
                    minWidth: itemsPerView === 1 ? '300px' : undefined,
                  }}
                  role="listitem"
                >
                  <TestimonialCard
                    name={testimonial.name}
                    location={testimonial.location}
                    text={testimonial.text}
                    rating={testimonial.rating}
                    photo={testimonial.photo ? (testimonial.photo.startsWith("/") ? testimonial.photo : testimonial.photo.startsWith("images/") ? "/" + testimonial.photo : "/images/" + testimonial.photo) : undefined}
                    project_type={testimonial.project_type}
                    date={testimonial.date}
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
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all disabled:opacity-30 disabled:pointer-events-none',
              'text-gray-600 hover:text-orange-600'
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 mt-8"
          role="tablist"
          aria-label="Testimonial navigation"
        >
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to testimonial group ${i + 1}`}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                i === currentIndex
                  ? 'bg-orange-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
            />
          ))}
        </motion.div>

        {/* Average Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">4.9</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 mx-2" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{testimonials.length}+</div>
              <div className="text-sm text-gray-600">{t('verifiedReviews')}</div>
            </div>
            <div className="w-px h-12 bg-gray-200 mx-2" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">{t('satisfactionRate')}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
