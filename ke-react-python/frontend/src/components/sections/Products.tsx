"use client";

import { motion } from 'framer-motion';
import { getProducts } from '@/lib/data';
import { ProductCard } from '@/components/ui/Card';
import { Sun, Battery, Zap, Box, House } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/providers/LanguageProvider';

const productIcons = {
  'Solar Panels': Sun,
  'Solar Inverters': Zap,
  'Solar Batteries': Battery,
  'Energy Storage': Box,
  'Power Inverters': Zap,
  'EV Battery Solutions': Battery,
  'Home Power Packages': House,
};

export function Products() {
  const products = getProducts();
  const { t } = useLanguage();

  return (
    <section
      id="products"
      className="section-transition relative overflow-hidden bg-white py-14 sm:py-24"
      aria-labelledby="products-heading"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-100/50 blur-3xl pointer-events-none" aria-hidden="true" />
      
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
            {t('productLabel')}
          </span>
          <h2 id="products-heading" className="text-3xl sm:text-5xl lg:text-6xl leading-tight font-bold text-gray-900 mb-4 sm:mb-5">
            {t('productsHeading')} <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{t('products')}</span>
          </h2>
          <p className="text-lg text-gray-600">
            {t('productsDescription')}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="list"
        >
          {products.map((product) => (
            <motion.article
              key={product.id}
              className="min-w-0"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              role="listitem"
            >
              <ProductCard
                name={product.name}
                icon={(() => { const Icon = productIcons[product.name as keyof typeof productIcons] || Box; return <Icon className="w-6 h-6" />; })()}
                features={product.features}
                image={product.image ? `/images/${product.image}` : undefined}
                href={`/products/${product.id}`}
                category="product"
              />
            </motion.article>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm rounded-xl border-2 border-orange-500 text-orange-600 font-semibold hover:bg-orange-500 hover:text-white transition-all sm:px-8 sm:py-3 sm:text-base"
          >
            {t('viewAllProducts')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
