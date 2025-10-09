from . import app
import backend.data_access as db


if __name__ == "__main__":
    db.init_db()
    db.init_insert()
    app.run(port=9099, debug=True)

# To run this you need to be in the main project folder "SkyProjectGropu5"
# Then run the following command:
# python3 -m backend.app