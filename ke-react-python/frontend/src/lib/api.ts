import { Product, Testimonial, PortfolioProject, BrandLogo, QuerySubmission, FeedbackSubmission, VisitRecord, OfferBanner } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// ==================== Products & Services ====================

export async function getProducts(): Promise<Product[]> {
  return request<Product[]>('/api/products');
}

export async function getServices(): Promise<Product[]> {
  return request<Product[]>('/api/services');
}

// ==================== Testimonials & Portfolio ====================

export async function getTestimonials(): Promise<Testimonial[]> {
  return request<Testimonial[]>('/api/feedback');
}

export async function getPortfolio(): Promise<PortfolioProject[]> {
  return request<PortfolioProject[]>('/api/portfolio');
}

export async function getBrandLogos(): Promise<BrandLogo[]> {
  return request<BrandLogo[]>('/api/brands');
}

export async function getOffers(): Promise<OfferBanner[]> {
  return request<OfferBanner[]>('/api/offers');
}

// ==================== Queries ====================

export async function submitQuery(data: { name: string; email: string; phone: string; project_type?: string; message: string }): Promise<QuerySubmission> {
  return request<QuerySubmission>('/api/queries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== Feedback ====================

export async function submitFeedback(data: { name: string; location: string; text: string; rating: number; project_type?: string }): Promise<FeedbackSubmission> {
  return request<FeedbackSubmission>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== Analytics ====================

// ==================== Admin ====================

export async function adminLogin(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
  return request<{ access_token: string; token_type: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function adminGetFeedback(token: string): Promise<FeedbackSubmission[]> {
  return request<FeedbackSubmission[]>('/api/admin/feedback', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUpdateFeedback(token: string, id: string, data: Partial<FeedbackSubmission>): Promise<FeedbackSubmission> {
  return request<FeedbackSubmission>(`/api/admin/feedback/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function adminGetQueries(token: string): Promise<QuerySubmission[]> {
  return request<QuerySubmission[]>('/api/admin/queries', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetAnalytics(token: string): Promise<{ total_visits: number; unique_visitors: number; recent_visits: VisitRecord[] }> {
  return request<{ total_visits: number; unique_visitors: number; recent_visits: VisitRecord[] }>('/api/admin/analytics', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetProducts(token: string): Promise<Product[]> {
  return request<Product[]>('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } });
}

export async function adminCreateProduct(token: string, product: Record<string, unknown>): Promise<Product> {
  return request<Product>('/api/admin/products', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(product) });
}

export async function adminUpdateProduct(token: string, id: string, product: Record<string, unknown>): Promise<Product> {
  return request<Product>(`/api/admin/products/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(product) });
}

export async function adminGetServices(token: string): Promise<Product[]> {
  return request<Product[]>('/api/admin/services', { headers: { Authorization: `Bearer ${token}` } });
}

export async function adminSetVisibility(token: string, type: 'products' | 'services' | 'portfolio', id: string, visible: boolean): Promise<void> {
  await request(`/api/admin/${type}/${id}/visibility`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ visible }) });
}

export async function adminGetPortfolio(token: string): Promise<PortfolioProject[]> {
  return request<PortfolioProject[]>('/api/admin/portfolio', { headers: { Authorization: `Bearer ${token}` } });
}

export async function adminCreatePortfolio(token: string, project: Omit<PortfolioProject, 'id'>): Promise<PortfolioProject> {
  return request<PortfolioProject>('/api/admin/portfolio', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(project) });
}

export async function adminUpdatePortfolio(token: string, id: string, project: Record<string, unknown>): Promise<PortfolioProject> {
  return request<PortfolioProject>(`/api/admin/portfolio/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(project) });
}

export async function adminUploadImage(token: string, file: File): Promise<{ url: string }> {
  const body = new FormData();
  body.append('file', file);
  const response = await fetch(`${API_BASE}/api/admin/uploads`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body });
  if (!response.ok) throw new Error((await response.json().catch(() => ({ detail: 'Upload failed' }))).detail);
  return response.json();
}

export async function adminGetOffers(token: string): Promise<OfferBanner[]> {
  return request<OfferBanner[]>('/api/admin/offers', { headers: { Authorization: `Bearer ${token}` } });
}

export async function adminCreateOffer(token: string, offer: Omit<OfferBanner, 'id' | 'created_at'>): Promise<OfferBanner> {
  return request<OfferBanner>('/api/admin/offers', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(offer) });
}

export async function adminDeleteOffer(token: string, id: string): Promise<void> {
  await request(`/api/admin/offers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
}

export async function adminSetOfferActive(token: string, id: string, active: boolean): Promise<OfferBanner> {
  return request<OfferBanner>(`/api/admin/offers/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ active }) });
}
