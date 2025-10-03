import mysql.connector as mysql


def _get_connection():
    return mysql.connect(user="root", passwd="", host="localhost", database="SkyZeroDB")


def _close_connection(connection):
    connection.close()


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

