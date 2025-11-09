from functools import wraps
from flask import session, jsonify, g
from data_access import get_user_id_from_db

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        email = session.get('email')
        if not email:
            return jsonify({"error": "User not signed in"}), 401
        g.email = email  # store globally in request context
        g.user_id = get_user_id_from_db(email)
        return f(*args, **kwargs)
    return decorated_function
