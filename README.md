### 🌍 ClearSky — Local Setup Guide
_______________
### Description
ClearSky is a web application where users can track, understand, and reduce their carbon impact! 
Our carbon footprint tracking platform helps employees of Sky measure their emissions, discover sustainable choices, and take meaningful steps towards a greener future.

Currently the features include a leaderboard where you can compete with others (fake employees atm) to have the greenest week and month
You will also be presented with a lifestyle questionnaire upon sign up, where answering these questions will give an estimate to your yearly carbon footprint


This README will guide you through setting up the **ClearSky** website on your local machine for testing.
____________________
### ⚙️ Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Python 3.8+**
- **Node.js & npm**
- **Git**

________________________________________
### STEP BY STEP INSTRUCTIONS FOR SETUP:

___________________________
### 1. Start MySQL services
Open the terminal on your machine and run the following command:
```bash
brew services start mysql
```

___________________________
### 2. Clone the repository
In the terminal, clone the project repository to your local machine and move to that directory:

```bash
git clone https://github.com/SkyZeroA/SkyProjectGroup5.git
cd your-repo-name
```

___________________________________________________________________
### 3. Start a virtual environment and download python dependencies
Run the following commands in the main project folder

```bash
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

_______________________________
### 4. Start the backend server
While inside the main project folder, run the backend using Python:

```bash
python3 -m backend.app
```

⚠️ Ensure you are in the main project directory before running this command.
This will start the backend server on your local machine.


___________________________________________
### 5. Open a new terminal for the frontend
With the backend now running, open another terminal window or tab - making sure you are still in the venv (run the activate command again if not) - then navigate to the frontend folder:

if needed
```bash
source venv/bin/activate
```


```bash
cd react-frontend
```

________________________________________________
### 6. Install the frontend dependencies and run
Install all the required npm packages and start the frontend:

```bash
npm install
npm start
```

This will launch the website on your local browser, usually at:

http://localhost:3000


Please try signing up as a new user - filling out the questionnaire - and navgating the dashboard
Also please try signing in as an existing user with the following details:

email: test@example.com
password: password

________________________________________________________________
### 7. Please fill out the google form and leave us any feedback
https://forms.office.com/Pages/ResponsePage.aspx?id=1WW4aBjPK0uCpKTt25xSN7HHXHnQtSNGmoixXNUHhnZURDJLVllKT01YTEg4T1pVOE9YODlMMFY4Ry4u

_________
### Notes
- Keep both terminals running — one for the backend and one for the frontend.
- If you encounter any errors, check if all dependencies are correctly installed.
