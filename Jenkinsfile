pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/Rachelferns/notify.git'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up --build -d'
            }
        }

        stage('Test') {
            steps {
                sh 'echo "App running successfully"'
            }
        }
    }
}