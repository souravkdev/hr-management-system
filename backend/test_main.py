from fastapi.testclient import TestClient
from main import app
from database import Base, engine, get_db
from sqlalchemy.orm import sessionmaker
import pytest

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_employee():
    response = client.post(
        "/employees/",
        json={"full_name": "Test User", "email": "test@example.com", "department": "Engineering"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_read_employees():
    client.post(
        "/employees/",
        json={"full_name": "Test User 2", "email": "test2@example.com", "department": "HR"}
    )
    response = client.get("/employees/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_mark_attendance():
    # First create an employee
    emp_response = client.post(
        "/employees/",
        json={"full_name": "Attendance User", "email": "att@example.com", "department": "Sales"}
    )
    emp_id = emp_response.json()["id"]

    # Mark attendance
    response = client.post(
        "/attendance/",
        json={"employee_id": emp_id, "date": "2026-03-07", "status": "Present"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "Present"
    assert data["employee_id"] == emp_id
