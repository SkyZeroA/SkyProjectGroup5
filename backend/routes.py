from flask import render_template, request, session, redirect, url_for
from backend import app
from hashlib import sha256

from Questionnaire import Questionnaire

@app.route('/', methods=['GET', 'POST'])
@app.route('/sign-in', methods=['GET', 'POST'])
def sign_in():
    if request.method == 'POST':
        session['email'] = request.form['email']

        h = sha256()
        h.update(request.form['password'].encode('utf-8'))
        session['password'] = h.hexdigest()

        #TODO: check db that password correct using email

        return redirect(url_for('dashboard'))
    return render_template('sign-in.html')


@app.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        session['email'] = request.form['email']
        session['first-name'] = request.form['first-name']
        session['username'] = request.form['username']

        #TODO validate username and email are unique

        h1 = sha256()
        h1.update(request.form['password'].encode('utf-8'))
        session['password'] = h1.hexdigest()

        h2 = sha256()
        h2.update(request.form['confirm-password'].encode('utf-8'))
        if h2.hexdigest() != session['password']:

            #TODO: return to page with initial fields filled in
            return render_template('sign-up.html')
        else:
            print(session['password'], session['email'], session['first-name'], session['username'])
            return redirect(url_for('questionnaire'))

    return render_template('sign-up.html')


@app.route('/questionnaire', methods=['GET', 'POST'])
def questionnaire():
    if request.method == 'POST':
        answers = Questionnaire(request.form.to_dict())
        print(answers.get_questionnaire())
        return redirect(url_for('dashboard'))

    return render_template('questionnaire.html')


@app.route('/dashboard')
def dashboard():
    #TODO: pull leaderboard from db
    return "Dashboard"





