from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import os

import models, schemas, crud
from database import engine, get_db

app = FastAPI(title="HRMS Lite API")

# Root endpoint for health checks
@app.get("/")
def read_root():
    return {"status": "ok", "message": "HRMS Lite API is running"}

@app.on_event("startup")
def startup_db_client():
    try:
        models.Base.metadata.create_all(bind=engine)
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        # We don't raise here so the app can still start and we can see logs/health

# Setup CORS to allow Next.js app to communicate
origins = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", ""),
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/employees/", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_email(db, email=employee.email)
    if db_employee:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_employee(db=db, employee=employee)

@app.get("/employees/", response_model=List[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = crud.get_employees(db, skip=skip, limit=limit)
    return employees

@app.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    crud.delete_employee(db=db, employee_id=employee_id)
    return {"ok": True}

@app.post("/attendance/", response_model=schemas.Attendance, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=attendance.employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return crud.create_attendance(db=db, attendance=attendance)

@app.get("/attendance/by-date/{date}", response_model=List[schemas.Attendance])
def read_attendance_by_date(date: str, db: Session = Depends(get_db)):
    return crud.get_attendance_by_date(db=db, date=date)

@app.get("/attendance/{employee_id}", response_model=List[schemas.Attendance])
def read_attendance(employee_id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return crud.get_attendance(db=db, employee_id=employee_id)

@app.get("/dashboard/", response_model=schemas.DashboardSummary)
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_summary(db)
