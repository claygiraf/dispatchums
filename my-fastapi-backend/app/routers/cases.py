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
    """Generate a unique case number based on current date/time
    Format: YYYYMMDDHHmm (e.g., 202512081220)
    """
    now = datetime.now()
    return f"{now.year}{now.month:02d}{now.day:02d}{now.hour:02d}{now.minute:02d}"

def generate_resource_id(db: Session) -> str:
    """Generate auto-incrementing resource ID starting from 00001"""
    last_case = db.query(Case).order_by(Case.id.desc()).first()
    if last_case and last_case.resource_id:
        try:
            last_num = int(last_case.resource_id)
            return f"{last_num + 1:05d}"
        except:
            pass
    return "00001"

@router.post("/", response_model=CaseResponse)
def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    """
    Create a new emergency case
    """
    # Generate unique case number
    case_number = generate_case_number()
    
    # Generate resource ID
    resource_id = generate_resource_id(db)
    
    # Use provided call_date or current server time
    call_date = case.call_date or datetime.now()
    
    # Create new case
    db_case = Case(
        case_number=case_number,
        location=case.location,
        phone_number=case.phone_number,
        contact_name=case.contact_name,
        language=case.language,
        call_date=call_date,  # This will be the official case start time
        postcode=case.postcode,
        city=case.city,
        state=case.state,
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
        resource_id=resource_id,
        dispatcher_name=case.dispatcher_name,
        dispatcher_id=case.dispatcher_id,
        dispatcher_unit=case.dispatcher_unit,
        dispatcher_location=case.dispatcher_location,
        dispatcher_city=case.dispatcher_city,
        dispatcher_state=case.dispatcher_state,
        dispatcher_postcode=case.dispatcher_postcode,
        case_duration=case.case_duration,
        time_to_dispatch=case.time_to_dispatch,
        status=case.status or "active",
        dispatch_time=case.dispatch_time,
        ambulance=case.ambulance,
        dispatch_priority=case.dispatch_priority,
        determinant_code=case.determinant_code,
        case_summary=case.case_summary
    )
    
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    
    # After refresh, created_at is set by the database
    # Use created_at as the authoritative case start time
    if not case.call_date:
        db_case.call_date = db_case.created_at
    
    # Calculate time_to_dispatch if dispatch_time is provided
    if case.dispatch_time and db_case.call_date:
        # Ensure both datetimes are timezone-aware for comparison
        dispatch_dt = case.dispatch_time
        call_dt = db_case.call_date
        
        # If one is naive and the other is aware, make them both aware
        if dispatch_dt.tzinfo is None and call_dt.tzinfo is not None:
            from datetime import timezone
            dispatch_dt = dispatch_dt.replace(tzinfo=timezone.utc)
        elif call_dt.tzinfo is None and dispatch_dt.tzinfo is not None:
            from datetime import timezone
            call_dt = call_dt.replace(tzinfo=timezone.utc)
        
        time_diff = dispatch_dt - call_dt
        db_case.time_to_dispatch = int(time_diff.total_seconds())
    
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
    Delete a case (soft delete by changing status to 'deleted')
    Note: This does not modify case_time or dispatch_time, only changes status
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    # Only change status to deleted, don't update other timestamps
    case.status = "deleted"
    db.commit()
    
    return {"message": f"Case {case_id} has been marked as deleted"}

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

@router.post("/{case_id}/hold")
def hold_case(case_id: int, db: Session = Depends(get_db)):
    """
    Hold a case - mark as incomplete status to resume later
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    case.status = "incomplete"
    case.updated_at = datetime.now()
    db.commit()
    db.refresh(case)
    
    return {"message": f"Case {case_id} has been held", "status": "incomplete", "case": case}

@router.post("/{case_id}/continue")
def continue_case(case_id: int, db: Session = Depends(get_db)):
    """
    Continue a held case - change status back to active and return case data
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with id {case_id} not found"
        )
    
    if case.status != "incomplete":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Case {case_id} is not in incomplete status. Current status: {case.status}"
        )
    
    case.status = "active"
    case.updated_at = datetime.now()
    db.commit()
    db.refresh(case)
    
    return {"message": f"Case {case_id} resumed", "status": "active", "case": case}

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

@router.get("/analytics/data")
def get_analytics_data(
    period: str = "daily",  # daily, weekly, monthly
    db: Session = Depends(get_db)
):
    """
    Get analytics data for charts
    Returns case counts and time metrics grouped by period
    """
    from datetime import timedelta
    from sqlalchemy import func, extract
    
    now = datetime.now()
    
    # Calculate date range based on period
    if period == "daily":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=1)
        format_str = "%H:%M"
    elif period == "weekly":
        start_date = now - timedelta(days=now.weekday())
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=7)
        format_str = "%A"
    else:  # monthly
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if now.month == 12:
            end_date = start_date.replace(year=now.year + 1, month=1)
        else:
            end_date = start_date.replace(month=now.month + 1)
        format_str = "%d"
    
    # Get cases in the date range
    cases = db.query(Case).filter(
        Case.call_date >= start_date,
        Case.call_date < end_date
    ).all()
    
    # Count by status
    status_counts = {}
    for case in cases:
        status = case.status or "unknown"
        status_counts[status] = status_counts.get(status, 0) + 1
    
    # Time metrics
    time_data = []
    if period == "daily":
        # Group by hour for every 2 hours (00:00, 02:00, 04:00, etc.)
        for hour in range(0, 24, 2):
            # Include cases from hour and hour+1
            hour_cases = [c for c in cases if hour <= c.call_date.hour < hour + 2]
            avg_dispatch_time = sum(c.time_to_dispatch or 0 for c in hour_cases) / len(hour_cases) if hour_cases else 0
            avg_case_duration = sum(c.case_duration or 0 for c in hour_cases) / len(hour_cases) if hour_cases else 0
            time_data.append({
                "label": f"{hour:02d}:00",
                "dispatch_time": round(avg_dispatch_time, 2),
                "case_duration": round(avg_case_duration, 2),
                "count": len(hour_cases)
            })
    elif period == "weekly":
        # Group by day of week with dates
        first_date = None
        last_date = None
        for day in range(7):
            # Calculate the actual date for this day of the week
            target_date = start_date + timedelta(days=day)
            if first_date is None:
                first_date = target_date
            last_date = target_date
            
            day_cases = [c for c in cases if c.call_date.date() == target_date.date()]
            
            # Calculate TOTAL dispatch time and case duration (sum, not average)
            total_dispatch_time = sum(c.time_to_dispatch or 0 for c in day_cases)
            total_case_duration = sum(c.case_duration or 0 for c in day_cases)
            
            # Format: "Mon (1.2.2026)" - day name with day.month.year
            day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            formatted_date = f"{target_date.day}.{target_date.month}.{target_date.year}"
            
            time_data.append({
                "label": f"{day_names[day]} ({formatted_date})",
                "day_name": day_names[day],
                "date": formatted_date,
                "full_date": target_date.strftime("%Y-%m-%d"),
                "dispatch_time": round(total_dispatch_time, 2),
                "case_duration": round(total_case_duration, 2),
                "count": len(day_cases)
            })
        
        # Add formatted range for display
        if first_date and last_date:
            formatted_range = f"{first_date.day}.{first_date.month}.{first_date.year} - {last_date.day}.{last_date.month}.{last_date.year}"
            # Add to first item for easy access
            if time_data:
                time_data[0]["formatted_range"] = formatted_range
    else:  # monthly
        # Group by day of month with day names
        days_in_month = (end_date - start_date).days
        for day in range(days_in_month):
            target_date = start_date + timedelta(days=day)
            day_cases = [c for c in cases if c.call_date.date() == target_date.date()]
            
            # Calculate TOTAL dispatch time and case duration (sum, not average)
            total_dispatch_time = sum(c.time_to_dispatch or 0 for c in day_cases)
            total_case_duration = sum(c.case_duration or 0 for c in day_cases)
            
            # Format: "Mon (1.1.2026)" - day name with day.month.year
            day_names_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            day_name = day_names_short[target_date.weekday()]
            formatted_date = f"{target_date.day}.{target_date.month}.{target_date.year}"
            
            time_data.append({
                "label": f"{day_name} ({formatted_date})",
                "day_name": day_name,
                "date": formatted_date,
                "full_date": target_date.strftime("%Y-%m-%d"),
                "dispatch_time": round(total_dispatch_time, 2),
                "case_duration": round(total_case_duration, 2),
                "count": len(day_cases)
            })
        
        # Add formatted month range for display
        month_name = start_date.strftime("%B")
        formatted_month_range = f"1-{days_in_month} {month_name} {start_date.year}"
    
    result = {
        "period": period,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "total_cases": len(cases),
        "status_counts": status_counts,
        "time_metrics": time_data
    }
    
    # Add formatted month range for monthly view
    if period == "monthly":
        month_name = start_date.strftime("%B")
        days_in_month = (end_date - start_date).days
        result["formatted_month_range"] = f"1-{days_in_month} {month_name} {start_date.year}"
    
    return result