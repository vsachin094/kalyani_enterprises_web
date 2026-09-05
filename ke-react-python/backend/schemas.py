from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


# ==================== Product / Service ====================

class ProductBase(BaseModel):
    id: str
    name: str
    type: str = "Product"
    order: int = 999
    short_description: Optional[str] = None
    image: Optional[str] = None
    features: List[str] = []
    full_description: Optional[str] = None
    specifications: Optional[Dict[str, str]] = None
    benefits: Optional[List[str]] = None
    applications: Optional[List[str]] = None
    brands: Optional[List[str]] = None
    gallery: Optional[List[str]] = None
    catalog_pdf: Optional[str] = None
    price_range: Optional[str] = None
    availability: Optional[str] = None
    related_products: Optional[List[str]] = None
    # Service specific
    process: Optional[List[Dict[str, Any]]] = None
    included_services: Optional[List[str]] = None
    duration: Optional[str] = None
    warranty: Optional[str] = None
    service_areas: Optional[List[str]] = None


class ProductResponse(ProductBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== Testimonials ====================

class TestimonialBase(BaseModel):
    name: str
    location: str
    text: str
    rating: int = Field(5, ge=1, le=5)
    photo: Optional[str] = None
    project_type: str = "Customer experience"
    date: Optional[str] = None


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialResponse(TestimonialBase):
    id: str
    status: str = "approved"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== Portfolio ====================

class PortfolioProjectResponse(BaseModel):
    id: str
    title: str
    type: str
    capacity: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    client: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


# ==================== Brand Logos ====================

class BrandLogoResponse(BaseModel):
    id: str
    name: str
    image: Optional[str] = None
    alt: Optional[str] = None
    relationship: Optional[str] = None

    class Config:
        from_attributes = True


# ==================== Queries ====================

class QueryCreate(BaseModel):
    name: str = Field(..., max_length=80)
    email: str = Field(..., max_length=120)
    phone: str = Field(..., max_length=40)
    project_type: str = Field("General enquiry", max_length=80)
    message: str = Field(..., max_length=1000)


class QueryResponse(QueryCreate):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== Feedback ====================

class FeedbackCreate(BaseModel):
    name: str = Field(..., max_length=80)
    location: str = Field(..., max_length=100)
    text: str = Field(..., min_length=10, max_length=1000)
    rating: int = Field(5, ge=1, le=5)
    project_type: str = Field("Customer experience", max_length=80)


class FeedbackUpdate(BaseModel):
    id: Optional[str] = None
    status: Optional[str] = None  # pending / approved / rejected
    name: Optional[str] = None
    location: Optional[str] = None
    text: Optional[str] = None
    project_type: Optional[str] = None
    rating: Optional[int] = None


class FeedbackResponse(BaseModel):
    id: str
    name: str
    location: str
    text: str
    rating: int
    project_type: str
    date: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== Analytics ====================

class VisitCreate(BaseModel):
    pagePath: str = "/"


class VisitResponse(BaseModel):
    id: str
    page_path: str
    user_agent: Optional[str] = None
    referer: Optional[str] = None
    visited_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== Admin ====================

class AdminLogin(BaseModel):
    username: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"