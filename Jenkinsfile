pipeline {
    agent any

    environment {
        APP_NAMESPACE = 'notify'
        IMAGE_NAMESPACE = 'rachelferns2005'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'chmod +x scripts/push-images.sh'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh 'echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin'
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh './scripts/push-images.sh "$DOCKERHUB_USERNAME" "$IMAGE_TAG"'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/configmap.yaml
                        kubectl apply -f k8s/secret.yaml
                        kubectl apply -f k8s/notice-service.yaml
                        kubectl apply -f k8s/auth-service.yaml
                        kubectl apply -f k8s/gateway.yaml
                        kubectl apply -f k8s/frontend.yaml
                    '''

                    sh '''
                        kubectl -n "$APP_NAMESPACE" set image deployment/frontend frontend="$IMAGE_NAMESPACE/frontend:$IMAGE_TAG"
                        kubectl -n "$APP_NAMESPACE" set image deployment/gateway gateway="$IMAGE_NAMESPACE/gateway:$IMAGE_TAG"
                        kubectl -n "$APP_NAMESPACE" set image deployment/notice-service notice-service="$IMAGE_NAMESPACE/notice-service:$IMAGE_TAG"
                        kubectl -n "$APP_NAMESPACE" set image deployment/auth-service auth-service="$IMAGE_NAMESPACE/auth-service:$IMAGE_TAG"
                    '''

                    sh '''
                        kubectl -n "$APP_NAMESPACE" rollout status deployment/notice-service --timeout=180s
                        kubectl -n "$APP_NAMESPACE" rollout status deployment/auth-service --timeout=180s
                        kubectl -n "$APP_NAMESPACE" rollout status deployment/gateway --timeout=180s
                    '''

                    sh '''
                        GATEWAY_HOST=""
                        for _ in $(seq 1 30); do
                          GATEWAY_HOST=$(kubectl -n "$APP_NAMESPACE" get svc gateway -o jsonpath='{.status.loadBalancer.ingress[0].hostname}{.status.loadBalancer.ingress[0].ip}')
                          if [ -n "$GATEWAY_HOST" ]; then
                            break
                          fi
                          sleep 10
                        done

                        if [ -n "$GATEWAY_HOST" ]; then
                          kubectl -n "$APP_NAMESPACE" set env deployment/frontend REACT_APP_API_URL="http://$GATEWAY_HOST:5003"
                        fi

                        kubectl -n "$APP_NAMESPACE" rollout restart deployment/frontend
                        kubectl -n "$APP_NAMESPACE" rollout status deployment/frontend --timeout=180s
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}
