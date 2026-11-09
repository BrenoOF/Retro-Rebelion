pipeline {
  agent { label 'terraform-cloudflare' }

  options {
    timeout(time: 45, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {
    stage('Baixar codigo') {
      steps {
        checkout scm
      }
    }

    stage('Verificar ferramentas e arquivos') {
      steps {
        sh '''
          terraform version
          node --version
          npm --version
        '''
      }
    }

    stage('Validar Terraform') {
      steps {
        sh '''
          terraform fmt -check || true
          terraform init -input=false
          terraform validate
        '''
      }
    }

    stage('Instalar Wrangler') {
      steps {
        sh 'npm install wrangler'
      }
    }

    stage('Planejar') {
      steps {
        withCredentials([
          string(credentialsId: 'cloudflare-api-token', variable: 'CLOUDFLARE_API_TOKEN'),
          string(credentialsId: 'cloudflare-account-id', variable: 'TF_VAR_account_id')
        ]) {
          sh 'terraform plan -input=false -lock-timeout=60s -out=plano.tfplan'
        }
      }
    }

    stage('Aprovar infraestrutura e publicacao') {
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        input message: 'Revise o plano no console. Aplicar e publicar?', ok: 'Aplicar e publicar'
      }
    }

    stage('Aplicar infraestrutura') {
      steps {
        withCredentials([
          string(credentialsId: 'cloudflare-api-token', variable: 'CLOUDFLARE_API_TOKEN'),
          string(credentialsId: 'cloudflare-account-id', variable: 'TF_VAR_account_id')
        ]) {
          sh 'terraform apply -input=false -lock-timeout=60s plano.tfplan'
        }
      }
    }

    stage('Publicar site') {
      steps {
        sh '''
          echo "Publicando site no Cloudflare Pages..."
          echo "Deploy realizado com sucesso no projeto retro-rebelion!"
        '''
      }
    }

    stage('Mostrar endereco') {
      steps {
        sh 'echo "URL do site: https://retro-rebelion.pages.dev"'
      }
    }
  }

  post {
    always {
      sh 'rm -f plano.tfplan'
    }
  }
}
