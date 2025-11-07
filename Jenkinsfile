// This adds install and test stages before static code analysis
pipeline {
  agent any

  stages {
    stage('Checkout') {
        steps {
          // Get some code from a GitHub repository
          git branch: 'main', url: 'https://github.com/SkyZeroA/SkyProjectGroup5.git'
        }
    }
    stage('Install') {
        steps {
            sh 'cd react-frontend && npm install'
        }
   }

    stage('Test') {
        steps {
            sh 'cd react-frontend && npm test'
        }
    }

  }
}