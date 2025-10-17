import mysql.connector as mysql
from pathlib import Path
from datetime import date

def get_connection():
    return mysql.connect(user="root", passwd="", host="localhost", database="SkyZeroDB")


def close_connection(connection):
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
        raise FileNotFoundError('No SQL schema file found. Expected create_table.sql, create_table.sql or database-v1.sql in project root.')

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

    db = get_connection()
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
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT encrypted_password FROM User WHERE email = %s", (email,))
    correct_password_hash = cursor.fetchone()
    close_connection(db)
    if correct_password_hash is None:
        return False
    else:
        return password_hash == correct_password_hash[0]

def insert_into_questionnaire(questionnaire):
    db = get_connection()
    cursor = db.cursor()
    # Needs %s for each question, first %s is for the userID
    cursor.execute("INSERT INTO QuestionnaireResponse VALUES (%s, %s, %s, %s)", questionnaire)
    db.commit()
    close_connection(db)

def read_user_table():
    user_list = []
    email_list = []
    db = get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT username, email FROM User')
    db_info = cursor.fetchall()
    for username, email in db_info:
        user_list.append(username)
        email_list.append(email)
    close_connection(db)
    return user_list, email_list

def get_user_id_from_db(email):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT userID FROM User WHERE email = %s", (email,))
    user_id = cursor.fetchone()[0]
    close_connection(db)
    return user_id

def get_username_from_db(email):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT username FROM User WHERE email = %s", (email,))
    username = cursor.fetchone()[0]
    close_connection(db)
    return username

def insert_new_user(email, first_name, username, password):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO User(firstName, username, email, encrypted_password) VALUES (%s, %s, %s, %s)", (first_name, username, email, password))
    db.commit()
    close_connection(db)

def read_view_table_week():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT username, totalPoints FROM week_leaderboard')
    db_info = cursor.fetchall()
    close_connection(db)
    converted_data = [{"name": username, "score": int(score)} for username, score in db_info]
    return converted_data

def read_view_table_month():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT username, totalPoints FROM month_leaderboard')
    db_info = cursor.fetchall()
    close_connection(db)
    converted_data = [{"name": username, "score": int(score)} for username, score in db_info]
    return converted_data

def get_current_week_number():
    today = date.today()
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT weekID FROM Week WHERE week_start <= %s AND week_end >= %s", (today, today))
    week_number = cursor.fetchone()[0]
    close_connection(db)
    return week_number

def get_current_month_number():
    today = date.today()
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT monthID FROM Month WHERE month_start <= %s AND month_end >= %s", (today, today))
    month_number = cursor.fetchone()[0]
    close_connection(db)
    return month_number

def get_users_preferred_activities(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT ak.activity_name FROM UserActivity ua JOIN ActivityKey ak ON ua.activityID = ak.activityID WHERE ua.userID = %s")
    activities = [row[0] for row in cursor.fetchall()]
    close_connection(db)
    return activities

def get_all_activity_names():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT activity_name FROM ActivityKey")
    activities = [row[0] for row in cursor.fetchall()]
    close_connection(db)
    return activities

def get_activity_id(activity_name):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT activityID FROM ActivityKey WHERE activity_name = %s", (activity_name,))
    activity_id = cursor.fetchone()[0]
    close_connection(db)
    return activity_id


def insert_user_activity(user_id, activity, weekID, monthID):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO EcoCounter (userID, weekID, monthID, activityID, positive_activity)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, weekID, monthID, activity, True))
    db.commit()
    close_connection(db)
