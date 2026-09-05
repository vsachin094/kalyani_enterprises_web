import { Product, Testimonial, PortfolioProject, BrandLogo, QuerySubmission, FeedbackSubmission, VisitRecord } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json() as Promise<T>;
}

// ==================== Products & Services ====================

export async function getProducts(): Promise<Product[]> {
  return request<Product[]>('/api/products');
}

export async function getProduct(id: string): Promise<Product> {
  return request<Product>(`/api/products/${id}`);
}

export async function getServices(): Promise<Product[]> {
  return request<Product[]>('/api/services');
}

export async function getService(id: string): Promise<Product> {
  return request<Product>(`/api/services/${id}`);
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

export async function recordVisit(pagePath: string): Promise<VisitRecord> {
  return request<VisitRecord>('/api/analytics/visit', {
    method: 'POST',
    body: JSON.stringify({ pagePath }),
  });
}

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

export async function adminGetAnalytics(token: string): Promise<{ total_visits: number; recent_visits: VisitRecord[] }> {
  return request<{ total_visits: number; recent_visits: VisitRecord[] }>('/api/admin/analytics', {
    headers: { Authorization: `Bearer ${token}` },
  });
}