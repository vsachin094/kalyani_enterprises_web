export interface Product {
  id: string;
  name: string;
  type: 'Product' | 'Service';
  order: number;
  short_description: string;
  image?: string;
  features: string[];
  full_description?: string;
  specifications?: Record<string, string>;
  benefits?: string[];
  applications?: string[];
  brands?: string[];
  gallery?: string[];
  catalog_pdf?: string;
  price_range?: string;
  availability?: string;
  related_products?: string[];
  // Service specific
  process?: Array<{ step: number; title: string; description: string }>;
  included_services?: string[];
  duration?: string;
  warranty?: string;
  service_areas?: string[];
}

export interface Testimonial {
  id?: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  photo?: string;
  project_type: string;
  date: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioProject {
  id?: string;
  title: string;
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Institutional' | 'Off-Grid';
  capacity: string;
  location: string;
  date: string;
  image: string;
  description: string;
  client: string;
  details: {
    panels: string;
    inverter: string;
    battery?: string;
    mounting?: string;
    grid_type: string;
    subsidy?: string;
  };
}

export interface BrandLogo {
  id?: string;
  name: string;
  image: string;
  alt: string;
  relationship?: 'direct' | 'channel';
}

export interface QuerySubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  message: string;
  createdAt: string;
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  project_type: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface VisitRecord {
  id: string;
  page_path: string;
  user_agent: string | null;
  referer: string | null;
  visited_at: string;
}