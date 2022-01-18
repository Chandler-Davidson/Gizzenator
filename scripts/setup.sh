apt-get update
apt-get git nodejs npm docker docker-compose 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 16.13.2
nvm use 16.13.2
git clone https://github.com/chandler-davidson/gizzenator
cd gizzenator
touch discord-bot/config/default.json
touch lyrics-service/config/default.json
touch lyrics-service/.env
docker-compose up -d