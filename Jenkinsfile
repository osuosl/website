pipeline {
  agent { label 'web2' }
  environment {
    GITHUB_TOKEN = credentials('site_pr_builder')
    STAGING_PATH = "/var/www/staging.osuosl.org/htdocs"
    PRODUCTION_PATH = "/var/www/new.osuosl.org/htdocs"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build Hugo Site') {
      steps {
        script {
          sh 'hugo --gc --minify'     // Build the Hugo site for all branches
          sh 'pagefind --site public' // Build pagefind index
        }
      }
    }
    stage('Deploy Site') {
      steps {
        script {
          if (env.BRANCH_NAME == 'main') {
            // Deploy to production when the branch is 'main'
            sh """
            rsync -avH --delete public/ ${PRODUCTION_PATH}/
            """
          } else if (env.CHANGE_ID) {
            // Deploy to a staging directory based on the PR number
            def stagingPath = "${STAGING_PATH}/osuosl-website-${env.CHANGE_ID}"
            sh """
            rm -rf ${PRODUCTION_PATH}/css/*
            rsync -avH ${stagingPath}/
            """
          } else {
            echo "Not a PR or main branch, skipping deployment"
          }
        }
      }
    }
  }
  post {
    always {
      script {
        def siteUrl = ""
        if (env.BRANCH_NAME == 'main') {
          siteUrl = "https://new.osuosl.org/"

          slackSend channel: "#alerts",
                    color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
                    message: "osuosl/website - #${env.BUILD_ID} finished with status ${currentBuild.result} (<${env.BUILD_URL}|Open>)"
        } else if (env.CHANGE_ID) {
          siteUrl = "https://osuosl-website-${env.CHANGE_ID}.staging.osuosl.org/"
        }

        // Post build status with a link to the site
        githubNotify context: 'Published site URL',
                     description: 'Build completed',
                     status: currentBuild.result,
                     targetUrl: "${siteUrl}",
                     message: "Site available: ${siteUrl}"
      }
    }
  }
}
