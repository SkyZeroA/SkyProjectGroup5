import mysql.connector as mysql
from pathlib import Path
from datetime import date, timedelta, datetime
import os

# Load environment variables
try:
    from dotenv import load_dotenv
    ENV = os.getenv('ENV', os.getenv('FLASK_ENV', 'development'))
    env_filename = f'env.{ENV}'

    env_path = Path(__file__).resolve().parents[0] / env_filename
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except Exception:
    pass

def get_db_connect_kwargs():
    """Return kwargs suitable for `mysql.connector.connect(**kwargs)`.

    Reads DB_* environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT,
    DB_NAME). If DB_PORT is not set it will be omitted.
    """
    db_user = os.getenv('DB_USER', 'root')
    db_password = os.getenv('DB_PASSWORD', '')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = os.getenv('DB_PORT')
    db_name = os.getenv('DB_NAME', 'SkyZeroDB')

    kwargs = {
        'user': db_user,
        'passwd': db_password,
        'host': db_host,
        'database': db_name,
    }
    if db_port:
        try:
            kwargs['port'] = int(db_port)
        except ValueError:
            # leave as-is if it's not an int
            kwargs['port'] = db_port
    return kwargs


def get_connection():
    """Return a MySQL connection using environment-configurable settings.

    The connection kwargs are taken from `get_db_connect_kwargs()`.
    """
    kwargs = get_db_connect_kwargs()
    return mysql.connect(**kwargs)

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
    answers = len(questionnaire)
    placeholders = ", ".join(["%s"] * answers)
    cursor.execute(f"""
                   INSERT INTO QuestionnaireResponse
                   (userId, transportMethod, travelDistance, officeDays, dietDays, meats, heatingHours)
                   VALUES ({placeholders})
                   """, questionnaire)
    db.commit()
    close_connection(db)


def get_latest_answers_from_questionnaire(email):
    db = get_connection()
    cursor = db.cursor()
    user_id = get_user_id_from_db(email)
    cursor.execute("""
        SELECT
        transportMethod, travelDistance, officeDays, dietDays, meats, heatingHours
        FROM QuestionnaireResponse
        WHERE userID = %s
        ORDER BY dateSubmitted DESC
        LIMIT 1
        """, (user_id,))
    response = cursor.fetchone()
    close_connection(db)
    if response is None:
        return []
    else:
        response = {"transportMethod": response[0],
                    "travelDistance": response[1], 
                    "officeDays": response[2], 
                    "dietDays": response[3],
                    "meats": response[4],
                    "heatingHours": response[5]}
        return response


def get_all_questionnaire_submissions(email):
    db = get_connection()
    cursor = db.cursor()
    user_id = get_user_id_from_db(email)

    cursor.execute("""
        SELECT
            transportMethod,
            travelDistance,
            officeDays,
            dietDays,
            meats,
            heatingHours,
            dateSubmitted
        FROM QuestionnaireResponse
        WHERE userID = %s
        ORDER BY dateSubmitted ASC
    """, (user_id,))

    rows = cursor.fetchall()
    close_connection(db)

    # Convert each row into a dictionary
    submissions = []
    for row in rows:
        submissions.append({
            "userId": user_id,
            "transportMethod": row[0],
            "travelDistance": row[1],
            "officeDays": row[2],
            "dietDays": row[3],
            "meats": row[4],
            "heatingHours": row[5],
            "dateSubmitted": row[6]
        })

    return submissions



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


def get_first_name_from_db(email):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT firstName FROM User WHERE email = %s", (email,))
    first_name = cursor.fetchone()[0]
    close_connection(db)
    return first_name


def get_avatar_from_db(email):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT avatarFilename FROM User WHERE email = %s", (email,))
    avatar = cursor.fetchone()[0]
    close_connection(db)
    return avatar


def insert_new_user(email, first_name, username, password):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO User(firstName, username, email, encrypted_password) VALUES (%s, %s, %s, %s)", (first_name, username, email, password))
    db.commit()
    close_connection(db)


def read_view_table_week():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT username, avatarFilename, totalPoints FROM week_leaderboard')
    db_info = cursor.fetchall()
    close_connection(db)
    converted_data = [{"name": username, "avatarFilename": avatar_filename, "score": int(score)} for username, avatar_filename, score in db_info]
    return converted_data


def read_view_table_month():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT username, avatarFilename, totalPoints FROM month_leaderboard')
    db_info = cursor.fetchall()
    close_connection(db)
    converted_data = [{"name": username, "avatarFilename": avatar_filename, "score": int(score)} for username, avatar_filename, score in db_info]
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
    cursor.execute("SELECT ak.activity_name FROM UserActivity ua JOIN ActivityKey ak ON ua.activityID = ak.activityID WHERE ua.userID = %s", (user_id,))
    activities = [row[0] for row in cursor.fetchall()]
    close_connection(db)
    return activities

# The old way to get all questions in ActivityKey table
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


def update_user_preferred_activities(user_id, selected_activities):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("DELETE FROM UserActivity WHERE userID = %s", (user_id,))
    for activity_name in selected_activities:
        activity_id = get_activity_id(activity_name)
        cursor.execute("INSERT INTO UserActivity (userID, activityID) VALUES (%s, %s)", (user_id, activity_id))
    db.commit()
    close_connection(db)


def get_user_activity_count(user_id, activity_id):
    db = get_connection()
    cursor = db.cursor()
    week_number = get_current_week_number()
    cursor.execute("""
        SELECT 
            COALESCE(SUM(CASE WHEN ec.positive_activity = TRUE THEN 1 ELSE -1 END), 0) as count
        FROM EcoCounter ec 
        WHERE ec.userID = %s AND ec.activityID = %s AND ec.weekID = %s
    """, (user_id, activity_id, week_number))
    count = cursor.fetchone()[0]
    close_connection(db)
    return count


def get_user_activity_count_total(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""
        SELECT activityID, 
            COALESCE(SUM(CASE WHEN ec.positive_activity = TRUE THEN 1 ELSE -1 END), 0) as count
        FROM EcoCounter ec 
        WHERE ec.userID = %s
        GROUP BY activityID
    """, (user_id,))
    count_data = cursor.fetchall()
    close_connection(db)
    converted_data = [(activity_id, int(count)) for activity_id, count in count_data]
    return converted_data


def insert_user_activity(user_id, activity, weekID, monthID, positive_activity):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO EcoCounter (userID, weekID, monthID, activityID, positive_activity)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, weekID, monthID, activity, positive_activity))
    db.commit()
    close_connection(db)


def update_user_avatar(email, avatarFilename):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE User
        SET avatarFilename = %s
        WHERE email = %s
    """, (avatarFilename, email))
    db.commit()
    close_connection(db)

def get_user_daily_ranks(user_id, period="week", start_date=None, end_date=None):
    db = get_connection()
    cursor = db.cursor(dictionary=True)

    # ---- Parse date inputs ----
    if start_date:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    else:
        today = date.today()
        start_date = today - timedelta(days=today.weekday())  # Monday by default

    if end_date:
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    else:
        end_date = date.today()

    # ---- Query total scores between range ----
    query = """
        SELECT 
            e.userID AS user_id,
            e.date_done AS date,
            COALESCE(SUM(CASE 
                        WHEN e.positive_activity = TRUE THEN a.value_points
                        ELSE -a.value_points
                        END), 0) AS total_score
        FROM EcoCounter e
        JOIN ActivityKey a ON e.activityID = a.activityID
        WHERE e.date_done BETWEEN %s AND %s
        GROUP BY e.userID, e.date_done
        ORDER BY e.date_done ASC, total_score DESC;
    """
    cursor.execute(query, (start_date, end_date))
    daily_scores = cursor.fetchall()
    close_connection(db)

    # ---- Build list of all days in that range ----
    dates = [(start_date + timedelta(days=i)) for i in range((end_date - start_date).days + 1)]

    cumulative_scores = {}
    daily_ranks = []

    for d in dates:
        # Update running totals
        for row in [r for r in daily_scores if r["date"] == d]:
            uid = row["user_id"]
            score = row["total_score"] or 0
            cumulative_scores[uid] = cumulative_scores.get(uid, 0) + score

        # Rank users by cumulative score so far
        ranked_users = sorted(
            cumulative_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        ranks_dict = {}
        last_score = None
        last_rank = 0
        for i, (uid, total) in enumerate(ranked_users, start=1):
            if total == last_score:
                rank = last_rank
            else:
                rank = i
                last_score = total
                last_rank = rank
            ranks_dict[uid] = rank

        # Save only the current user's rank
        daily_ranks.append({
            "date": d.isoformat(),
            "rank": ranks_dict.get(user_id)
        })

    return daily_ranks
