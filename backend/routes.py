from flask import render_template, request, session, redirect, url_for, jsonify
from backend import app
from hashlib import sha256

from backend.Questionnaire import Questionnaire
from backend.data_access import *


@app.route('/api/sign-in', methods=['POST'])
def sign_in():
    data = request.get_json()
    session['email'] = data['email']

    # TODO:
    # Remove this line when passwords are hashed in the database
    session['password'] = data['password']
    # h = sha256()
    # h.update(rdata['password'].encode('utf-8'))
    # session['password'] = h.hexdigest()

    if check_password(session['email'], session['password']):
        return jsonify({"message": "Sign in successful"}), 200
    else:
        return jsonify({"error": "Incorrect username or password"}), 401


@app.route('/api/sign-up', methods=['POST'])
def sign_up():
    data = request.get_json()

    session['email'] = data['email']
    session['first-name'] = data['first-name']
    session['username'] = data['username']

    users, emails = read_user_table()

    if session['username'] in users:
        return jsonify({"error": "Username already exists"}), 401

    if session['email'] in emails:
        return jsonify({"error": "Email already has an account"}), 401

    # TODO:
    # Remove this line when passwords are hashed in the database    
    session['password'] = data['password']
    # h1 = sha256()
    # h1.update(data['password'].encode('utf-8'))
    # session['password'] = h1.hexdigest()

    # TODO:
    # Uncomment this and remove second if statement when passwords are hashed in the database

    # h2 = sha256()
    # h2.update(data['confirm-password'].encode('utf-8'))
    # if h2.hexdigest() != session['password']:
    if data['confirm-password'] != data['password']:
        return jsonify({"error": "Passwords do not match"}), 401
    else:
        insert_new_user(session['email'], session['first-name'], session['username'], session['password'])
        return jsonify({"message": "Sign up successful"}), 200


@app.route('/questionnaire', methods=['GET', 'POST'])
def questionnaire():
    if request.method == 'POST':
        print (session['email'])
        answers = Questionnaire(request.form.to_dict(), get_user_id_from_db(session['email']))
        print(answers.get_questionnaire())
        insert_into_questionnaire(answers.format_answers())
        return redirect(url_for('dashboard'))


    return render_template('questionnaire.html')


@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    email = session['email']
    username = get_username_from_db(email)
    week_leaderboard = read_view_table_week()
    month_leaderboard = read_view_table_month()
    print(week_leaderboard)
    print(month_leaderboard)
    return jsonify({"message": "Leaderboard send successful",
                   "weekLeaderboard": week_leaderboard,
                   "monthLeaderboard": month_leaderboard,
                   "username": username}), 200




