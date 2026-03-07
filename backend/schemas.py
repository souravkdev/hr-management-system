from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import List, Optional
from models import AttendanceStatus

class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    employee_id: int

class Attendance(AttendanceBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True

class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    created_at: datetime
    attendances: List[Attendance] = []

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
