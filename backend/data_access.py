import mysql.connector as mysql
from pathlib import Path

def _get_connection():
    return mysql.connect(user="root", passwd="", host="localhost", database="SkyZeroDB")


def _close_connection(connection):
    connection.close()

def init_db():
    # Locate the SQL script in the repository root
    repo_root = Path(__file__).resolve().parents[1]
    candidates = [repo_root / 'create_db_table.sql']
    sql_path = None
    for p in candidates:
        if p.exists():
            sql_path = p
            break
    if sql_path is None:
        raise FileNotFoundError('No SQL schema file found. Expected create_table.sql, creat_table.sql or database-v1.sql in project root.')

    sql_script = sql_path.read_text()

    # Connect without specifying the database so CREATE DATABASE / USE work
    conn = mysql.connect(user="root", passwd="", host="localhost")
    cursor = conn.cursor()
    try:
        # Some mysql connector versions don't support multi=True on cursor.execute.
        # Split the script on semicolons and execute statements one-by-one.
        statements = [s.strip() for s in sql_script.split(';')]
        for stmt in statements:
            if not stmt:
                continue
            try:
                cursor.execute(stmt)
            except Exception as e:
                # If a statement fails, include context and re-raise
                raise RuntimeError(f"Failed executing statement: {stmt[:200]!r}") from e
        conn.commit()
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass

def init_insert():
    # Locate the SQL script in the repository root
    repo_root = Path(__file__).resolve().parents[1]
    insert_path = repo_root / 'insert_create_view.sql'
    if not insert_path.exists():
        raise FileNotFoundError('insert_create_view.sql not found in project root.')

    sql_script = insert_path.read_text()

    db = _get_connection()
    cursor = db.cursor()
    try:
        # Some mysql connector versions don't support multi=True on cursor.execute.
        # Split the script on semicolons and execute statements one-by-one.
        statements = [s.strip() for s in sql_script.split(';')]
        for stmt in statements:
            if not stmt:
                continue
            try:
                cursor.execute(stmt)
            except Exception as e:
                # If a statement fails, include context and re-raise
                raise RuntimeError(f"Failed executing statement: {stmt[:200]!r}") from e
        db.commit()
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        try:
            db.close()
        except Exception:
            pass

def check_password(email, password_hash):
    db = _get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT encrypted_password FROM User WHERE email = %s", (email,))
    correct_password_hash = cursor.fetchone()[0]
    _close_connection(db)

    if password_hash != correct_password_hash:
        return False
    else:
        return True

def read_user_table():
    user_list = []
    email_list = []
    db = _get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT username, email FROM User')
    db_info = cursor.fetchall()
    for username, email in db_info:
        user_list.append(username)
        email_list.append(email)
    _close_connection(db)
    return user_list, email_list

def read_view_table():
    db = _get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT username, totalPoints FROM week_leaderboard')
    db_info = cursor.fetchall()
    _close_connection(db)
    return db_info

