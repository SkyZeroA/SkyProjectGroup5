from . import app
import backend.data_access as db


if __name__ == "__main__":
    db.init_db()
    db.init_insert()
    app.run(port=9099, debug=True)