// --- CONFIG ---
def acrName = "mywebappregistry123"
def acrLoginServer = "${acrName}.azurecr.io"
def githubRepoUrl = "https://github.com/ducmanh99294/webCafe.git"

def frontendAppName = "webcafe-frontend"
def frontendDeploymentName = "webcafe-frontend-deployment"

def backendAppName = "webcafe-backend"
def backendDeploymentName = "webcafe-backend-deployment"
// ---------------

pipeline {
  agent {
    kubernetes {
      label "jenkins-agent"
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: dind
    image: docker:24.0-dind
    securityContext:
      privileged: true
    command: [ "dockerd-entrypoint.sh" ]
    args: [ "--host=tcp://0.0.0.0:2375" ]
    ports:
      - name: dockerd
        containerPort: 2375
    volumeMounts:
      - mountPath: /var/lib/docker
        name: docker-graph-storage

  - name: tools
    image: mcr.microsoft.com/azure-cli
    command: ["sleep"]
    args: ["9999"]

  volumes:
    - name: docker-graph-storage
      emptyDir: {}
"""
    }
  }

  stages {

    stage("1. Checkout Code") {
      steps {
        container('tools') {
          git credentialsId: 'github-credentials', url: githubRepoUrl, branch: 'main'
        }
      }
    }

    stage('2. Build & Push Images (Dùng Docker Build)') {
        steps {
            container('dind') { // ✅ PHẢI DÙNG DIND
                sh 'az login --identity'
                sh "az acr login --name ${acrName}"

                // Build & push frontend
                sh "docker build -t ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER} ./frontend"
                sh "docker push ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER}"

                // Build & push backend
                sh "docker build -t ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER} ./backend"
                sh "docker push ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER}"
            }
        }
    }


    stage("3. Deploy to AKS") {
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
