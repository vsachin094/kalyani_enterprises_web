from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Product
from schemas import ProductResponse

router = APIRouter(prefix="/api", tags=["services"])


@router.get("/services", response_model=List[ProductResponse])
def get_services(db: Session = Depends(get_db)):
    """Get all services sorted by order"""
    services = db.query(Product).filter(Product.type == "Service").order_by(Product.order).all()
    return services


@router.get("/services/{service_id}", response_model=ProductResponse)
def get_service(service_id: str, db: Session = Depends(get_db)):
    """Get a single service by ID"""
    service = db.query(Product).filter(Product.id == service_id, Product.type == "Service").first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service