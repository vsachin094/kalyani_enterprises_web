"use client";

import { motion } from 'framer-motion';
import { getServices } from '@/lib/data';
import { ProductCard } from '@/components/ui/Card';
import { ToolCase, Wrench, Search, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

const serviceIcons = {
  'Solar Installation': ToolCase,
  'Power Solutions': Lightbulb,
  'Site Inspection': Search,
  'Maintenance & Support': Wrench,
};

export function Services() {
  const services = getServices();
  const { t } = useLanguage();

  return (
    <section
      id="services"
      className="section-transition relative overflow-hidden bg-gray-50 py-14 sm:py-24"
      aria-labelledby="services-heading"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-100/50 blur-3xl pointer-events-none" aria-hidden="true" />
      
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
            {t('serviceLabel')}
          </span>
          <h2 id="services-heading" className="text-3xl sm:text-5xl lg:text-6xl leading-tight font-bold text-gray-900 mb-4 sm:mb-5">
            {t('servicesHeading')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('servicesDescription')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
        >
          {services.map((service) => (
            <motion.article
              key={service.id}
              className="min-w-0"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              role="listitem"
            >
              <ProductCard
                name={service.name}
                icon={(() => { const Icon = serviceIcons[service.name as keyof typeof serviceIcons] || ToolCase; return <Icon className="w-6 h-6" />; })()}
                features={service.features}
                image={service.image ? `/images/${service.image}` : undefined}
                href={`/services/${service.id}`}
                category="service"
              />
            </motion.article>
          ))}
        </motion.div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <div className="bg-white rounded-3xl p-5 sm:p-12 border border-gray-100">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t('processHeading')}</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">{t('processDescription')}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-10 left-10 right-10 h-0.5 bg-gradient-to-r from-orange-200 to-amber-200" aria-hidden="true" />
              
              {[
                { step: 1, title: 'Site Assessment', desc: 'Detailed site survey & feasibility study', icon: Search },
                { step: 2, title: 'System Design', desc: 'Customized design based on energy needs', icon: Lightbulb },
                { step: 3, title: 'Installation', desc: 'Professional mounting & electrical integration', icon: ToolCase },
                { step: 4, title: 'Commissioning', desc: 'Testing, activation & handover', icon: Wrench },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.step * 0.1 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
