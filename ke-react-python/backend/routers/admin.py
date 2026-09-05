from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from database import get_db
from models import AdminUser, FeedbackSubmission, QuerySubmission, PageVisit
from schemas import AdminLogin, AdminToken, FeedbackResponse, FeedbackUpdate, QueryResponse, VisitResponse
from config import setting

router = APIRouter(prefix="/api/admin", tags=["admin"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = setting("security", "secret_key", "SECRET_KEY")
if not SECRET_KEY:
    if os.getenv("APP_ENV", "development") == "production":
        raise RuntimeError("SECRET_KEY must be set in production")
    SECRET_KEY = "development-only-secret-change-me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(setting("security", "access_token_expire_minutes", "ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 8))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_admin(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Extract and validate JWT token from Authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Admin access required")

    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin


# ==================== Auth ====================

@router.post("/login", response_model=AdminToken)
def admin_login(login: AdminLogin, db: Session = Depends(get_db)):
    """Admin login - returns JWT token"""
    admin = db.query(AdminUser).filter(AdminUser.username == login.username).first()
    if not admin or not verify_password(login.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    token = create_access_token({"sub": admin.username})
    return AdminToken(access_token=token)


# ==================== Feedback Management ====================

@router.get("/feedback", response_model=List[FeedbackResponse])
def get_all_feedback(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Get all feedback submissions (admin only)"""
    items = db.query(FeedbackSubmission).order_by(FeedbackSubmission.created_at.desc()).all()
    return items


@router.patch("/feedback/{feedback_id}", response_model=FeedbackResponse)
def update_feedback(feedback_id: str, update: FeedbackUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Update feedback status or content (admin only)"""
    item = db.query(FeedbackSubmission).filter(FeedbackSubmission.id == feedback_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Feedback not found")

    if update.status is not None:
        if update.status not in ["pending", "approved", "rejected"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        item.status = update.status
    if update.name is not None:
        item.name = update.name[:80]
    if update.location is not None:
        item.location = update.location[:100]
    if update.text is not None:
        item.text = update.text[:1000]
    if update.project_type is not None:
        item.project_type = update.project_type[:80]
    if update.rating is not None:
        item.rating = max(1, min(5, update.rating))

    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


# ==================== Queries Management ====================

@router.get("/queries", response_model=List[QueryResponse])
def get_all_queries(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Get all submitted queries (admin only)"""
    items = db.query(QuerySubmission).order_by(QuerySubmission.created_at.desc()).all()
    return items


# ==================== Analytics ====================

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Get visit analytics (admin only)"""
    total_visits = db.query(PageVisit).count()
    recent_visits = db.query(PageVisit).order_by(PageVisit.visited_at.desc()).limit(100).all()

    return {
        "total_visits": total_visits,
        "recent_visits": [
            {
                "id": v.id,
                "page_path": v.page_path,
                "user_agent": v.user_agent,
                "referer": v.referer,
                "visited_at": v.visited_at.isoformat() if v.visited_at else None,
            }
            for v in recent_visits
        ],
    }
