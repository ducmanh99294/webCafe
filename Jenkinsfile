// File: Jenkinsfile (Phiên bản cho Frontend/Backend)

def acrName = "mywebappregistry123" 
def acrLoginServer = "mywebappregistry123.azurecr.io" 
def githubRepoUrl = "https://github.com/ducmanh99294/webCafe"

// Tên cho ứng dụng frontend
def frontendAppName = "webcafe-frontend"
def frontendDeploymentName = "webcafe-frontend-deployment" // Tên K8s deployment cho frontend

// Tên cho ứng dụng backend
def backendAppName = "webcafe-backend"
def backendDeploymentName = "webcafe-backend-deployment" // Tên K8s deployment cho backend

pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent'
            containerTemplate {
                name 'dind'
                image 'docker:dind'
                command 'sleep'
                args '99d'
                ttyEnabled true
                privileged true
            }
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
                git credentialsId: 'github-credentials', url: githubRepoUrl, branch: 'main'
            }
        }
        
        stage('2. Build & Push Images') {
            steps {
                // Chạy song song cả hai build
                parallel(
                    "Build Frontend": {
                        container('dind') {
                            sh 'az login --identity'
                            sh "az acr login --name ${acrName}"
                            
                            // Build image frontend (chỉ định thư mục frontend)
                            sh "docker build -t ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER} ./frontend"
                            sh "docker push ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER}"
                        }
                    },
                    "Build Backend": {
                        container('dind') {
                            sh 'az login --identity'
                            sh "az acr login --name ${acrName}"
                            
                            // Build image backend (chỉ định thư mục backend)
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