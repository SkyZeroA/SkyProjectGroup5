pipeline {
  agent {
    docker {
      image 'python:3.11'
      args '-u root'  // run as root so npm installs work
    }
  }

  environment {
    MY_ENV_FILE = credentials('Team5Env') // Your Jenkins secret file
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/SkyZeroA/SkyProjectGroup5.git'
      }
    }

    stage('Load Environment Variables') {
      steps {
        script {
          // Read the env file and convert to key=value pairs for Jenkins
          def envVars = readFile("$MY_ENV_FILE")
                          .split("\n")
                          .findAll { it && !it.startsWith("#") }
                          .collect { it.trim() }

          // Export to environment for all subsequent stages
          envVars.each { line ->
            def (key, value) = line.tokenize('=')
            env."$key" = value
          }
        }
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

    stage('SonarQube Analysis') {
      agent { label 'jenkins-host' }  // run on host instead of Docker
      environment {
        scannerHome = tool 'sonarqube'
      }
      steps {
        withSonarQubeEnv('sonar-qube-1') {
          sh "${scannerHome}/bin/sonar-scanner"
        }
        timeout(time: 10, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
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
