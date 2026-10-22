pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Files') {
            steps {
                sh '''
                    set -eu
                    test -f docker-compose.yml
                    test -f backend/Dockerfile
                    test -f frontend/Dockerfile
                    test -f nginx/default.conf
                    test -f backend/server.js
                    test -f frontend/package.json
                    echo "All required deployment files exist."
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    set -eu
                    docker compose build
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    set -eu
                    docker compose up -d --remove-orphans
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    set -eu

                    echo "Checking frontend and API..."

                    for i in $(seq 1 30); do
                        if curl -fsS http://localhost/ >/dev/null &&
                           curl -fsS http://localhost/api/books >/dev/null; then
                            echo "Frontend and API are responding."
                            break
                        fi

                        if [ "$i" -eq 30 ]; then
                            echo "Application health check failed."
                            docker compose ps
                            docker compose logs --tail=100
                            exit 1
                        fi

                        sleep 2
                    done

                    echo "Checking Fantasy recommendations..."
                    curl -fsS \
                        "http://localhost/api/books?genre=Fantasy"

                    echo ""
                    echo "Deployment verification completed."
                '''
            }
        }
    }

    post {
        success {
            echo 'Book-Recommender deployed successfully!'
        }

        failure {
            echo 'Deployment failed. Check the Jenkins Console Output.'
        }

        always {
            sh 'docker compose ps || true'
        }
    }
}
