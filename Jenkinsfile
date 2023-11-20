pipeline {
    agent any

    tools { 
        nodejs 'my-nodejs' 
    }
    environment {
        POSTGRES_ROOT_LOGIN = credentials('postgres')
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }
    stages {

        stage('Build with Nodejs') {
            steps {
                sh 'node --version'
            }
        }

        stage('Packaging/Pushing images') {
           steps {
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh 'docker build -t nammtrong023/api-airbnb .'
                    sh 'docker push nammtrong023/api-airbnb'
                }
            }
        }

        stage('Deploy Postgres to DEV') {
            steps {
                echo 'Deploying and cleaning'
                sh 'docker image pull postgres:14.10'
                sh 'docker network create dev || echo "this network exists"'
                sh 'docker container stop namtrong-postgres || echo "this container does not exist" '
                sh 'echo y | docker container prune'
                sh 'docker volume rm postgres-data || echo "no volume"'

                sh "docker run --name namtrong-postgres --rm -v postgres-data:/var/lib/postgres -e POSTGRES_USER=${POSTGRES_ROOT_LOGIN} -e POSTGRES_PASSWORD=${POSTGRES_ROOT_LOGIN_PSW} -e POSTGRES_DATABASE=airbnb -p 5432:5432 -d postgres:14.10"
                sh 'sleep 20'
                sh "docker exec -i namtrong-postgres postgres --user=root --password=${POSTGRES_ROOT_LOGIN_PSW} < script"
            }
        }

        stage('Deploy App to DEV') {
            steps {
                echo 'Deploying and cleaning'
                sh 'docker image pull nammtrong023/api-airbnb'
                sh 'docker container stop nammtrong023/api-airbnb || echo "this container does not exist" '
                sh 'docker network create dev || echo "this network exists"'
                sh 'echo y | docker container prune '

                sh 'docker container run -d --rm --name nammtrong023/api-airbnb -p 8080:8080 nammtrong023/api-airbnb'
            }
        }
 
    }
    post {
        // Clean after build
        always {
            cleanWs()
        }
    }
}
