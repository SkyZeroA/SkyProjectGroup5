import mysql.connector as mysql
from pathlib import Path
from datetime import date, timedelta, datetime
import os
import json


# Load environment variables
try:
    from dotenv import load_dotenv
    ENV = os.getenv('ENV', os.getenv('FLASK_ENV', 'development'))
    env_filename = f'.env'

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
                   (userId, transportMethod, travelDistance, officeDays, dietDays, meats, heatingHours, turnOffDevices, recycle, reusable, foodWaste)
                   VALUES ({placeholders})
                   """, questionnaire)
    db.commit()
    close_connection(db)


def get_latest_answers_from_questionnaire(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""
        SELECT
        transportMethod, travelDistance, officeDays, dietDays, meats, heatingHours, turnOffDevices, recycle, reusable, foodWaste
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
                    "heatingHours": response[5],
                    "turnOffDevices": response[6],
                    "recycle": response[7],
                    "reusable": response[8],
                    "foodWaste": response[9]}
        return response


def get_all_questionnaire_submissions(user_id):
    db = get_connection()
    cursor = db.cursor()

    cursor.execute("""
        SELECT
            transportMethod,
            travelDistance,
            officeDays,
            dietDays,
            meats,
            heatingHours,
            turnOffDevices,
            recycle,
            reusable,
            foodWaste,
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
            "turnOffDevices": row[6],
            "recycle": row[7],
            "reusable": row[8],
            "foodWaste": row[9],
            "dateSubmitted": row[10]
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
    user_id = cursor.fetchone()
    close_connection(db)
    if user_id and user_id[0]:
        return user_id[0]
    return None


def get_username_from_db(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT username FROM User WHERE userID = %s", (user_id,))
    username = cursor.fetchone()
    close_connection(db)
    if username and username[0]:
        return username[0]
    return None


def get_first_name_from_db(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT firstName FROM User WHERE userID = %s", (user_id,))
    first_name = cursor.fetchone()
    close_connection(db)
    if first_name and first_name[0]:
        return first_name[0]
    return None


def get_tips_from_db(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT tips FROM User WHERE userID = %s", (user_id,))
    result = cursor.fetchone()
    close_connection(db)

    if result and result[0]:
        return json.loads(result[0])
    return None


def set_tips_in_db(user_id, tips):
    db = get_connection()
    cursor = db.cursor()

    tips_json = json.dumps(tips)

    cursor.execute("""
                   UPDATE User
                   SET tips = %s
                   WHERE userID = %s
                   """, (tips_json, user_id))
    db.commit()
    close_connection(db)


def get_avatar_from_db(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT avatarFilename FROM User WHERE userID = %s", (user_id,))
    avatar = cursor.fetchone()
    close_connection(db)
    if avatar and avatar[0]:
        return avatar[0]
    return None


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
    cursor.execute("SELECT ak.activity_name, ak.value_points FROM UserActivity ua JOIN ActivityKey ak ON ua.activityID = ak.activityID WHERE ua.userID = %s", (user_id,))
    activities = [{"name": row[0], "points": int(row[1])} for row in cursor.fetchall()]
    close_connection(db)
    return activities

def get_users_preferred_activities_no_points(user_id):
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
    cursor.execute("SELECT activity_name, value_points FROM ActivityKey")
    activities = [{"name": row[0], "points": int(row[1])} for row in cursor.fetchall()]
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


def update_user_avatar(user_id, avatarFilename):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE User
        SET avatarFilename = %s
        WHERE userID = %s
    """, (avatarFilename, user_id))
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

def get_daily_activity_counts(user_id, start_date=None, end_date=None):
    if isinstance(start_date, str):
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    if isinstance(end_date, str):
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

    db = get_connection()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT
            date_done AS activity_date,
            COALESCE(SUM(CASE WHEN positive_activity = TRUE THEN 1 ELSE -1 END), 0) AS daily_count
        FROM EcoCounter
        WHERE userID = %s AND date_done BETWEEN %s AND %s
        GROUP BY date_done
        ORDER BY date_done ASC
    """
    cursor.execute(query, (user_id, start_date, end_date))
    results = cursor.fetchall()
    # print("DB results:", results)
    close_connection(db)

    # Convert to dict
    counts_by_date = {row["activity_date"].strftime("%Y-%m-%d"): row["daily_count"] for row in results}

    # Fill missing dates with 0
    total_days = (end_date - start_date).days + 1
    for i in range(total_days):
        d = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        if d not in counts_by_date:
            counts_by_date[d] = 0

    return counts_by_date

def get_highest_week_points():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""SELECT u.username, weekly_totals.weekly_points
                        FROM (
                            SELECT 
                                e.weekID,
                                e.userID,
                                SUM(CASE
                                    WHEN e.positive_activity = TRUE THEN a.value_points
                                    WHEN e.positive_activity = FALSE THEN -a.value_points
                                END) AS weekly_points
                            FROM EcoCounter e
                            JOIN ActivityKey a ON e.activityID = a.activityID
                            GROUP BY e.weekID, e.userID
                        ) AS weekly_totals
                        JOIN User u ON weekly_totals.userID = u.userID
                        ORDER BY weekly_points DESC
                        LIMIT 1;
                        """)
    result = cursor.fetchone()
    close_connection(db)
    if result:
        return {"username": result[0], "points": result[1]}
    else:
        return {"username": None, "points": 0}

def get_highest_month_points():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""SELECT u.username, monthly_totals.monthly_points
                        FROM (
                            SELECT 
                                e.monthID,
                                e.userID,
                                SUM(CASE
                                    WHEN e.positive_activity = TRUE THEN a.value_points
                                    WHEN e.positive_activity = FALSE THEN -a.value_points
                                END) AS monthly_points
                            FROM EcoCounter e
                            JOIN ActivityKey a ON e.activityID = a.activityID
                            GROUP BY e.monthID, e.userID
                        ) AS monthly_totals
                        JOIN User u ON monthly_totals.userID = u.userID
                        ORDER BY monthly_points DESC
                        LIMIT 1;
                        """)
    result = cursor.fetchone()
    # print(result)
    close_connection(db)
    if result:
        user_id, points = result
        return {"username": user_id, "points": points}
    else:
        return {"username": None, "points": 0}
    
def get_user_week_points(user_id, year, week_chunk=0):
    db = get_connection()
    cursor = db.cursor(dictionary=True)
 
    # Select all weeks in the given year
    cursor.execute("""
        SELECT weekID, week_start, week_end
        FROM Week
        WHERE YEAR(week_start) = %s
        ORDER BY week_start ASC
    """, (year,))
    weeks = cursor.fetchall()
 
    # Determine 6-week interval
    start_index = week_chunk * 6
    end_index = start_index + 6
    weeks_interval = weeks[start_index:end_index]
 
    result = []
 
    for w in weeks_interval:
        week_id = w['weekID']
 
        # --- User points (with positive/negative weighting) ---
        cursor.execute("""
            SELECT COALESCE(SUM(
                CASE
                    WHEN ec.positive_activity = TRUE THEN ak.value_points
                    WHEN ec.positive_activity = FALSE THEN -ak.value_points
                END
            ), 0) AS total
            FROM EcoCounter ec
            JOIN ActivityKey ak ON ec.activityID = ak.activityID
            WHERE ec.userID = %s AND ec.weekID = %s
        """, (user_id, week_id))
        user_points = cursor.fetchone()['total'] or 0
 
        # --- Average points (average of total per user, same weighting) ---
        cursor.execute("""
            SELECT COALESCE(AVG(sub.total), 0) AS avg_points
            FROM (
                SELECT 
                    ec.userID,
                    SUM(
                        CASE
                            WHEN ec.positive_activity = TRUE THEN ak.value_points
                            WHEN ec.positive_activity = FALSE THEN -ak.value_points
                        END
                    ) AS total
                FROM EcoCounter ec
                JOIN ActivityKey ak ON ec.activityID = ak.activityID
                WHERE ec.weekID = %s
                GROUP BY ec.userID
            ) AS sub
        """, (week_id,))
        average_points = cursor.fetchone()['avg_points'] or 0
 
        result.append({
            "label": f"Week {week_id}",
            "userPoints": user_points,
            "averagePoints": round(average_points, 2)
        })
 
    cursor.close()
    db.close()
    return result

def get_user_month_points(user_id, year, chunk=0):
    db = get_connection()
    cursor = db.cursor(dictionary=True)
 
    # Determine months for chunk
    start_month = 1 + chunk * 6
    end_month = start_month + 5

    cursor.execute("""
        SELECT monthID, MONTH(month_start) AS month
        FROM Month
        WHERE YEAR(month_start) = %s AND MONTH(month_start) BETWEEN %s AND %s
        ORDER BY month_start ASC
    """, (year, start_month, end_month))
    months = cursor.fetchall()

    result = []
    for m in months:
        month_id = m['monthID']
        month_label = date(year, m['month'], 1).strftime("%b")
 
        # --- User points (with positive/negative weighting) ---
        cursor.execute("""
            SELECT COALESCE(SUM(
                CASE
                    WHEN ec.positive_activity = TRUE THEN ak.value_points
                    WHEN ec.positive_activity = FALSE THEN -ak.value_points
                END
            ), 0) AS total
            FROM EcoCounter ec
            JOIN ActivityKey ak ON ec.activityID = ak.activityID
            WHERE ec.userID = %s AND ec.monthID = %s
        """, (user_id, month_id))
        user_points = cursor.fetchone()['total'] or 0
 
        # --- Average points (average of total per user, same weighting) ---
        cursor.execute("""
            SELECT COALESCE(AVG(sub.total), 0) AS avg_points
            FROM (
                SELECT 
                    ec.userID,
                    SUM(
                        CASE
                            WHEN ec.positive_activity = TRUE THEN ak.value_points
                            WHEN ec.positive_activity = FALSE THEN -ak.value_points
                        END
                    ) AS total
                FROM EcoCounter ec
                JOIN ActivityKey ak ON ec.activityID = ak.activityID
                WHERE ec.monthID = %s
                GROUP BY ec.userID
            ) AS sub
        """, (month_id,))
        average_points = cursor.fetchone()['avg_points'] or 0
 
        result.append({
            "label": month_label,
            "userPoints": user_points,
            "averagePoints": round(average_points, 2)
        })
 
    cursor.close()
    db.close()
    return result

def get_user_highest_week_points(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""SELECT 
                        SUM(
                            CASE
                                WHEN e.positive_activity = TRUE THEN a.value_points
                                WHEN e.positive_activity = FALSE THEN -a.value_points
                            END
                        ) AS weekly_points
                    FROM EcoCounter e
                    JOIN ActivityKey a ON e.activityID = a.activityID
                    WHERE e.userID = %s
                    GROUP BY e.weekID
                    ORDER BY weekly_points DESC
                    LIMIT 1;
                        """, (user_id,))
    result = cursor.fetchone()
    close_connection(db)
    if result:
        return result[0]
    else:
        return 0
    
def get_user_highest_month_points(user_id):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("""SELECT 
                        SUM(
                            CASE
                                WHEN e.positive_activity = TRUE THEN a.value_points
                                WHEN e.positive_activity = FALSE THEN -a.value_points
                            END
                        ) AS monthly_points
                    FROM EcoCounter AS e
                    JOIN ActivityKey AS a ON e.activityID = a.activityID
                    WHERE e.userID = %s
                    GROUP BY e.monthID
                    ORDER BY monthly_points DESC
                    LIMIT 1;
                        """, (user_id,))
    result = cursor.fetchone()
    close_connection(db)
    if result:
        return result[0]
    else:
        return 0
