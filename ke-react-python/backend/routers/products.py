from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Product
from schemas import ProductResponse

router = APIRouter(prefix="/api", tags=["products"])


@router.get("/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    """Get all products sorted by order"""
    products = db.query(Product).filter(Product.type == "Product").order_by(Product.order).all()
    return products


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id, Product.type == "Product").first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product