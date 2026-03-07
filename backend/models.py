from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
import enum
import datetime

class AttendanceStatus(str, enum.Enum):
    present = "Present"
    absent = "Absent"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_deleted = Column(Boolean, default=False, nullable=False)

    attendances = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False, default=datetime.date.today)
    status = Column(Enum(AttendanceStatus), nullable=False)

    employee = relationship("Employee", back_populates="attendances")
