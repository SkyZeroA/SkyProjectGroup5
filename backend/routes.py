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
        print("New user inserted:", session['username'], session['email'])
        return jsonify({"message": "Sign up successful"}), 200


@app.route('/api/questionnaire', methods=['POST'])
def questionnaire():
    # print("User email from session:", session['email'])
    print(session['email'])
    data = request.get_json()
    print("Questionnaire data received:", data)
    answers = Questionnaire(data, get_user_id_from_db(session['email']))
    # print(answers.get_questionnaire())
    insert_into_questionnaire(answers.format_answers())
    return jsonify({"message": "Questionnaire submitted successfully"}), 200


@app.route('/api/user-activities', methods=['GET'])
def user_activities():
    user_id = get_user_id_from_db(session['email'])
    activities = get_users_preferred_activities(user_id)
    return jsonify(activities), 200


@app.route('/api/log-activity', methods=['POST'])
def log_activity():
    data = request.get_json()
    user_id = get_user_id_from_db(session['email'])
    week_number = get_current_week_number()
    month_number = get_current_month_number()
    for activity_name, value in data.items():
       activity_id = get_activity_id(activity_name)
       for _ in range(value):
              insert_user_activity(user_id, activity_id, week_number, month_number)
    return jsonify({"message": "Activity logged successfully"}), 200

# The old way to get all questions in ActivityKey table
@app.route('/api/fetch-questions', methods=['GET'])
def fetch_questions():
    questions = get_all_activity_names()
    return jsonify(questions), 200

@app.route('/api/update-user-activities', methods=['POST'])
def update_user_activities():
    data = request.get_json()
    selected_activities = data.get('activities', [])
    print("Selected activities received:", selected_activities)
    user_id = get_user_id_from_db(session['email'])
    update_user_preferred_activities(user_id, selected_activities)
    return jsonify({"message": "User activities updated successfully"}), 200
    

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    email = session['email']
    username = get_username_from_db(email)
    week_leaderboard = read_view_table_week()
    month_leaderboard = read_view_table_month()
    answers, user_id = get_answers_from_questionnaire(email)
    questionnaire_answers = Questionnaire(answers, user_id)
    # print(questionnaire_answers)
    projected_carbon_dict = questionnaire_answers.calculate_projected_carbon_footprint()
    projected = projected_carbon_dict["annual_total"]
    current = projected_carbon_dict["current_to_date"]
    # print(week_leaderboard)
    # print(month_leaderboard)
    return jsonify({"message": "Leaderboard send successful",
                   "weekLeaderboard": week_leaderboard,
                   "monthLeaderboard": month_leaderboard,
                   "projectedCarbon": projected,
                   "currentCarbon": current,
                   "username": username}), 200

