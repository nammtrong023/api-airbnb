pipeline {

    agent any

    tools { 
        nodejs 'my-nodejs' 
    }
    environment {
        POSTGRES_ROOT_LOGIN = credentials('my-postgres')
        DOCKER = credentials('dockerhub')
    }
    stages {

        stage('Build with Nodejs') {
            steps {
                sh 'node --version'
                // sh 'java -version'
                // sh 'node clean package -Dmaven.test.failure.ignore=true'
            }
        }

        stage('Packaging/Pushing images') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'dockerhub') {
                        echo 'login'
                        sh 'docker build -t nammtrong023/nestjs .'
                        echo 'build'
                        sh 'docker push nammtrong023/nestjs'
                        echo 'push'
                    }
                }
            }
        }

        stage('Deploy Postgres to DEV') {
            steps {
                echo 'Deploying and cleaning'
                sh 'docker image pull postgres'
                sh 'docker network create dev || echo "this network exists"'
                sh 'docker container stop namtrong-postgres || echo "this container does not exist" '
                sh 'echo y | docker container prune'
                sh 'docker volume rm namtrong-postgres-data || echo "no volume"'

                sh "docker run --name namtrong-postgres --rm --network dev -v namtrong-postgres-data:/var/lib/postgres -e POSTGRES_ROOT_PASSWORD=${POSTGRES_ROOT_LOGIN_PSW} -e POSTGRES_DATABASE=db_example -p 5432:5432 -d postgres"
                sh 'sleep 20'
                sh "docker exec -i namtrong-postgres postgres --user=root --password=${POSTGRES_ROOT_LOGIN_PSW} < script"
            }
        }

        stage('Deploy NestJS to DEV') {
            steps {
                echo 'Deploying and cleaning'
                sh 'docker image pull nestjs/cli'
                sh 'docker container stop namtrong-nestjs || echo "this container does not exist" '
                sh 'docker network create dev || echo "this network exists"'
                sh 'echo y | docker container prune '

                sh 'docker container run -d --rm --name nammtrong-nestjs -p 8080:8080 --network dev nammtrong-nestjs'
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