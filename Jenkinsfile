pipeline {
  agent {
    docker {
      image 'python:3.11'
      args '-u root'
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

    stage('Load Environment Variables') {
      steps {
        // Copy .env file from Jenkins secret and export variables
        sh '''
        echo "Loading environment variables..."
        cp "$MY_ENV_FILE" .env
        set -a
        source .env
        set +a
        echo "Environment variables loaded:"
        grep -v '^#' .env || true
        '''
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
        set -a
        source .env
        set +a
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
