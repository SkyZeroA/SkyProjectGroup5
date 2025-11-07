pipeline {
  agent any

  stages {
    stage('Checkout') {
        steps {
          // Get some code from a GitHub repository
          git branch: 'main', url: 'https://github.com/SkyZeroA/SkyProjectGroup5.git'
        }
    }
    stage('SonarQube Analysis') {
      environment {
        scannerHome = tool 'sonarqube'
      }
      steps {
        sh '''
          # Make lcov paths relative
          sed -i 's|$PWD/||g' react-frontend/coverage/lcov.info

          # Run SonarScanner
          ${scannerHome}/bin/sonar-scanner
        '''
      }
    }

  }
}