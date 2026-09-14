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
    visible: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=160)
    type: str = Field("Product", pattern="^(Product|Service)$")
    order: int = 999
    short_description: Optional[str] = Field(None, max_length=500)
    image: Optional[str] = None
    features: List[str] = []
    full_description: Optional[str] = None
    specifications: Dict[str, str] = {}
    benefits: List[str] = []
    applications: List[str] = []
    brands: List[str] = []
    price_range: Optional[str] = None
    availability: Optional[str] = None
    process: List[Dict[str, Any]] = []
    included_services: List[str] = []
    duration: Optional[str] = None
    warranty: Optional[str] = None
    service_areas: List[str] = []
    visible: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=160)
    order: Optional[int] = None
    short_description: Optional[str] = Field(None, max_length=500)
    full_description: Optional[str] = None
    image: Optional[str] = None
    features: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None
    benefits: Optional[List[str]] = None
    applications: Optional[List[str]] = None
    brands: Optional[List[str]] = None
    price_range: Optional[str] = None
    availability: Optional[str] = None
    process: Optional[List[Dict[str, Any]]] = None
    included_services: Optional[List[str]] = None
    duration: Optional[str] = None
    warranty: Optional[str] = None
    service_areas: Optional[List[str]] = None
    visible: Optional[bool] = None


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
    visible: bool = True

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


class OfferResponse(BaseModel):
    id: str
    title: str
    image: str
    link: Optional[str] = None
    active: bool = True
    expires_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PortfolioProjectCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=160)
    type: str = Field("Residential", max_length=40)
    capacity: Optional[str] = Field(None, max_length=80)
    location: Optional[str] = Field(None, max_length=120)
    date: Optional[str] = Field(None, max_length=40)
    image: Optional[str] = None
    description: Optional[str] = Field(None, max_length=1000)
    client: Optional[str] = Field(None, max_length=160)
    details: Optional[Dict[str, Any]] = None
    visible: bool = True


class PortfolioProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=160)
    type: Optional[str] = Field(None, max_length=40)
    capacity: Optional[str] = Field(None, max_length=80)
    location: Optional[str] = Field(None, max_length=120)
    date: Optional[str] = Field(None, max_length=40)
    image: Optional[str] = None
    description: Optional[str] = Field(None, max_length=1000)
    client: Optional[str] = Field(None, max_length=160)
    details: Optional[Dict[str, Any]] = None
    visible: Optional[bool] = None


class VisibilityUpdate(BaseModel):
    visible: bool


class OfferCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=160)
    image: str
    link: Optional[str] = Field(None, max_length=500)
    active: bool = True
    expires_at: Optional[datetime] = None


class OfferUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=160)
    image: Optional[str] = None
    link: Optional[str] = Field(None, max_length=500)
    active: Optional[bool] = None
    expires_at: Optional[datetime] = None


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
    visitorId: Optional[str] = None


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
