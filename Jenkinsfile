def acrName = "mywebappregistry123"
def acrLoginServer = "mywebappregistry123.azurecr.io"
def githubRepoUrl = "https://github.com/ducmanh99294/webCafe.git"

def frontendAppName = "webcafe-frontend"
def backendAppName = "webcafe-backend"

pipeline {
  agent {
    kubernetes {
      label 'jenkins-agent'
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: docker
      image: docker:24.0
      securityContext:
        privileged: true
      command: ['cat']
      tty: true
      volumeMounts:
        - name: docker-sock
          mountPath: /var/run/docker.sock

    - name: tools
      image: mcr.microsoft.com/azure-cli
      command: ['cat']
      tty: true

    - name: jnlp
      image: jenkins/inbound-agent:latest
  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
"""
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

    stage('2. Build & Push Images') {
      parallel {

        stage('Frontend') {
          steps {
            container('tools') {
              sh 'az login --identity'
              sh "az acr login --name ${acrName}"
            }

            container('docker') {
              sh """
docker login ${acrLoginServer} \
  -u 00000000-0000-0000-0000-000000000000 \
  -p \$(az acr login --name ${acrName} --expose-token --query refreshToken -o tsv)

docker build -t ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER} ./frontend
docker push ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER}
"""
            }
          }
        }

        stage('Backend') {
          steps {
            container('tools') {
              sh 'az login --identity'
              sh "az acr login --name ${acrName}"
            }

            container('docker') {
              sh """
docker login ${acrLoginServer} \
  -u 00000000-0000-0000-0000-000000000000 \
  -p \$(az acr login --name ${acrName} --expose-token --query refreshToken -o tsv)

docker build -t ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER} ./backend
docker push ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER}
"""
            }
          }
        }

      }
    }

    stage('3. Deploy to Kubernetes') {
      steps {
        container('tools') {
          sh 'az login --identity'
          sh 'az aks get-credentials --resource-group aks-production-group --name my-aks-cluster --overwrite-existing'

          sh "kubectl set image deployment/${frontendAppName}-deployment ${frontendAppName}=${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER}"
          sh "kubectl set image deployment/${backendAppName}-deployment ${backendAppName}=${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER}"
        }
      }
    }
  }
}
