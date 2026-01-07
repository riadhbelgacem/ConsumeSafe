pipeline {
  agent any
  
  tools {
    nodejs 'NodeJS-20'
  }
  
  environment {
    BUILD_TAG = "${env.GIT_COMMIT?.substring(0,8) ?: 'manual'}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { 
        sh 'npm install'
      }
    }

    stage('Lint') {
      steps { sh 'npm run lint' }
    }

    stage('Test') {
      steps { sh 'npm test -- --watch=false' }
    }

    stage('SonarQube') {
      steps {
        withSonarQubeEnv('sonarqube') {
          sh 'sonar-scanner -Dsonar.projectKey=boycott-app'
        }
      }
    }

    stage('Wait Sonar QG') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Dependency Security') {
      steps {
        sh 'npm audit --audit-level=high || (echo "npm audit failed" && exit 1)'
      }
    }

    stage('Build (artifact)') {
      steps {
        sh 'npm run build'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Invoke Ansible Release') {
      steps {
        withCredentials([
          string(credentialsId: 'VAULT_TOKEN', variable: 'VAULT_TOKEN'),        // or obtain token dynamically
          usernamePassword(credentialsId: 'DOCKER_REGISTRY_CRED', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
          file(credentialsId: 'KUBECONFIG_FILE', variable: 'KUBECONFIG')
        ]) {
          sh '''
            export BUILD_TAG=${BUILD_TAG}
            export VAULT_ADDR=https://vault.example.com
            export VAULT_TOKEN=${VAULT_TOKEN}
            export DOCKER_USER=${DOCKER_USER}
            export DOCKER_PASS=${DOCKER_PASS}
            ansible-playbook -i localhost, playbooks/deploy.yml --extra-vars "image_tag=${BUILD_TAG}"
          '''
        }
      }
    }
  }
}

