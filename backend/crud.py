from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas
from datetime import date

def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(
        models.Employee.id == employee_id,
        models.Employee.is_deleted == False
    ).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(
        models.Employee.email == email,
        models.Employee.is_deleted == False
    ).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).filter(
        models.Employee.is_deleted == False
    ).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int):
    db_employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()  # fetch even if already deleted, to handle gracefully
    if db_employee:
        db_employee.is_deleted = True
        db.commit()
    return db_employee

def create_attendance(db: Session, attendance: schemas.AttendanceCreate):
    # Check if attendance already marked for the day
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()
    
    if existing:
        existing.status = attendance.status
        db.commit()
        db.refresh(existing)
        return existing

    db_attendance = models.Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_attendance(db: Session, employee_id: int):
    return db.query(models.Attendance).filter(models.Attendance.employee_id == employee_id).all()

def get_attendance_by_date(db: Session, date: str):
    return db.query(models.Attendance).filter(models.Attendance.date == date).all()

def get_dashboard_summary(db: Session):
    today = date.today()
    total_employees = db.query(models.Employee).count()
    present_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == models.AttendanceStatus.present
    ).count()
    absent_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == models.AttendanceStatus.absent
    ).count()
    
    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today
    }
