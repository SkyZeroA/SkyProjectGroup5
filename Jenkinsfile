pipeline {
  agent any

  environment {
    PROJECT_DIR = "${env.WORKSPACE}"
  }

  stages {
    stage('Checkout') {
      steps {
        script {
          // Checkout repo into PROJECT_DIR
          sh """
          mkdir -p ${PROJECT_DIR}
          cd ${PROJECT_DIR}
          if [ -d .git ]; then
            git pull origin main
          else
            git clone -b main https://github.com/SkyZeroA/SkyProjectGroup5.git ${PROJECT_DIR}
          fi
          """
        }
      }
    }

    stage('SonarQube Analysis') {
      environment {
        scannerHome = tool 'sonarqube'
      }
      steps {
        withSonarQubeEnv('sonar-qube-1') {
          sh """
          cd ${PROJECT_DIR}
          ${scannerHome}/bin/sonar-scanner
          """
        }
      }
    }

    stage('Build & Deploy') {
      steps {
        script {
          sh """
          cd ${PROJECT_DIR}
          docker compose down
          docker compose up --build -d
          """
        }
      }
    }
  }
}
