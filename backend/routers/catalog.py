from pathlib import Path
from typing import List
import mimetypes
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session

from config import setting
from database import get_db
from models import BrandLogo, OfferBanner, PortfolioProject, Product
from schemas import BrandLogoResponse, OfferCreate, OfferResponse, OfferUpdate, PortfolioProjectCreate, PortfolioProjectResponse, PortfolioProjectUpdate, ProductCreate, ProductResponse, ProductUpdate, VisibilityUpdate
from routers.admin import get_current_admin

router = APIRouter(prefix="/api", tags=["catalog"])
MEDIA_DIR = Path(setting("database", "data_dir", "DATA_DIR", "data")) / "uploads"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/portfolio", response_model=List[PortfolioProjectResponse])
def get_portfolio(db: Session = Depends(get_db)):
    return db.query(PortfolioProject).filter(PortfolioProject.visible.is_(True)).order_by(PortfolioProject.created_at.desc()).all()


@router.get("/brands", response_model=List[BrandLogoResponse])
def get_brands(db: Session = Depends(get_db)):
    return db.query(BrandLogo).order_by(BrandLogo.name).all()


@router.get("/offers", response_model=List[OfferResponse])
def get_active_offers(db: Session = Depends(get_db)):
    return db.query(OfferBanner).filter(
        OfferBanner.active.is_(True),
        (OfferBanner.expires_at.is_(None) | (OfferBanner.expires_at > func.now())),
    ).order_by(OfferBanner.created_at.desc()).all()


@router.get("/admin/products", response_model=List[ProductResponse])
def admin_products(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(Product).filter(Product.type == "Product").order_by(Product.order, Product.name).all()


@router.post("/admin/products", response_model=ProductResponse, status_code=201)
def create_product(product: ProductCreate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = Product(id=str(uuid.uuid4()), **product.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/admin/products/{item_id}", response_model=ProductResponse)
def update_product(item_id: str, update: ProductUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = db.query(Product).filter(Product.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Product or service not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.get("/admin/services", response_model=List[ProductResponse])
def admin_services(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(Product).filter(Product.type == "Service").order_by(Product.order, Product.name).all()


@router.patch("/admin/products/{item_id}/visibility", response_model=ProductResponse)
def update_product_visibility(item_id: str, update: VisibilityUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = db.query(Product).filter(Product.id == item_id, Product.type == "Product").first()
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    item.visible = update.visible
    db.commit()
    db.refresh(item)
    return item


@router.patch("/admin/services/{item_id}/visibility", response_model=ProductResponse)
def update_service_visibility(item_id: str, update: VisibilityUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = db.query(Product).filter(Product.id == item_id, Product.type == "Service").first()
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    item.visible = update.visible
    db.commit()
    db.refresh(item)
    return item


@router.get("/admin/portfolio", response_model=List[PortfolioProjectResponse])
def admin_portfolio(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(PortfolioProject).order_by(PortfolioProject.created_at.desc()).all()


@router.post("/admin/portfolio", response_model=PortfolioProjectResponse, status_code=201)
def create_portfolio(project: PortfolioProjectCreate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = PortfolioProject(id=str(uuid.uuid4()), **project.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/admin/portfolio/{project_id}/visibility", response_model=PortfolioProjectResponse)
def update_portfolio_visibility(project_id: str, update: VisibilityUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    item.visible = update.visible
    db.commit()
    db.refresh(item)
    return item


@router.patch("/admin/portfolio/{project_id}", response_model=PortfolioProjectResponse)
def update_portfolio(project_id: str, update: PortfolioProjectUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.get("/admin/offers", response_model=List[OfferResponse])
def admin_offers(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(OfferBanner).order_by(OfferBanner.created_at.desc()).all()


@router.post("/admin/offers", response_model=OfferResponse, status_code=201)
def create_offer(offer: OfferCreate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = OfferBanner(id=str(uuid.uuid4()), **offer.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/admin/offers/{offer_id}", response_model=OfferResponse)
def update_offer(offer_id: str, update: OfferUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = db.query(OfferBanner).filter(OfferBanner.id == offer_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Offer not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/admin/offers/{offer_id}", status_code=204)
def delete_offer(offer_id: str, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    item = db.query(OfferBanner).filter(OfferBanner.id == offer_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Offer not found")
    db.delete(item)
    db.commit()


@router.post("/admin/uploads", status_code=201)
async def upload_media(file: UploadFile = File(...), _admin=Depends(get_current_admin)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")
    extension = Path(file.filename or "").suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}:
        extension = mimetypes.guess_extension(file.content_type) or ".bin"
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be 10 MB or smaller")
    filename = f"{uuid.uuid4().hex}{extension}"
    (MEDIA_DIR / filename).write_bytes(data)
    return {"url": f"/media/uploads/{filename}", "filename": filename}
