# Game of Life
This is a multiplayer implementation of the Game of Life. This application uses ```React.js``` on the client and ```Node.js``` along with ```Socket.io``` on the back end to communicate the game state to the clients.

## Instructions
  - Run the commands for the development or production version provided below
  - Open your favourite browser at ```http://localhost:3000```

## Production
```
docker-compose up -d app
docker logs -f --tail=100 app
```

## Development
```
docker-compose -f docker-compose-dev.yml run --service-ports app
```
Inside the container run:
```
npm run start
```
