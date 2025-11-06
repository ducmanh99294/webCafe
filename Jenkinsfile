// --- THÔNG SỐ CẦN SỬA ---
def acrName = "mywebappregistry123"
def acrLoginServer = "${acrName}.azurecr.io"
def githubRepoUrl = "https://github.com/ducmanh99294/webCafe.git"

def frontendAppName = "webcafe-frontend"
def frontendDeploymentName = "webcafe-frontend-deployment"

def backendAppName = "webcafe-backend"
def backendDeploymentName = "webcafe-backend-deployment"
// -------------------------

pipeline {
  agent {
    kubernetes {
      label 'jenkins-agent'
      defaultContainer 'tools'
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: tools
    image: mcr.microsoft.com/azure-cli
    command:
    - sleep
    args:
    - "999999"
    tty: true
"""
    }
  }

  stages {
    stage("1. Checkout Code") {
      steps {
        git credentialsId: 'github-credentials', url: githubRepoUrl, branch: 'main'
      }
    }

    stage("2. Build & Push to ACR (Không dùng Docker)") {
      steps {
        container('tools') {
          sh "az login --identity"
          sh """
          az acr build \
            --registry ${acrName} \
            --image ${frontendAppName}:${env.BUILD_NUMBER} \
            frontend/
          """
          sh """
          az acr build \
            --registry ${acrName} \
            --image ${backendAppName}:${env.BUILD_NUMBER} \
            backend/
          """
        }
      }
    }

    stage("3. Deploy to Kubernetes") {
      steps {
        container('tools') {
          sh "az login --identity"
          sh "az aks get-credentials --resource-group aks-production-group --name my-aks-cluster --overwrite-existing"

          sh "kubectl set image deployment/${frontendDeploymentName} ${frontendAppName}=${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER}"
          sh "kubectl set image deployment/${backendDeploymentName} ${backendAppName}=${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER}"
        }
      }
    }
  }
}
