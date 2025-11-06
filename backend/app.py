import app
import data_access as db
from urllib.parse import urlparse
import os
from pathlib import Path

# Optionally load a local .env (backend/.env) if present. If python-dotenv is
# not installed this is skipped and environment variables must be set externally.
try:
    from dotenv import load_dotenv
    ENV = os.getenv('ENV', os.getenv('FLASK_ENV', 'development'))
    env_filename = f'env'

    env_path = Path(__file__).resolve().parents[0] / env_filename
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except Exception:
    pass


if __name__ == "__main__":
    db.init_db()
    db.init_insert()

    # Determine ENV and BASE_URL from environment variables
    # ENV = os.getenv('ENV', os.getenv('FLASK_ENV', 'development'))
    # DEFAULT_DEV_BASE = "http://localhost:9099"
    # DEFAULT_PROD_BASE = os.getenv('PROD_BASE_URL', 'https://example.com')

    # if ENV == 'production':
    #     BASE_URL = os.getenv('BASE_URL', DEFAULT_PROD_BASE)
    # else:
    #     BASE_URL = os.getenv('BASE_URL', DEFAULT_DEV_BASE)
    

    # You no longer need to check ENV again to decide which default to use — the .env file will handle that!!!
    BASE_URL = os.getenv('BASE_URL', 'http://localhost:9099')

    # Parse BASE_URL to get host and port
    parsed_url = urlparse(BASE_URL)
    host = parsed_url.hostname or "localhost"
    port = parsed_url.port or 9099

    app.run(host=host, port=port, debug=(ENV == 'development'))

    # app.run(host="localhost", port=9099, debug=True)

# To run this you need to be in the main project folder "SkyProjectGropu5"
# Then run the following command:
# python3 -m backend.app