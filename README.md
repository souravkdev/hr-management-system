# HRMS Lite

A lightweight Human Resource Management System built with **FastAPI** (Backend) and **Next.js** (Frontend).

## Features
- **Employee Management**: Add, list, and delete employees.
- **Attendance Tracking**: Mark daily attendance (Present/Absent) and view history.
- **Admin Dashboard**: Quick overview of total employees and today's attendance.
- **Secure Login**: Protected admin area with a modern login interface.

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 1. Backend Setup (FastAPI)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic[email] psycopg2-binary
   ```
   *Note: The project is currently configured to use **SQLite** (`hrms.db`) for easy local setup.*
4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`. You can view the interactive API docs at `http://localhost:8000/docs`.

### 2. Frontend Setup (Next.js)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## 🔐 Admin Credentials
To access the system, use the following default credentials on the login page:

- **Username**: `admin`
- **Password**: `admin123`

---

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React, Axios.
- **Backend**: FastAPI, SQLAlchemy ORM.
- **Database**: SQLite (Local development), PostgreSQL.
- **Testing**: Pytest.

## 🧪 Running Tests
To run backend tests:
```bash
cd backend
venv/bin/pytest test_main.py
```
