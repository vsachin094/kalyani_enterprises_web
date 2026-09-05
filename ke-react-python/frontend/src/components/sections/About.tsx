"use client";

import { motion } from 'framer-motion';
import { Award, Shield, Users, Truck, Check, Zap, Battery, Sun, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

const features = [
  {
    icon: Award,
    title: 'Authorized Livguard Distribution',
    desc: 'Authorized distributor of Livguard Solar and Livguard Energy products',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Multi-Brand, Multi-Solution Capability',
    desc: 'Trusted channel partnerships help us provide custom solar, energy, backup, and electrical solutions',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    icon: Truck,
    title: 'Professional Installation Services',
    desc: 'Expert technicians for residential, commercial, and industrial installations',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Users,
    title: 'After-Sales Support & Warranty',
    desc: 'Comprehensive support, maintenance, and warranty coordination across Jharkhand',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
];

const values = [
  { title: 'Integrity', desc: 'Honest advice and transparent pricing for every customer' },
  { title: 'Quality', desc: 'Genuine products from trusted manufacturers and authorized supply channels' },
  { title: 'Service', desc: 'End-to-end support from consultation to maintenance' },
  { title: 'Sustainability', desc: 'Committed to a greener future for Jharkhand' },
];

const stats = [
  { value: '10+', label: 'Years of Experience' },
  { value: '500+', label: 'Projects Completed' },
  { value: '1000+', label: 'Happy Customers' },
  { value: '4+', label: 'Brand Partnerships' },
];

const capabilities = [
  { icon: Sun, title: 'Solar Systems', desc: 'On-grid, off-grid & hybrid solar installations' },
  { icon: Battery, title: 'Batteries & Storage', desc: 'Inverter batteries & energy storage solutions' },
  { icon: Zap, title: 'Power Backup', desc: 'Inverters, UPS & generator coordination' },
  { icon: Wrench, title: 'Electrical Services', desc: 'Installation, maintenance & commissioning' },
];

export function About() {
  const { t } = useLanguage();
  return (
    <section
      id="about"
      className="section-transition relative overflow-hidden bg-white py-16 sm:py-24 lg:py-28"
      aria-labelledby="about-heading"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-100/50 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-100/40 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-5 py-2.5 text-sm sm:text-base font-semibold tracking-wide text-orange-700 mb-5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            {t('aboutLabel')}
          </span>
          <h2 id="about-heading" className="text-3xl sm:text-4xl lg:text-5xl leading-tight font-bold text-gray-900 mb-4 sm:mb-5">
            {t('trustedPartner')} <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{t('powerEnergySolutions')}</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {t('aboutIntro')}
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14 sm:mb-20"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center p-5 sm:p-6 bg-gradient-to-br from-gray-50 to-orange-50/50 rounded-2xl border border-gray-100 text-center"
            >
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-1">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start"
        >
          {/* Left: Image & About Text */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-3xl blur-2xl" aria-hidden="true" />
              <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50">
                <img
                  src="/images/about_us.png"
                  alt="Kalyani Enterprises solar installation team at work"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('completePower')}</h3>
              <p className="text-gray-600 leading-relaxed">
                Kalyani Enterprises is an authorized distributor of <strong>Livguard Solar and Livguard Energy</strong>, supplying their range of solar, inverter, battery, and energy products. We are not limited to one brand or one type of solution: through trusted channel partnerships, we can coordinate additional brands and technologies for custom solar-energy, power-backup, battery, and electrical requirements.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our work covers solar systems, inverters, batteries, electrical products, power backup, energy storage, installation, commissioning, maintenance, and other services related to power systems. When a project needs a specific brand, capacity, or combination of technologies, our channel-partner network helps us create a practical custom solution for the customer.
              </p>
            </div>
          </div>

          {/* Right: Features & Capabilities */}
          <div className="space-y-10">
            {/* Capabilities Grid */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">What We Offer</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {capabilities.map((cap, i) => (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <cap.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{cap.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{cap.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">{t('whyUs')}</h3>
              <div className="space-y-4" role="list">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors"
                    role="listitem"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", feature.bg, feature.color)}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Values - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 sm:mt-20"
        >
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{t('coreValues')}</h3>
            <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" aria-hidden="true" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="list">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex flex-col items-start gap-3 p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-orange-200 transition-all"
                role="listitem"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 border border-green-100 flex-shrink-0">
                  <Check className="w-5 h-5 text-green-500" />
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{value.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}