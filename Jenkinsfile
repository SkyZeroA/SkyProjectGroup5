pipeline {
  agent {
    docker {
      image 'python:3.11'  // or python:3.10 if you prefer
      args '-u root'       // run as root so npm installs work
    }
  }

  environment {
    MY_ENV_FILE = credentials('Team5Env')
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/SkyZeroA/SkyProjectGroup5.git'
      }
    }

    stage('Setup Backend') {
      steps {
        sh '''
        python3 -m pip install --upgrade pip
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
        sh '''
        apt-get update && apt-get install -y npm
        cd react-frontend && npm install
        '''
      }
    }

    stage('Test Frontend') {
      steps {
        sh '''
        cd react-frontend && npm test --watchAll=false --coverage
        '''
      }
    }
  }
}
