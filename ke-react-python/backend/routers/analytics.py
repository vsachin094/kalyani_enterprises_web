from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
import uuid
from database import get_db
from models import PageVisit
from schemas import VisitCreate, VisitResponse

router = APIRouter(prefix="/api", tags=["analytics"])


@router.post("/analytics/visit", response_model=VisitResponse)
def record_visit(visit: VisitCreate, request: Request, db: Session = Depends(get_db)):
    """Record a page visit"""
    page_path = visit.pagePath if visit.pagePath.startswith("/") else "/"
    page_path = page_path[:200]

    item = PageVisit(
        id=str(uuid.uuid4()),
        page_path=page_path,
        user_agent=request.headers.get("user-agent", ""),
        referer=request.headers.get("referer", ""),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item