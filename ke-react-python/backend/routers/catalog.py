from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import BrandLogo, PortfolioProject
from schemas import BrandLogoResponse, PortfolioProjectResponse

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/portfolio", response_model=List[PortfolioProjectResponse])
def get_portfolio(db: Session = Depends(get_db)):
    return db.query(PortfolioProject).order_by(PortfolioProject.created_at.desc()).all()


@router.get("/brands", response_model=List[BrandLogoResponse])
def get_brands(db: Session = Depends(get_db)):
    return db.query(BrandLogo).order_by(BrandLogo.name).all()
