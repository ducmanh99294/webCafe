def acrName = "mywebappregistry123" 
def acrLoginServer = "mywebappregistry123.azurecr.io" 
def githubRepoUrl = "https://github.com/ducmanh99294/webCafe"

// Tên cho ứng dụng frontend
def frontendAppName = "webcafe-frontend"
def frontendDeploymentName = "webcafe-frontend-deployment" 

// Tên cho ứng dụng backend
def backendAppName = "webcafe-backend"
def backendDeploymentName = "webcafe-backend-deployment" 

pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent'
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
        
        stage('2. Build & Push Images (Dùng ACR Build)') {
            steps {
                // Chạy song song cả hai build
                parallel(
                    "Build Frontend": {
                        container('tools') {
                            sh 'az login --identity'
                            
                            // Yêu cầu ACR tự build từ thư mục 'frontend'
                            sh """
                            az acr build \\
                              --registry ${acrName} \\
                              --image ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER} \\
                              --context . \\
                              --file ./frontend/Dockerfile
                            """
                        }
                    },
                    "Build Backend": {
                        container('tools') {
                            sh 'az login --identity'
                            
                            // Yêu cầu ACR tự build từ thư mục 'backend'
                            sh """
                            az acr build \\
                              --registry ${acrName} \\
                              --image ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER} \\
                              --context . \\
                              --file ./backend/Dockerfile
                            """
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