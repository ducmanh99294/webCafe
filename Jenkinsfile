// Pipeline CI/CD cho Spring Boot (Gradle) và Vite/React (Nginx)

pipeline {
  agent any
  
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
          sh './gradlew build --no-daemon -x test' 
          sh 'ls -la build/libs'
        }
      }
    }

    stage('Build Frontend (Vite)') {
      steps {
        dir('frontend') {
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
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_CRED_USR', passwordVariable: 'DOCKERHUB_CRED_PSW')]) {
          sh """
            # Đăng nhập Docker
            echo ${DOCKERHUB_CRED_PSW} | docker login -u ${DOCKERHUB_CRED_USR} --password-stdin
            
            echo "Bắt đầu đẩy images..."
            docker push ${IMAGE_BACKEND}:${env.BUILD_NUMBER}
            docker push ${IMAGE_BACKEND}:latest
            docker push ${IMAGE_FRONTEND}:${env.BUILD_NUMBER}
            docker push ${IMAGE_FRONTEND}:latest
            echo "Đã đẩy thành công!"
            
            # Logout
            docker logout || true 
          """
        }
      }
    }
    
    stage('Deploy to K8s') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE_PATH')]) {
          sh """
            echo "Bắt đầu triển khai lên Kubernetes..."
            # Lệnh Deploy
            kubectl --kubeconfig=${KUBECONFIG_FILE_PATH} apply -f k8s/
            echo "Đang chờ Deployment ổn định..."

            # Thao tác chờ Deployment hoàn thành ổn định (CD Check)
            kubectl wait --for condition=Available deployment/webcafe-backend --timeout=300s --kubeconfig=${KUBECONFIG_FILE_PATH}
            kubectl wait --for condition=Available deployment/webcafe-frontend --timeout=300s --kubeconfig=${KUBECONFIG_FILE_PATH}
            echo "Triển khai CD hoàn tất!"
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
      echo "Pipeline CI/CD hoàn tất! Ứng dụng đã được triển khai lên Kubernetes."
    }
    failure {
      echo "Pipeline thất bại! Vui lòng kiểm tra lỗi build/docker/kubectl."
    }
  }
}