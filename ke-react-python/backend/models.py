from sqlalchemy import Column, String, Integer, Text, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False, default="Product")  # "Product" or "Service"
    order = Column(Integer, default=999)
    short_description = Column(Text)
    image = Column(String)
    features = Column(JSON, default=list)
    full_description = Column(Text)
    specifications = Column(JSON, default=dict)
    benefits = Column(JSON, default=list)
    applications = Column(JSON, default=list)
    brands = Column(JSON, default=list)
    gallery = Column(JSON, default=list)
    catalog_pdf = Column(String)
    price_range = Column(String)
    availability = Column(String)
    related_products = Column(JSON, default=list)
    # Service specific
    process = Column(JSON, default=list)
    included_services = Column(JSON, default=list)
    duration = Column(String)
    warranty = Column(String)
    service_areas = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    photo = Column(String)
    project_type = Column(String, default="Customer experience")
    date = Column(String)
    status = Column(String, default="approved")  # pending / approved / rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Residential / Commercial / Industrial / Institutional / Off-Grid
    capacity = Column(String)
    location = Column(String)
    date = Column(String)
    image = Column(String)
    description = Column(Text)
    client = Column(String)
    details = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BrandLogo(Base):
    __tablename__ = "brand_logos"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    image = Column(String)
    alt = Column(String)
    relationship = Column(String, default="channel")  # direct / channel
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class QuerySubmission(Base):
    __tablename__ = "queries"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    project_type = Column(String, default="General enquiry")
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FeedbackSubmission(Base):
    __tablename__ = "feedback_submissions"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    project_type = Column(String, default="Customer experience")
    date = Column(String)
    status = Column(String, default="pending")  # pending / approved / rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PageVisit(Base):
    __tablename__ = "page_visits"

    id = Column(String, primary_key=True)
    page_path = Column(String, nullable=False)
    user_agent = Column(Text)
    referer = Column(Text)
    visited_at = Column(DateTime(timezone=True), server_default=func.now())


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())