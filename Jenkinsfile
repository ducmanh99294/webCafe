// Pipeline CI/CD cho Spring Boot (Gradle) và Vite/React (Nginx)

pipeline {
  agent any
  
  // KHỐI environment CHỈ CHỨA CÁC BIẾN STRING ĐƠN GIẢN (KHÔNG CHỨA credentials())
  environment {
    IMAGE_BACKEND = "ducsmanh/backend-webcafe" 
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
          // Gradle build
          sh './gradlew build --no-daemon -x test' 
          sh 'ls -la build/libs'
        }
      }
    }

    stage('Build Frontend (Vite)') {
      steps {
        dir('frontend') {
          // Cài đặt và build Node.js
          sh 'npm install' 
          sh 'npm run build'
          sh 'ls -la dist || ls -la build || true' 
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          // Backend image
          sh """
            docker build -t ${IMAGE_BACKEND}:${env.BUILD_NUMBER} ./backend
            docker tag ${IMAGE_BACKEND}:${env.BUILD_NUMBER} ${IMAGE_BACKEND}:latest
          """
          // Frontend image
          sh """
            docker build -t ${IMAGE_FRONTEND}:${env.BUILD_NUMBER} ./frontend
            docker tag ${IMAGE_FRONTEND}:${env.BUILD_NUMBER} ${IMAGE_FRONTEND}:latest
          """
        }
      }
    }

    stage('Docker Login & Push') {
      steps {
        // Dùng withCredentials để INJECT biến Secret
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_CRED_USR', passwordVariable: 'DOCKERHUB_CRED_PSW')]) {
          sh """
            // Đăng nhập Docker bằng biến Secret đã được inject
            echo ${DOCKERHUB_CRED_PSW} | docker login -u ${DOCKERHUB_CRED_USR} --password-stdin
            
            echo "Bắt đầu đẩy images..."
            docker push ${IMAGE_BACKEND}:${env.BUILD_NUMBER}
            docker push ${IMAGE_BACKEND}:latest
            docker push ${IMAGE_FRONTEND}:${env.BUILD_NUMBER}
            docker push ${IMAGE_FRONTEND}:latest
            echo "Đã đẩy thành công!"
            
            // Logout
            docker logout || true 
          """
        }
      }
    }
  }
  
  post {
    always {
      echo 'Thao tác dọn dẹp đã hoàn tất.' 
    }
    success {
      echo "Pipeline CI/CD thành công. Images đã có trên DockerHub."
    }
    failure {
      echo "Pipeline thất bại! Vui lòng kiểm tra lỗi build/docker."
    }
  }
}