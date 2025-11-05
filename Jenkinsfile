// File: Jenkinsfile (Phiên bản DIND + PRIVILEGED - CHÍNH XÁC)

// --- ⬇️ (1) SỬA LẠI CHỖ NÀY ⬇️ ---
def acrName = "mywebappregistry123" // Tên ACR bạn đã tạo
def acrLoginServer = "mywebappregistry123.azurecr.io" // Sửa nếu tên khác
def githubRepoUrl = "https://github.com/ducmanh99294/webCafe.git" // SỬA LẠI ĐÚNG LINK GIT

// Tên cho ứng dụng frontend
def frontendAppName = "webcafe-frontend"
def frontendDeploymentName = "webcafe-frontend-deployment" 

// Tên cho ứng dụng backend
def backendAppName = "webcafe-backend"
def backendDeploymentName = "webcafe-backend-deployment" 
// --- ⬆️ (1) SỬA LẠI CHỖ NÀY ⬆️ ---

pipeline {
    agent {
        // CHÚNG TA CẦN CẢ 'dind' và 'tools'
        kubernetes {
            label 'jenkins-agent'
            // Cung cấp công cụ Docker (dind = Docker-in-Docker)
            containerTemplate {
                name 'dind'
                image 'docker:dind'
                command 'sleep'
                args '99d'
                ttyEnabled true
                privileged true // Yêu cầu quyền đặc quyền
            }
            // Cung cấp công cụ kubectl và az cli
            containerTemplate {
                name 'tools'
                image 'mcr.microsoft.com/azure-cli'
                command 'sleep'
                args '99d'
                ttyEnabled true
            }
        }
    }
    
    stages {
        stage('1. Checkout Code') {
            steps {
                container('tools') {
                    git credentialsId: 'github-credentials', url: githubRepoUrl, branch: 'main'
                }
            }
        }
        
        stage('2. Build & Push Images (Dùng Docker Build)') {
            steps {
                parallel(
                    "Build Frontend": {
                        container('dind') { // DÙNG CONTAINER DIND
                            sh 'az login --identity'
                            sh "az acr login --name ${acrName}"
                            
                            // Build image frontend
                            sh "docker build -t ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER} ./frontend"
                            sh "docker push ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER}"
                        }
                    },
                    "Build Backend": {
                        container('dind') { // DÙNG CONTAINER DIND
                            sh 'az login --identity'
                            sh "az acr login --name ${acrName}"
                            
                            // Build image backend
                            sh "docker build -t ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER} ./backend"
                            sh "docker push ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER}"
                        }
                    }
                )
            }
        }

        stage('3. Deploy to Kubernetes') {
            steps {
                container('tools') {
                    sh 'az login --identity'
                    sh 'az aks get-credentials --resource-group aks-production-group --name my-aks-cluster --overwrite-existing'
                    
                    // Cập nhật image cho Frontend
                    sh "kubectl set image deployment/${frontendDeploymentName} ${frontendAppName}=${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER}"
                    
                    // Cập nhật image cho Backend
                    sh "kubectl set image deployment/${backendDeploymentName} ${backendAppName}=${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER}"
                }
            }
        }
    }
}