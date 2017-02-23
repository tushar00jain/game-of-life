# Game of Life

## Instructions
  - Run the commands for the development or production version provided below

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
