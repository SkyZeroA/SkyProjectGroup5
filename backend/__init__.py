import os
from flask import Flask
from flask_cors import CORS

template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__),'..', 'frontend', 'templates'))

app = Flask(__name__, template_folder=template_dir)
CORS(app)

SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY

from . import routes