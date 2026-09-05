"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { submitQuery } from '@/lib/api';

export function Contact() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    try {
      await submitQuery(formData);
      setFormState('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormState('idle'), 5000);
    } catch {
      setFormState('error');
    }
  };

  const contactInfo = [
    { icon: MapPin, title: 'Visit Us', details: 'Village - Potma, Bajrang Chowk, Post Office - Sabalpur, Rajdhanwar Road, Sariya, Giridih, Jharkhand 825320', href: null, iconStyle: 'bg-orange-500/20 text-orange-400' },
    { icon: Phone, title: 'Call Us', details: '+91 9162461804', href: 'tel:+919162461804', iconStyle: 'bg-green-500/20 text-green-400' },
    { icon: Mail, title: 'Email Us', details: 'kdevi9162@gmail.com', href: 'mailto:kdevi9162@gmail.com', iconStyle: 'bg-blue-500/20 text-blue-400' },
    { icon: Clock, title: 'Business Hours', details: 'Mon - Sat: 9:00 AM - 7:00 PM\nSunday: Closed', href: null, iconStyle: 'bg-purple-500/20 text-purple-400' },
  ];

  return (
    <section id="contact" className="section-transition relative overflow-hidden bg-gray-950 py-14 sm:py-24" aria-labelledby="contact-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 opacity-30" aria-hidden="true" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="mx-auto mb-14 max-w-4xl text-center sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-5 py-2.5 text-base font-semibold tracking-wide text-orange-300 mb-5"><span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> {t('getInTouch')}</span>
          <h2 id="contact-heading" className="text-3xl sm:text-5xl lg:text-6xl leading-tight font-bold text-white mb-4 sm:mb-5">{t('planPower')} <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">{t('powerSolutionToday')}</span></h2>
          <p className="text-lg text-gray-400">{t('contactDescription')}</p>
          <Button asChild variant="outline" size="sm" className="mt-6 border-orange-400 text-orange-300 hover:bg-orange-500 hover:text-white">
            <Link to="/feedback">{t('shareFeedback')}</Link>
          </Button>
        </motion.div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex h-full flex-col gap-6">
            <div className="space-y-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm sm:p-7">
              {contactInfo.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", item.iconStyle)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm whitespace-pre-line">{item.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex-1 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-amber-500/20 p-6 sm:p-7">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> {t('whyContact')}</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                {['Site assessment and consultation options', 'Custom system design and quotation', 'Guidance on applicable schemes', 'Professional installation and support', 'Warranty guidance based on brand and product terms'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="h-full">
            <div className="h-full rounded-3xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm sm:p-8">
              {formState === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-green-400" /></div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-400 mb-6">Thank you for reaching out. Our team will review your requirement and contact you soon.</p>
                  <Button variant="outline" onClick={() => setFormState('idle')} className="w-full sm:w-auto">Send Another Message</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {formState === 'error' && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">We could not send your enquiry. Please try again or call us directly.</p>}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input type="text" id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={formState === 'submitting'} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" placeholder="Your Name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                      <input type="email" id="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={formState === 'submitting'} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                      <input type="tel" id="phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={formState === 'submitting'} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" placeholder="+91 XXXXXXXXXX" />
                    </div>
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">Interested In</label>
                      <select id="projectType" disabled={formState === 'submitting'} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                        <option value="">Select Project Type</option>
                        <option value="residential">Home Power Solution</option>
                        <option value="commercial">Commercial / Industrial Power</option>
                        <option value="solar">Solar / Hybrid System</option>
                        <option value="battery">Inverter and Battery Backup</option>
                        <option value="electrical">Electrical Products or Service</option>
                        <option value="maintenance">Maintenance and Support</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                    <textarea id="message" rows={5} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} disabled={formState === 'submitting'} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none" placeholder="Tell us about your energy needs, location, and any specific requirements..." />
                  </div>
                  <Button type="submit" variant="default" size="lg" className="h-12 w-full min-w-0 px-5 text-sm text-white sm:h-14 sm:w-auto sm:min-w-52 sm:px-8 sm:text-base" disabled={formState === 'submitting'} aria-busy={formState === 'submitting'}>
                    {formState === 'submitting' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /><span>Sending...</span></>
                    ) : (
                      <><Send className="w-5 h-5" aria-hidden="true" /><span>{t('submitInquiry')}</span></>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">By submitting, you agree to our Privacy Policy and Terms of Service.</p>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mt-16">
          <div className="relative rounded-3xl overflow-hidden">
            <iframe title="Kalyani Enterprises Location" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d58233.67450732448!2d85.892491!3d24.185594!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f38d2ab714e73f%3A0xee7d567dcc342b0e!2sKALYANI%20ENTERPRISES!5e0!3m2!1sen!2sus!4v1759967706730!5m2!1sen!2sus" className="h-64 w-full sm:h-96" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ border: 0 }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
