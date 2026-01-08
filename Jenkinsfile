pipeline {
  agent any
  
  tools {
    nodejs 'NodeJS-20'
  }
  
  environment {
    BUILD_TAG = "${env.GIT_COMMIT?.substring(0,8) ?: 'manual'}"
    SCANNER_HOME = tool 'MySonarQubeScanner'
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
      steps { sh 'npm test -- --watch=false --browsers=ChromeHeadlessCI' }
    }

    stage('SonarQube') {
      steps {
        withSonarQubeEnv('MySonarQubeServer') {
          sh '${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=boycott-app'
        }
      }
    }

    // stage('Wait Sonar QG') {
    //   steps {
    //     timeout(time: 5, unit: 'MINUTES') {
    //       waitForQualityGate abortPipeline: true
    //     }
    //   }
    // }

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
          string(credentialsId: 'ansible-vault-password', variable: 'VAULT_PASS'),
          file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')
        ]) {
          sh '''
            export BUILD_TAG=${BUILD_TAG}
            export KUBECONFIG=${KUBECONFIG}
            
            # Install Ansible collections
            ansible-galaxy collection install -r playbooks/requirements.yml
            
            # Run deployment playbook
            echo "$VAULT_PASS" | ansible-playbook -i localhost, playbooks/deploy.yml --vault-password-file /dev/stdin --extra-vars "image_tag=${BUILD_TAG}"
          '''
        }
      }
    }
  }
}

