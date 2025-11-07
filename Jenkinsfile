
pipeline {
  agent any
  
  environment {
    DOCKERHUB_CRED = credentials('dockerhub-creds') 
    
    IMAGE_BACKEND = "ducsmanh/backend-webcafe" 
    IMAGE_FRONTEND = "ducsmanh/frontend-webcafe"
  }
  
  stages {
    stage('Checkout Source Code') {
      steps {
        // Lấy mã nguồn từ Git Repository
        checkout scm
      }
    }

    stage('Build Backend (Gradle)') {
      steps {
        // Chạy build trong thư mục backend
        dir('backend') {
          // Cấp quyền và chạy Gradle build
          sh 'chmod +x ./gradlew' 
          sh './gradlew build --no-daemon -x test' // -x test để bỏ qua test (nếu cần)
          sh 'ls -la build/libs'
        }
      }
    }

    stage('Build Frontend (Vite)') {
      steps {
        // Chạy build trong thư mục frontend
        dir('frontend') {
          sh 'npm install' // Sử dụng 'npm install' thay cho 'npm ci' nếu chưa dùng package-lock.json (hoặc dùng npm ci nếu muốn đảm bảo tính ổn định)
          sh 'npm run build'
          sh 'ls -la dist || ls -la build || true' // Kiểm tra thư mục output
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          // Backend image (Sử dụng Dockerfile Gradle/Multi-stage)
          // Context là thư mục ./backend
          sh """
            docker build -t ${IMAGE_BACKEND}:${env.BUILD_NUMBER} ./backend
            docker tag ${IMAGE_BACKEND}:${env.BUILD_NUMBER} ${IMAGE_BACKEND}:latest
          """
          // Frontend image (Sử dụng Dockerfile Nginx/Multi-stage)
          // Context là thư mục ./frontend
          sh """
            docker build -t ${IMAGE_FRONTEND}:${env.BUILD_NUMBER} ./frontend
            docker tag ${IMAGE_FRONTEND}:${env.BUILD_NUMBER} ${IMAGE_FRONTEND}:latest
          """
        }
      }
    }

    stage('Docker Login & Push') {
      steps {
        // Sử dụng biến Credentials tự động được Jenkins cung cấp
        sh """
          echo ${DOCKERHUB_CRED_PSW} | docker login -u ${DOCKERHUB_CRED_USR} --password-stdin
          
          echo "Bắt đầu đẩy images..."
          docker push ${IMAGE_BACKEND}:${env.BUILD_NUMBER}
          docker push ${IMAGE_BACKEND}:latest
          docker push ${IMAGE_FRONTEND}:${env.BUILD_NUMBER}
          docker push ${IMAGE_FRONTEND}:latest
          echo "Đã đẩy thành công!"
        """
      }
    }
  }
  
  post {
    always {
      echo 'Thao tác dọn dẹp và Logout Docker'
      sh 'docker logout || true' // Đảm bảo logout kể cả khi push lỗi
    }
    success {
      echo "Pipeline CI/CD thành công. Images đã có trên DockerHub."
    }
    failure {
      echo "Pipeline thất bại! Vui lòng kiểm tra lỗi build/docker."
    }
  }
}