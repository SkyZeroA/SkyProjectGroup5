from flask import render_template, request, session, redirect, url_for
from backend import app
from hashlib import sha256

from Questionnaire import Questionnaire
from data_access import read_view_table,check_password,read_user_table


@app.route('/', methods=['GET', 'POST'])
@app.route('/sign-in', methods=['GET', 'POST'])
def sign_in():
    if request.method == 'POST':
        session['email'] = request.form['email']

        session['password'] = request.form['password']
        # h = sha256()
        # h.update(request.form['password'].encode('utf-8'))
        # session['password'] = h.hexdigest()

        #TODO: check db that password correct using email
        if check_password(session['email'], session['password']):
            return redirect(url_for('dashboard'))
        else:
            return render_template('sign-in.html', error='Incorrect username or password')

    return render_template('sign-in.html')


@app.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        session['email'] = request.form['email']
        session['first-name'] = request.form['first-name']
        session['username'] = request.form['username']

        #TODO validate username and email are unique
        users, emails = read_user_table()
        username = request.form['username']
        email = request.form['email']

        if username in users:
            return render_template('sign-up.html', error='Username already exists')

        if email in emails:
            return render_template('sign-up.html', error='Email already exists')

        h1 = sha256()
        h1.update(request.form['password'].encode('utf-8'))
        session['password'] = h1.hexdigest()

        h2 = sha256()
        h2.update(request.form['confirm-password'].encode('utf-8'))
        if h2.hexdigest() != session['password']:

            #TODO: return to page with initial fields filled in
            return render_template('sign-up.html')
        else:
            insert_new_user(session['email'], session['first-name'], session['username'], session['password'])
            return redirect(url_for('questionnaire'))

    return render_template('sign-up.html')


@app.route('/questionnaire', methods=['GET', 'POST'])
def questionnaire():
    if request.method == 'POST':
        print (session['email'])
        answers = Questionnaire(request.form.to_dict(), get_user_id_from_db(session['email']))
        print(answers.get_questionnaire())
        insert_into_questionnaire(answers.format_answers())
        return redirect(url_for('dashboard'))

        #TODO: enter questionnaire data into db

    return render_template('questionnaire.html')


@app.route('/dashboard')
def dashboard():
    #TODO: pull leaderboard from db
    leaderboard = read_view_table()
    return render_template('dashboard.html', leaderboard=leaderboard)




