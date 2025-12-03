pipeline {
    agent any

    environment {
        IMAGE_BACKEND  = "ducsmanh/backend-webcafe"
        IMAGE_FRONTEND = "ducsmanh/frontend-webcafe"
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend (Gradle)') {
            steps {
                dir('backend') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build --no-daemon -x test'
                    sh 'ls -la build/libs'
                }
            }
        }

        stage('Build Frontend (Vite)') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'ls -la dist || echo "Không tìm thấy dist/, kiểm tra cấu hình Vite!"'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Backend
                    sh """
                        docker build -t ${IMAGE_BACKEND}:${env.BUILD_NUMBER} ./backend
                        docker tag ${IMAGE_BACKEND}:${env.BUILD_NUMBER} ${IMAGE_BACKEND}:latest
                    """

                    // Frontend
                    sh """
                        docker build -t ${IMAGE_FRONTEND}:${env.BUILD_NUMBER} ./frontend
                        docker tag ${IMAGE_FRONTEND}:${env.BUILD_NUMBER} ${IMAGE_FRONTEND}:latest
                    """
                }
            }
        }

        stage('Docker Login & Push Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh """
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin

                        docker push ${IMAGE_BACKEND}:${env.BUILD_NUMBER}
                        docker push ${IMAGE_BACKEND}:latest

                        docker push ${IMAGE_FRONTEND}:${env.BUILD_NUMBER}
                        docker push ${IMAGE_FRONTEND}:latest

                        docker logout || true
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE_PATH')
                ]) {

                    sh """
                        echo "Triển khai Kubernetes..."
                        kubectl --kubeconfig=${KUBECONFIG_FILE_PATH} apply -f k8s/

                        # Chờ Deployment ổn định
                        kubectl --kubeconfig=${KUBECONFIG_FILE_PATH} rollout status deployment/webcafe-backend --timeout=300s
                        kubectl --kubeconfig=${KUBECONFIG_FILE_PATH} rollout status deployment/webcafe-frontend --timeout=300s
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Dọn dẹp pipeline xong.'
        }
        success {
            echo 'CI/CD hoàn tất — ứng dụng đã được deploy thành công!'
        }
        failure {
            echo 'Build FAILED — Kiểm tra lại log để sửa lỗi.'
        }
    }
}
