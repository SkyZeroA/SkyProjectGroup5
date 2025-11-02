import os
from pathlib import Path
from dotenv import load_dotenv

# Environment: 'production' or 'development' (default)
ENV = os.getenv('ENV', os.getenv('FLASK_ENV', 'development'))

# Try to load a .env file if present (optional dependency)
try:
    env_path = Path(__file__).resolve().parents[1] / '.env.{ENV}'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except Exception:
    # If python-dotenv isn't installed, we still work using environment variables
    pass


# Base URL configuration per environment
DEFAULT_DEV_BASE = "http://localhost:9099"
DEFAULT_PROD_BASE = os.getenv('PROD_BASE_URL', 'https://example.com')

if ENV == 'production':
    BASE_URL = os.getenv('BASE_URL', DEFAULT_PROD_BASE)
else:
    BASE_URL = os.getenv('BASE_URL', DEFAULT_DEV_BASE)


# Database connection settings. Supports either a set of variables or a full
# DATABASE_URL (mysql+mysqlconnector://user:password@host:port/dbname) if you
# prefer composing a single URL in your deployment platform.

DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', '3306')) if os.getenv('DB_PORT') else None
DB_NAME = os.getenv('DB_NAME', 'SkyZeroDB')

# Optional full URL (not directly usable by mysql-connector without parsing),
# but we expose it so callers can decide how to parse it if needed.
DATABASE_URL = os.getenv('DATABASE_URL')


def get_db_connect_kwargs():
    """Return kwargs suitable for `mysql.connector.connect(**kwargs)`.

    Priority:
    1. Explicit DB_* variables
    2. DATABASE_URL (left for advanced parsing by caller)
    """
    kwargs = {
        'user': DB_USER,
        'passwd': DB_PASSWORD,
        'host': DB_HOST,
        'database': DB_NAME,
    }
    if DB_PORT:
        kwargs['port'] = DB_PORT
    return kwargs


def is_production():
    return ENV == 'production'
