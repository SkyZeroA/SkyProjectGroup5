# 🌍 ClearSky — Local Setup Guide

This README will guide you through setting up the **ClearSky** website on your local machine for testing.

---

## ⚙️ Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Python 3.8+**
- **Node.js & npm**
- **Git**
- A code editor or IDE (e.g., VS Code, PyCharm)

---



## STEP BY STEP INSTRUCTIONS FOR SETUP:

### 1. Open Your IDE
Open your preferred Integrated Development Environment (IDE) such as **VS Code** or **PyCharm**.

---

### 2. Clone the Repository
In your terminal, clone the project repository to your local machine:

```bash
git clone https://github.com/SkyZeroA/SkyProjectGroup5.git


---

### 3. Navigate to the Project Folder
Move into the cloned project directory:

```bash
cd your-repo-name


---

### 4. Start the Backend Server
While inside the main project folder, run the backend using Python:

```bash
python3 -m backend.app

⚠️ Ensure you are in the main project directory before running this command.
This will start the backend server on your local machine.


---

### 5. Open a New Terminal for the Frontend
Open another terminal window or tab, then navigate to the frontend folder:

```bash
cd react-frontend


---

### 5. Install Frontend Dependencies
Install all the required npm packages:

```bash
npm install


---

### 5. Start the Frontend Application
Once installation is complete, start the frontend development server:

```bash
npm start

This will launch the website on your local browser, usually at:

http://localhost:3000


____

## Notes
- Keep both terminals running — one for the backend and one for the frontend.
- If you encounter any errors, check if all dependencies are correctly installed.
