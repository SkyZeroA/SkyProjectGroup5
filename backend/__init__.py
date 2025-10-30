import os
from flask import Flask
from flask_cors import CORS

template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__),'..', 'frontend', 'templates'))

app = Flask(__name__, template_folder=template_dir)
app.config.update(
    SESSION_COOKIE_NAME="session",
    SESSION_COOKIE_SAMESITE="Lax",    # Allows cross-origin cookie usage
    SESSION_COOKIE_SECURE=False        # Must be False if not using HTTPS locally
)

SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY

from . import routes

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# --------- For avatar image uploading ---------------

# Gets directory of project folder and then appends /uploads to it
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

# Creates folder if it doesnt exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Adds path and allowed file types to flask apps config directory - accessable anywhere
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'tiff', 'bmp', 'webp'}
