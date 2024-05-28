pipeline {
    agent any

    environment {
        APP_DIR = '/var/www/jenkprojects'
        DOMAIN = 'jenkinslive.com'
        PORT = '6060'
    }

    stages {
        // stage('Checkout') {
        //     steps {
        //         // Checkout the source code from the repository
        //         checkout scm
        //     }
        // }

        stage('Install Dependencies') {
            steps {
                // Install project dependencies
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                // Build the Next.js project
                sh 'npm run build'
            }
        }

        stage('Export') {
            steps {
                // Export the Next.js project
                sh 'npm run export'
            }
        }

        stage('Deploy') {
            steps {
                // Copy the build files to the deployment directory
                sh '''
                    sudo rm -rf $APP_DIR/*
                    sudo cp -r out/* $APP_DIR/
                '''
            }
        }

        stage('Configure Nginx') {
            steps {
                // Configure Nginx to serve the project
                sh '''
                    sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
                    server {
                        listen 80;
                        server_name $DOMAIN;

                        location / {
                            root $APP_DIR;
                            try_files \$uri /index.html;
                        }

                        location /_next/ {
                            root $APP_DIR;
                            try_files \$uri /index.html;
                        }
                    }
                    EOF

                    sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
                    sudo nginx -t
                    sudo systemctl restart nginx
                '''
            }
        }

        stage('Serve') {
            steps {
                // Start the Next.js server
                sh '''
                    sudo lsof -ti :$PORT | xargs sudo kill -9 || true
                    sudo nohup npx serve -s $APP_DIR -l $PORT > /dev/null 2>&1 &
                '''
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            // Notify success
            echo 'Deployment successful!'
        }
        failure {
            // Notify failure
            echo 'Deployment failed!'
        }
    }
}


