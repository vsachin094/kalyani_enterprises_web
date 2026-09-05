import { BrandLogo, PortfolioProject, Product, Testimonial } from '@/types';

// These are the build-time fallbacks used while the API is unavailable. The
// database remains the source of truth in production (see seed_data.py).
const product = (id: string, name: string, order: number, image: string, short_description: string, features: string[]): Product => ({
  id, name, type: 'Product', order, image, short_description, features,
});

const service = (id: string, name: string, order: number, image: string, short_description: string, features: string[]): Product => ({
  id, name, type: 'Service', order, image, short_description, features,
});

const products: Product[] = [
  product('solar-panels', 'Solar Panels', 1, 'products/livgaurd_solar.png', 'Solar modules from 40W to 635W', ['Mono PERC, TOPCon and bifacial options', 'Residential, commercial and industrial applications']),
  product('solar-batteries', 'Solar Batteries', 2, 'products/livgaurd_bat.png', 'Tubular and lithium storage from 40Ah to 280Ah', ['Tubular and LiFePO4 options', 'Designed for deep-cycle solar storage']),
  product('power-inverters', 'Power Inverters', 3, 'products/livguard-power-inverter.png', 'Home and office backup inverters from 500VA to 5KVA', ['Pure sine wave options', 'Overload and battery protection']),
  product('solar-inverters', 'Solar Inverters', 4, 'products/livguard-solar-inverter.webp', 'Off-grid, on-grid and hybrid inverters', ['500VA to 30KVA model range', 'MPPT and monitoring options']),
  product('energy-storage', 'Energy Storage Systems', 5, 'products/livguard-energy-storage.jpg', 'Scalable battery storage from 2.5kWh to 50kWh+', ['Expandable storage configurations', 'Smart BMS options']),
  product('ev-batteries', 'EV Battery Solutions', 6, 'products/livguard-ev-battery.webp', 'Battery solutions for electric two-wheelers and autos', ['Vehicle-matched lithium options', 'BMS and safety protection options']),
  product('home-energy-solutions', 'Home Power Packages', 7, 'products/livguard-home-power-package.jpg', 'Complete inverter, battery and solar packages', ['Load assessment and system sizing', 'Hybrid, backup and storage configurations']),
];

const services: Product[] = [
  service('solar-installation', 'Solar Installation', 1, 'services/installation.png', 'Professional solar system installation', ['Complete system setup', 'Professional on-site installation', 'End-to-end commissioning support']),
  service('maintenance-support', 'Maintenance & Support', 2, 'services/maintaince_support.png', 'Regular maintenance and service support', ['System health checks', 'Preventive and corrective maintenance', 'Performance optimization']),
  service('site-inspection', 'Site Inspection & Consultation', 3, 'services/installation.png', 'Expert site assessment and energy audit', ['Detailed site assessment', 'Energy load analysis', 'System design recommendations']),
  service('power-solutions', 'Custom Power Solutions', 4, 'services/maintaince_support.png', 'Tailored power solutions for every need', ['Grid-tied, hybrid and off-grid setups', 'Project design, supply and installation']),
];

const testimonials: Testimonial[] = [
  { name: 'Rajesh Kumar', location: 'Jharkhand', text: 'Excellent service and quality products. The team was professional and completed the work on time.', rating: 5, project_type: 'Residential Solar', date: 'October 2024' },
  { name: 'Priya Sharma', location: 'Jharkhand', text: 'Professional team and timely delivery. Highly recommended!', rating: 5, project_type: 'Home Solar Installation', date: 'September 2024' },
  { name: 'Amit Singh', location: 'Jharkhand', text: 'Great experience with Kalyani Enterprises and excellent after-sales support.', rating: 5, project_type: 'Solar + Battery System', date: 'August 2024' },
];

const portfolio: PortfolioProject[] = [
  { title: 'Residential Rooftop Solar', type: 'Residential', capacity: '5kW', location: 'Jharkhand', date: 'Oct 2024', image: '/images/portfolio/project_1.jpg', description: 'Complete grid-tied solar system with net metering', client: 'Residential Solar System', details: { panels: '10 x 550W Mono PERC', inverter: '5kW Hybrid Inverter', grid_type: 'On-Grid with Net Metering' } },
  { title: 'Commercial Complex Installation', type: 'Commercial', capacity: '25kW', location: 'Jharkhand', date: 'Sep 2024', image: '/images/portfolio/project_2.jpg', description: 'Three-phase system with battery backup and monitoring', client: 'Commercial Solar + Backup', details: { panels: '45 x 550W Solar Panels', inverter: '25kW Three Phase', grid_type: 'Hybrid System' } },
  { title: 'Farm House Off-Grid System', type: 'Off-Grid', capacity: '10kW', location: 'Jharkhand', date: 'Aug 2024', image: '/images/portfolio/project_3.jpg', description: 'Complete energy independence with lithium batteries', client: 'Off-Grid Power System', details: { panels: '18 x 550W Panels', inverter: '10kW Off-Grid Inverter', grid_type: 'Standalone Off-Grid' } },
];

const brands: BrandLogo[] = [
  { name: 'Livguard Solar', image: '/images/brands/livgaurd-solar.png', alt: 'Livguard Solar', relationship: 'direct' },
  { name: 'Livguard', image: '/images/brands/livguard.png', alt: 'Livguard', relationship: 'direct' },
  { name: 'Eastman Solar', image: '/images/brands/eastman-solar.png', alt: 'Eastman Solar', relationship: 'channel' },
  { name: 'Indpower', image: '/images/brands/indpower.png', alt: 'Indpower', relationship: 'channel' },
  { name: 'Livfast', image: '/images/brands/livfast.svg', alt: 'Livfast', relationship: 'channel' },
  { name: 'Orient Electric', image: '/images/brands/orient-electric.png', alt: 'Orient Electric', relationship: 'channel' },
];

export const getProducts = () => products;
export const getServices = () => services;
export const getTestimonials = () => testimonials;
export const getPortfolioProjects = () => portfolio;
export const getBrandLogos = () => brands;
