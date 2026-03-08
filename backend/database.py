from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Build absolute path to db/hrms.db at project root (one level above backend/)
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_BACKEND_DIR)
_DEFAULT_DB_PATH = os.path.join(_PROJECT_ROOT, "db", "hrms.db")

# Prioritize Vercel/Supabase environment variables
DATABASE_URL = os.getenv("POSTGRES_URL") or os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Diagnostic logging (masked)
    from urllib.parse import urlparse
    parsed = urlparse(DATABASE_URL)
    print(f"Using database connection: {parsed.scheme}://{parsed.hostname}:{parsed.port}{parsed.path}")
else:
    print("WARNING: No DATABASE_URL or POSTGRES_URL found in environment. Falling back to localhost.")
    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"

# SQLAlchemy requires 'postgresql://' instead of 'postgres://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Sanitize Supabase/Vercel connection strings
# psycopg2 doesn't like the 'supa' parameter often found in Supabase pooler strings
if "?" in DATABASE_URL:
    base_url, query = DATABASE_URL.split("?", 1)
    params = query.split("&")
    # Keep standard params, remove 'supa' or other custom ones if they cause issues
    filtered_params = [p for p in params if not p.startswith("supa=")]
    if filtered_params:
        DATABASE_URL = f"{base_url}?{'&'.join(filtered_params)}"
    else:
        DATABASE_URL = base_url

# SQLite specific argument
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
