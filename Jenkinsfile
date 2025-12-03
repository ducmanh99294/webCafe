pipeline {
    agent any

    environment {
        IMAGE_BACKEND  = "ducsmanh/backend-webcafe"
        IMAGE_FRONTEND = "ducsmanh/frontend-webcafe"
        DEPLOY_SERVER  = "172.31.25.62"
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
                    sh """
                        docker build -t ${IMAGE_BACKEND}:${env.BUILD_NUMBER} ./backend
                        docker tag ${IMAGE_BACKEND}:${env.BUILD_NUMBER} ${IMAGE_BACKEND}:latest
                        
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

        stage('Deploy Containers') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'server-ssh-key',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh """
                        ssh -i ${SSH_KEY} ${SSH_USER}@${DEPLOY_SERVER} '
                        docker network create webcafe-network || true

                        docker pull ${IMAGE_BACKEND}:latest
                        docker pull ${IMAGE_FRONTEND}:latest

                        # Xóa container cũ nếu có
                        docker rm -f backend-webcafe || true
                        docker rm -f frontend-webcafe || true

                        docker run -d --name backend-webcafe --network webcafe-network -p 8081:8080 ${IMAGE_BACKEND}:latest
                        docker run -d --name frontend-webcafe --network webcafe-network -p 3001:3000 ${IMAGE_FRONTEND}:latest
                        '
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
