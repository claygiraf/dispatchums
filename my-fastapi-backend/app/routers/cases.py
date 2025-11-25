from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime

from app.database.database import get_db
from app.models.case import (
    Case, 
    CaseCreate, 
    CaseUpdate, 
    CaseResponse, 
    KQResponse, 
    DispatchRequest
)

router = APIRouter(
    prefix="/cases",
    tags=["cases"],
    responses={404: {"description": "Not found"}},
)

def generate_case_number() -> str:
    """Generate a unique case number"""
    now = datetime.now()
    return f"{now.year}{now.month:02d}{now.day:02d}-{now.hour:02d}{now.minute:02d}{now.second:02d}"

@router.post("/", response_model=CaseResponse)
def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    """
    Create a new emergency case
    """
    # Generate unique case number
    case_number = generate_case_number()
    
    # Create new case
    db_case = Case(
        case_number=case_number,
        location=case.location,
        phone_number=case.phone_number,
        contact_name=case.contact_name,
        language=case.language,
        protocol_id=case.protocol_id,
        protocol_name=case.protocol_name,
        problem_description=case.problem_description,
        chief_complaint=case.chief_complaint,
        patient_age=case.patient_age,
        patient_gender=case.patient_gender,
        is_conscious=case.is_conscious,
        is_breathing=case.is_breathing,
        with_patient=case.with_patient,
        num_hurt=case.num_hurt,
        hazards=case.hazards,
        weapons=case.weapons,
        notes=case.notes,
        status="active"
    )
    
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    
    return db_case

@router.get("/", response_model=List[CaseResponse])
def get_cases(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve cases with optional filtering
    """
    query = db.query(Case)
    
    if status:
        query = query.filter(Case.status == status)
    
    cases = query.offset(skip).limit(limit).all()
    return cases

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: int, db: Session = Depends(get_db)):
    """
    Get a specific case by ID
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    return case

@router.put("/{case_id}", response_model=CaseResponse)
def update_case(case_id: int, case_update: CaseUpdate, db: Session = Depends(get_db)):
    """
    Update an existing case
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    # Update fields if provided
    update_data = case_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(case, field, value)
    
    case.updated_at = datetime.now()
    db.commit()
    db.refresh(case)
    
    return case

@router.delete("/{case_id}")
def delete_case(case_id: int, db: Session = Depends(get_db)):
    """
    Delete a case (soft delete by changing status)
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    case.status = "deleted"
    case.updated_at = datetime.now()
    db.commit()
    
    return {"message": f"Case {case_id} has been deleted"}

@router.post("/{case_id}/kq-responses")
def update_kq_responses(case_id: int, kq_responses: KQResponse, db: Session = Depends(get_db)):
    """
    Update Key Questions responses for a case
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    # Convert KQ responses to JSON string
    case.kq_responses = json.dumps(kq_responses.dict())
    case.updated_at = datetime.now()
    db.commit()
    db.refresh(case)
    
    return {"message": "KQ responses updated successfully", "case_id": case_id}

@router.get("/{case_id}/kq-responses")
def get_kq_responses(case_id: int, db: Session = Depends(get_db)):
    """
    Get Key Questions responses for a case
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    if case.kq_responses:
        try:
            kq_data = json.loads(case.kq_responses)
            return {"case_id": case_id, "kq_responses": kq_data}
        except json.JSONDecodeError:
            return {"case_id": case_id, "kq_responses": {}}
    
    return {"case_id": case_id, "kq_responses": {}}

@router.post("/{case_id}/dispatch")
def dispatch_case(case_id: int, dispatch_request: DispatchRequest, db: Session = Depends(get_db)):
    """
    Dispatch units for a case and update determinant information
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    # Update dispatch information
    case.determinant_code = dispatch_request.determinant_code
    case.dispatch_priority = dispatch_request.dispatch_priority
    case.dispatched_units = json.dumps(dispatch_request.dispatched_units)
    
    # Update KQ responses if provided
    if dispatch_request.kq_responses:
        case.kq_responses = json.dumps(dispatch_request.kq_responses.dict())
    
    case.updated_at = datetime.now()
    db.commit()
    db.refresh(case)
    
    return {
        "message": "Case dispatched successfully",
        "case_id": case_id,
        "determinant_code": dispatch_request.determinant_code,
        "dispatch_priority": dispatch_request.dispatch_priority,
        "dispatched_units": dispatch_request.dispatched_units
    }

@router.post("/{case_id}/complete")
def complete_case(case_id: int, db: Session = Depends(get_db)):
    """
    Mark a case as completed
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    case.status = "completed"
    case.completed_at = datetime.now()
    case.updated_at = datetime.now()
    db.commit()
    db.refresh(case)
    
    return {"message": f"Case {case_id} has been completed", "completed_at": case.completed_at}

@router.get("/search/by-location")
def search_cases_by_location(location: str, db: Session = Depends(get_db)):
    """
    Search cases by location
    """
    cases = db.query(Case).filter(Case.location.ilike(f"%{location}%")).all()
    return cases

@router.get("/search/by-status")
def get_cases_by_status(status: str, db: Session = Depends(get_db)):
    """
    Get cases filtered by status
    """
    cases = db.query(Case).filter(Case.status == status).all()
    return cases

@router.get("/protocols/{protocol_id}")
def get_cases_by_protocol(protocol_id: str, db: Session = Depends(get_db)):
    """
    Get cases by protocol ID
    """
    cases = db.query(Case).filter(Case.protocol_id == protocol_id).all()
    return cases