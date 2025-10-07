from backend import app
import data_access as db


if __name__ == "__main__":
    db.init_db()
    db.init_insert()
    app.run(port=9099, debug=True)