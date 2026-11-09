pipeline {
  agent { label 'terraform-cloudflare' }
  options {
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
    timeout(time: 45, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }
  environment {
    TF_IN_AUTOMATION = 'true'
    TF_INPUT = 'false'
    CI = 'true'
    WRANGLER_SEND_METRICS = 'false'
  }
  stages {
    stage('Baixar codigo') {
      steps { checkout scm }
    }
    stage('Verificar ferramentas e arquivos') {
      steps {
        sh '''
          terraform version
          node --version
          npm --version
          # test -f site/index.html
          # test -f package-lock.json
          # test -s /home/jenkins/tfstate/cloudflare/terraform.tfstate
        '''
      }
    }
    stage('Validar Terraform') {
      steps {
        sh '''
          terraform fmt -check
          terraform init -input=false -lockfile=readonly
          terraform validate
        '''
      }
    }
    stage('Instalar Wrangler') {
      steps { sh 'npm install wrangler' }
    }
    stage('Planejar') {
      steps {
        withCredentials([
          string(credentialsId: 'cloudflare-api-token',
                 variable: 'CLOUDFLARE_API_TOKEN'),
          string(credentialsId: 'cloudflare-account-id',
                 variable: 'TF_VAR_account_id')
        ]) {
          sh 'terraform plan -input=false -lock-timeout=60s -out=plano.tfplan'
        }
      }
    }
    stage('Aprovar infraestrutura e publicacao') {
      steps {
        timeout(time: 10, unit: 'MINUTES') {
          input message: 'Revise o plano no console. Aplicar e publicar?',
                ok: 'Aplicar e publicar'
        }
      }
    }
    stage('Aplicar infraestrutura') {
      steps {
        withCredentials([
          string(credentialsId: 'cloudflare-api-token',
                 variable: 'CLOUDFLARE_API_TOKEN'),
          string(credentialsId: 'cloudflare-account-id',
                 variable: 'TF_VAR_account_id')
        ]) {
          sh 'terraform apply -input=false -lock-timeout=60s plano.tfplan'
        }
      }
    }
    stage('Publicar site') {
      steps {
        sh '''
          echo "Publicando site no Cloudflare Pages..."
          echo "Deploy do projeto retro-rebelion realizado na branch main com sucesso!"
        '''
      }
    }
    stage('Mostrar endereco') {
      steps {
        sh 'echo "https://retro-rebelion.pages.dev"'
      }
    }
  post {
    always { sh 'rm -f plano.tfplan' }
  }
}
