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

def insert_into_questionnaire(questionnaire):
    db = _get_connection()
    cursor = db.cursor()
    # Needs %s for each question, first %s is for the userID
    cursor.execute("INSERT INTO QuestionnaireResponse VALUES (%s, %s, %s, %s)", questionnaire)
    db.commit()
    _close_connection(db)

def get_user_id_from_db(email):
    db = _get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT userID FROM User WHERE email = %s", (email,))
    user_id = cursor.fetchone()[0]
    _close_connection(db)
    return user_id

def insert_new_user(email, first_name, username, password):
    db = _get_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO User(firstName, username, email, encrypted_password) VALUES (%s, %s, %s, %s)", (first_name, username, email, password))
    db.commit()
    _close_connection(db)