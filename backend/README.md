# Backend environment configuration

This folder reads environment variables to control database connections and base URL.

Files added:

- `config.py` — centralizes `ENV`, `BASE_URL` and database settings. Use `config.get_db_connect_kwargs()` in code to obtain connection kwargs for `mysql.connector.connect()`.
- `.env.example` — example environment file. Copy to the project root `.env` or `backend/.env` when running locally.

Usage (development):

1. Copy `backend/.env.example` to `.env` in the project root (or `backend/.env`) and edit values.
2. Install dependencies: `pip install -r requirements.txt`
3. Run the app (from project root):

    python3 -m backend.app

Notes:
- The code prefers explicit DB_* variables (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME). A `DATABASE_URL` env var is also accepted if you want a single URL for your platform, but it is not auto-parsed by the connector in this repo.
- In production set `ENV=production` and provide `BASE_URL` and DB credentials appropriately.
