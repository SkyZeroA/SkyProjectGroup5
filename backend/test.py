from flask import Flask, session, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'test'

app.config.update(
    SESSION_COOKIE_NAME="session",
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=False
)

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.route('/api/set-session', methods=['POST'])
def set_session():
    session['test'] = 'hello-world'
    return jsonify({"message": "Session set!"})

@app.route('/api/check-session', methods=['GET'])
def check_session():
    value = session.get('test', 'No session found')
    return jsonify({"session_value": value})

if __name__ == '__main__':
    app.run(host="localhost", port=9099, debug=True)