import os
from flask import request, session, jsonify, send_from_directory, g
from backend import app
from hashlib import sha256
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_wtf.csrf import generate_csrf


from decorators import login_required
from Questionnaire import Questionnaire
from data_access import *
from helpers import allowed_file
from ai_functions import generate_tip


@app.route('/api/csrf-token', methods=['GET'])
def get_csrf_token():
    # Returns a CSRF token to single-page apps. The token is also stored in the session
    # by Flask-WTF's generate_csrf, so CSRFProtect will validate incoming requests
    token = generate_csrf()
    return jsonify({"csrf_token": token}), 200

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
        # print("New user inserted:", session['username'], session['email'])
        return jsonify({"message": "Sign up successful"}), 200


@app.route('/api/sign-out', methods=['POST'])
def sign_out():
    session.clear()
    return jsonify({"message": "Sign out successful"}), 200


@app.route('/api/set-questionnaire', methods=['POST'])
@login_required
def questionnaire():
    # print("User email from session:", session['email'])
    data = request.get_json()
    # print("Questionnaire data received:", data)
    answers = Questionnaire(data, g.user_id, datetime.today())
    # print(answers.format_answers())
    insert_into_questionnaire(answers.format_answers())
    return jsonify({"message": "Questionnaire submitted successfully"}), 200


@app.route('/api/user-activities', methods=['GET'])
@login_required
def user_activities():
    activities = get_users_preferred_activities(g.user_id)
    return jsonify(activities), 200


@app.route('/api/log-activity', methods=['POST'])
@login_required
def log_activity():
    data = request.get_json()
    week_number = get_current_week_number()
    month_number = get_current_month_number()
    question = data.get('question')
    isPositive = data.get('isPositive')
    activity_id = get_activity_id(question)
    insert_user_activity(g.user_id, activity_id, week_number, month_number, isPositive)
    return jsonify({"message": "Activity logged successfully"}), 200


@app.route('/api/fetch-questions', methods=['GET'])
def fetch_questions():
    questions = get_all_activity_names()
    return jsonify(questions), 200


@app.route('/api/update-user-activities', methods=['POST'])
@login_required
def update_user_activities():
    data = request.get_json()
    selected_activities = data.get('activities', [])
    # print("Selected activities received:", selected_activities)
    update_user_preferred_activities(g.user_id, selected_activities)
    return jsonify({"message": "User activities updated successfully"}), 200


@app.route('/api/user-activity-counts', methods=['GET'])
@login_required
def user_activity_counts():
    activities = get_users_preferred_activities_no_points(g.user_id)
    activity_counts = {}
    for activity in activities:
        activity_id = get_activity_id(activity)
        count = get_user_activity_count(g.user_id, activity_id)
        activity_counts[activity] = count
    return jsonify(activity_counts), 200

@app.route('/api/dashboard', methods=['GET'])
@login_required
def dashboard():
    username = get_username_from_db(g.user_id)
    week_leaderboard = read_view_table_week()
    month_leaderboard = read_view_table_month()
    
    # Loop over all responses and create questionnaire classes for each
    questionnaires = []
    previous_questionnaire = -99
    current_questionnaire = -99
    submissions = get_all_questionnaire_submissions(g.user_id)
    for i, submission in enumerate(submissions):
        # Get first and last keys and extract values from dict
        keys = list(submission.keys())
        user_id_key = keys[0]
        date_key = keys[-1]

        user_id = submission[user_id_key]
        date = submission[date_key]

        # Rest in dict are answers to questionnaire
        answers = {k: v for k, v in submission.items() if k not in (user_id_key, date_key)}
        if i == 0:
            # Assign earliest questionnaire to Jan 1st so it covers whole year if answers never edited
            current_questionnaire = Questionnaire(answers, user_id, datetime(2025, 1, 1))
        else:
            previous_questionnaire = current_questionnaire
            previous_questionnaire.set_end_date(date)
            questionnaires.append(previous_questionnaire)
            
            current_questionnaire = Questionnaire(answers, user_id, date)
    questionnaires.append(current_questionnaire)
    # print(f"Total questionnaires processed: {len(questionnaires)}")

    total_carbon = 0
    projected_carbon = 0
    current_carbon = 0
    transport_emissions = 0
    diet_emissions = 0
    heating_emissions = 0
    turn_off_devices_emissions = 0
    recycle_emissions = 0
    reusable_emissions = 0
    food_waste_emissions = 0
    for questionnaire in questionnaires:
        emissions_dict = questionnaire.calculate_projected_carbon_footprint()
        total_carbon += emissions_dict["total_projected"]
        projected_carbon += emissions_dict["projected"]
        current_carbon += emissions_dict["current"]
        transport_emissions += emissions_dict["transport_emissions"]
        diet_emissions += emissions_dict["diet_emissions"]
        heating_emissions += emissions_dict["heating_emissions"]
        turn_off_devices_emissions += emissions_dict["turn_off_devices_emissions"]
        recycle_emissions += emissions_dict["recycle_emissions"]
        reusable_emissions += emissions_dict["reusable_emissions"]
        food_waste_emissions += emissions_dict["food_waste_emissions"]

    return jsonify({"message": "Leaderboard send successful",
                   "weekLeaderboard": week_leaderboard,
                   "monthLeaderboard": month_leaderboard,
                   "transportEmissions": transport_emissions,
                   "dietEmissions": diet_emissions,
                   "heatingEmissions": heating_emissions,
                    "turnOffDevicesEmissions": turn_off_devices_emissions,
                   "recycleEmissions": recycle_emissions,
                    "reusableEmissions": reusable_emissions,
                    "foodWasteEmissions": food_waste_emissions,
                   "totalCarbon": total_carbon,
                   "projectedCarbon": projected_carbon,
                   "currentCarbon": current_carbon,
                   "username": username
                   }), 200


BUFFER_SIZE = 5   # number of tips stored in DB
DISPLAY_COUNT = 3  # number of tips shown to the user

@app.route('/api/initial-ai-tips')
@login_required
def generate_initial_tips():
    tips = get_tips_from_db(g.user_id) or []

    # If user already has tips
    if tips and len(tips) >= DISPLAY_COUNT:
        # Return only the last DISPLAY_COUNT
        return jsonify({
            "message": "Tips loaded from buffer",
            "tips": tips[-DISPLAY_COUNT:]
        }), 200

    # Otherwise, create DISPLAY_COUNT tips
    tips = [generate_tip(g.user_id) for _ in range(DISPLAY_COUNT)]
    set_tips_in_db(g.user_id, tips)

    return jsonify({
        "message": "Tips generated",
        "tips": tips
    }), 200


@app.route('/api/ai-tip')
@login_required
def generate_ai_tip():
    tips = get_tips_from_db(g.user_id) or []

    # Generate a new tip
    new_tip = generate_tip(g.user_id)
    tips.append(new_tip)

    # Keep buffer to max BUFFER_SIZE
    if len(tips) > BUFFER_SIZE:
        tips = tips[-BUFFER_SIZE:]  # keep only the most recent BUFFER_SIZE tips

    # Save back to DB
    set_tips_in_db(g.user_id, tips)

    return jsonify({
        "message": "Tip generated",
        "tip": new_tip
    }), 200



@app.route('/api/stats', methods=['GET'])
@login_required
def stats():
    username = get_username_from_db(g.user_id)
    week_leaderboard = read_view_table_week()
    month_leaderboard = read_view_table_month()
    
    # Loop over all responses and create questionnaire classes for each
    questionnaires = []
    previous_questionnaire = -99
    current_questionnaire = -99
    submissions = get_all_questionnaire_submissions(g.user_id)
    for i, submission in enumerate(submissions):
        # Get first and last keys and extract values from dict
        keys = list(submission.keys())
        user_id_key = keys[0]
        date_key = keys[-1]

        user_id = submission[user_id_key]
        date = submission[date_key]

        # Rest in dict are answers to questionnaire
        answers = {k: v for k, v in submission.items() if k not in (user_id_key, date_key)}
        if i == 0:
            # Assign earliest questionnaire to Jan 1st so it covers whole year if answers never edited
            current_questionnaire = Questionnaire(answers, user_id, datetime(2025, 1, 1))
        else:
            previous_questionnaire = current_questionnaire
            previous_questionnaire.set_end_date(date)
            questionnaires.append(previous_questionnaire)
            
            current_questionnaire = Questionnaire(answers, user_id, date)
    questionnaires.append(current_questionnaire)
    # print(f"Total questionnaires processed: {len(questionnaires)}")

    total_carbon = 0
    projected_carbon = 0
    current_carbon = 0
    transport_emissions = 0
    diet_emissions = 0
    heating_emissions = 0
    turn_off_devices_emissions = 0
    recycle_emissions = 0
    reusable_emissions = 0
    food_waste_emissions = 0
    for questionnaire in questionnaires:
        emissions_dict = questionnaire.calculate_projected_carbon_footprint()
        total_carbon += emissions_dict["total_projected"]
        projected_carbon += emissions_dict["projected"]
        current_carbon += emissions_dict["current"]
        transport_emissions += emissions_dict["transport_emissions"]
        diet_emissions += emissions_dict["diet_emissions"]
        heating_emissions += emissions_dict["heating_emissions"]
        turn_off_devices_emissions += emissions_dict["turn_off_devices_emissions"]
        recycle_emissions += emissions_dict["recycle_emissions"]
        reusable_emissions += emissions_dict["reusable_emissions"]
        food_waste_emissions += emissions_dict["food_waste_emissions"]

    week_data = get_highest_week_points()
    month_data = get_highest_month_points()
    highest_week_user = week_data['username']
    highest_week_points = week_data['points']
    highest_month_user = month_data['username']
    highest_month_points = month_data['points']
    user_highest_week = get_user_highest_week_points(user_id)
    user_highest_month = get_user_highest_month_points(user_id)

    return jsonify({"message": "Leaderboard send successful",
                   "weekLeaderboard": week_leaderboard,
                   "monthLeaderboard": month_leaderboard,
                   "transportEmissions": transport_emissions,
                   "dietEmissions": diet_emissions,
                   "heatingEmissions": heating_emissions,
                   "turnOffDevicesEmissions": turn_off_devices_emissions,
                   "recycleEmissions": recycle_emissions,
                   "reusableEmissions": reusable_emissions,
                   "foodWasteEmissions": food_waste_emissions,
                   "totalCarbon": total_carbon,
                   "projectedCarbon": projected_carbon,
                   "currentCarbon": current_carbon,
                   "username": username,
                   "highestWeekUser": highest_week_user,
                   "highestWeekPoints": highest_week_points,
                   "highestMonthUser": highest_month_user,
                   "highestMonthPoints": highest_month_points,
                   "userBestWeek": user_highest_week,
                   "userBestMonth": user_highest_month
                   }), 200

@app.route('/api/daily-rank', methods=['GET'])
@login_required
def daily_rank():
    period = request.args.get('period', 'week')
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    ranks = get_user_daily_ranks(g.user_id, period, start_date, end_date)
    return jsonify({"username": get_username_from_db(g.user_id), "ranks": ranks}), 200


@app.route('/api/fetch-user-data')
@login_required
def fetch_user_data():
    username = get_username_from_db(g.user_id)
    first_name = get_first_name_from_db(g.user_id)
    avatar_filename = get_avatar_from_db(g.user_id)
    avatar = f"/uploads/{avatar_filename}" if avatar_filename else None
    # print(username, first_name)
    return jsonify({"message": "User data fetch successful",
                    "username": username,
                    "firstName": first_name,
                    "avatar": avatar}), 200


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/upload-avatar', methods=['POST'])
@login_required
def upload_avatar():
    file = request.files["avatar"]

    # print(file)

    if file and allowed_file(file.filename):
        # Save file in uploads folder
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Store filename in db
        update_user_avatar(g.user_id, filename)

        return jsonify({"message": "Avatar uploaded successfully"}), 200

    return jsonify({"error": "Invalid file type"}), 400


@app.route('/api/fetch-questionnaire-answers')
@login_required
def fetch_questionnaire_answers():
    answers = get_latest_answers_from_questionnaire(g.user_id)
    return jsonify({"message": "Fetching questionnaire answers",
                    "answers": answers}), 200


@app.route('/api/calendar-activity-counts', methods=['GET'])
@login_required
def calendar_activity_counts():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    counts = get_daily_activity_counts(g.user_id, start_date, end_date)

    return jsonify({"counts": counts}), 200

@app.route('/api/user-points', methods=['GET'])
@login_required
def user_points():
    period = request.args.get("period")  # "week" or "month"
    year = int(request.args.get("year", 2025))
    month_chunk = int(request.args.get("monthChunk", 0))
    week_chunk = request.args.get("weekChunk")  # New

    if period == "week":
        week_chunk = int(week_chunk or 0)  # default to 0
        data = get_user_week_points(g.user_id, year, week_chunk)
    elif period == "month":
        data = get_user_month_points(g.user_id, year, month_chunk)
    else:
        return jsonify({"error": "Invalid period"}), 400

    return jsonify(data)

