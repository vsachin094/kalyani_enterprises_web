from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
from database import get_db
from models import FeedbackSubmission, Testimonial
from schemas import FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/api", tags=["feedback"])


@router.get("/feedback", response_model=List[FeedbackResponse])
def get_approved_feedback(db: Session = Depends(get_db)):
    """Get approved feedback (public)"""
    submissions = db.query(FeedbackSubmission).filter(FeedbackSubmission.status == "approved").all()
    testimonials = db.query(Testimonial).filter(Testimonial.status == "approved").all()
    return sorted([*submissions, *testimonials], key=lambda item: item.created_at.timestamp() if item.created_at else 0, reverse=True)


@router.post("/feedback", response_model=FeedbackResponse, status_code=201)
def submit_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    """Submit customer feedback (goes to pending)"""
    now = datetime.now()
    item = FeedbackSubmission(
        id=str(uuid.uuid4()),
        name=feedback.name,
        location=feedback.location,
        text=feedback.text,
        rating=feedback.rating,
        project_type=feedback.project_type,
        date=now.strftime("%b %Y"),
        status="pending",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
