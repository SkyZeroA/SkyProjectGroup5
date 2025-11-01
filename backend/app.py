from . import app
import backend.data_access  as db
import backend.config as config
from urllib.parse import urlparse


if __name__ == "__main__":
    db.init_db()
    db.init_insert()

    #  Parse BASE_URL to get host and port
    parsed_url = urlparse(config.BASE_URL)
    host = parsed_url.hostname or "localhost"
    port = parsed_url.port or 9099

    app.run(host=host, port=port, debug=(config.ENV == 'development'))

    # app.run(host="localhost", port=9099, debug=True)

# To run this you need to be in the main project folder "SkyProjectGropu5"
# Then run the following command:
# python3 -m backend.app