#!/bin/sh
redoc-cli bundle openapi.yaml 
mv redoc-static.html index.html

ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'cd /home/ubuntu'


scp -i "~/20220502.pem" index.html ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com:/home/ubuntu/index.html
# ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo docker stop $(docker ps -a -q)'
# ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo docker rm $(docker ps -a -q)'
# ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo docker rm rupin/factory-api:latest'
# ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo docker rm -f factory-api:1.1.1'
ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo docker build -t rupin/factory-api:1.1.1'
ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo docker run -d --name web -p 8080:80 rupin/factory-api:1.1.1'
ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo docker rm $(docker ps -a -q -f status=exited)'

# #!/bin/sh 아파치로 바로실행

# redoc-cli build openapi.yaml

# rm -rf index.html

# mv redoc-static.html index.html

# ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo apt-get update && \
#  sudo apt-get -y install apache2'

# scp -i "~/20220502.pem" index.html ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com:~

# ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo rm /var/www/html/index.html'

# ssh -i "~/20220502.pem" ubuntu@ec2-13-209-80-189.ap-northeast-2.compute.amazonaws.com 'sudo mv /home/ubuntu/index.html /var/www/html'