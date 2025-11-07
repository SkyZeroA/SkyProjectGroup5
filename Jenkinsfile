// This adds install and test stages before static code analysis
pipeline {
  agent any

  environment {
    MY_ENV_FILE = credentials('Team5Env')
  }

  stages {
    stage('Checkout') {
        steps {
          // Get some code from a GitHub repository
          git branch: 'main', url: 'https://github.com/SkyZeroA/SkyProjectGroup5.git'
        }
    }

    stage('Install Backend') {
        steps {
            sh '''
            python3 -m venv venv
            source venv/bin/activate
            python3 -m pip install -r requirements.txt
            '''
        }
    }

    stage('Test Backend') {
        steps {
            sh '''
            python3 -m pytest -q --cov
            '''
        }
    }

    stage('Install Frontend') {
        steps {
            sh 'cd react-frontend && npm install'
        }
    }

    stage('Test Frontend') {
        steps {
            sh 'cd react-frontend && npm test --watchAll=false --coverage'
        }
    }

  }
}