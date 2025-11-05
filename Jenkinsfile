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
      args: ['\$(JENKINS_SECRET)', '\$(JENKINS_NAME)']
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
            // Login ACR trong tools (chỉ lấy token)
            container('tools') {
            sh 'az login --identity'
            sh "TOKEN=$(az acr login --name ${acrName} --expose-token --output tsv --query accessToken) && echo $TOKEN > /home/jenkins/agent/acr_token"
            }

            // Build + push trong docker container
            container('docker') {
            sh "docker login ${acrLoginServer} -u 00000000-0000-0000-0000-000000000000 -p $(cat /home/jenkins/agent/acr_token)"
            sh "docker build -t ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER} ./frontend"
            sh "docker push ${acrLoginServer}/${frontendAppName}:${env.BUILD_NUMBER}"
            }
        }
        }

        stage('Backend') {
        steps {
            container('tools') {
            sh 'az login --identity'
            sh "TOKEN=$(az acr login --name ${acrName} --expose-token --output tsv --query accessToken) && echo $TOKEN > /home/jenkins/agent/acr_token"
            }

            container('docker') {
            sh "docker login ${acrLoginServer} -u 00000000-0000-0000-0000-000000000000 -p $(cat /home/jenkins/agent/acr_token)"
            sh "docker build -t ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER} ./backend"
            sh "docker push ${acrLoginServer}/${backendAppName}:${env.BUILD_NUMBER}"
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
