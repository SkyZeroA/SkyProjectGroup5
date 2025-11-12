pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git url: 'https://github.com/SkyZeroA/SkyProjectGroup5.git', branch: 'main'
            }
        }

        stage('Inject .env files') {
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env-team5', variable: 'ROOT_ENV'),
                    file(credentialsId: 'frontend-env-team5', variable: 'FRONTEND_ENV')
                ]) {
                    // Place the files in the correct repo paths
                    sh '''
                        cp $ROOT_ENV ./  # copy root .env to repo root
                        chmod 600 ./.env
                        
                        cp $FRONTEND_ENV ./react-frontend/  # copy frontend .env
                        chmod 600 ./react-frontend/.env
                    '''
                }
            }
        }

        stage('Build & Start Docker Containers') {
            steps {
                sh 'docker compose up --build -d'
            }
        }
    }
}
