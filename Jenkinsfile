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

    stage('Check Python') {
        steps {
            sh '''
            which python || true
            which python3 || true
            python --version || true
            python3 --version || true
            '''
        }
    }

    stage('Install Backend') {
        steps {
            sh 'python3 -m pip install -r requirements.txt'
        }
    }


    stage('Install Frontend') {
        steps {
            sh 'cd react-frontend && npm install'
        }
    }
    // stage('Test') {
    //     steps {
    //         sh 'cd react-frontend && npm test'
    //     }
    // }

  }
}