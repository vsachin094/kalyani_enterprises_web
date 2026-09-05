from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from database import get_db
from models import QuerySubmission
from schemas import QueryCreate, QueryResponse

router = APIRouter(prefix="/api", tags=["queries"])


@router.post("/queries", response_model=QueryResponse, status_code=201)
def submit_query(query: QueryCreate, db: Session = Depends(get_db)):
    """Submit a contact form enquiry"""
    item = QuerySubmission(
        id=str(uuid.uuid4()),
        name=query.name,
        email=query.email,
        phone=query.phone,
        project_type=query.project_type,
        message=query.message,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item