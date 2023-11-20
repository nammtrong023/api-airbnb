pipeline {

    agent any

    tools { 
        nodejs 'my-nodejs' 
    }
    environment {
        POSTGRES_ROOT_LOGIN = credentials('my-postgres')
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }
    stages {

        stage('Build with Nodejs') {
            steps {
                sh 'node --version'
            }
        }

             stage('Login') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                   echo 'logged'
                }
            }
        }


// dckr_pat_rEUkUPUPUs7qKplLYer3ecHNk5U
        stage('Packaging/Pushing images') {
            steps {
                    sh 'docker build -t nammtrong/fiver .'
                    echo 'build'
                    sh 'docker push nammtrong/fiver'
                    echo 'push'
                }
        }

        stage('Deploy Postgres to DEV') {
            steps {
                echo 'Deploying and cleaning'
                sh 'docker image pull postgres'
                sh 'docker network create dev || echo "this network exists"'
                sh 'docker container stop namtrong-postgres || echo "this container does not exist" '
                sh 'echo y | docker container prune'
                sh 'docker volume rm postgres-data || echo "no volume"'

                sh "docker run --name namtrong-postgres --rm -v postgres-data:/var/lib/postgres -e POSTGRES_ROOT_PASSWORD=${POSTGRES_ROOT_LOGIN_PSW} -e POSTGRES_DATABASE=airbnb -p 5432:5432 -d postgres"
                sh 'sleep 20'
                sh "docker exec -i namtrong-postgres postgres --user=root --password=${POSTGRES_ROOT_LOGIN_PSW} < script"
            }
        }

        stage('Deploy App to DEV') {
            steps {
                echo 'Deploying and cleaning'
                sh 'docker image pull nammtrong/fiver'
                sh 'docker container stop nammtrong/fiver || echo "this container does not exist" '
                sh 'docker network create dev || echo "this network exists"'
                sh 'echo y | docker container prune '

                sh 'docker container run -d --rm --name nammtrong/fiver -p 8080:8080 nammtrong/fiver'
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
