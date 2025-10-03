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

