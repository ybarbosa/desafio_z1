## Setup
Add environment variables
```bash
cp .env.example .env
```

## Running with docker
Install Yarn and the project dependencies

```bash
docker compose up app -d
```

## Running without docker
Install Yarn and the project dependencies

```bash
npm install -g yarn
yarn install
yarn npx prisma generate
```
#### Obs
Ensure that redis and postgres host settings are configured to point to localhost.


## Migrations and seed
Running migrations and seed
#### Without docker
Run command
```bash
yarn prisma:start
```

#### With docker
Run command:
```bash
docker-compose exec -d app yarn prisma:start
```

#### Obs
Only */login* endpoint is open. To facilitate the use of the project, a default user is created. It is recommended to use it, or feel free to create another user via SQL.
User default:
![](https://i.ibb.co/PG1fvSY/Captura-de-tela-2024-11-24-152541.png)

## Architecture Overview
###### Entity Relationship Diagram
![](https://i.ibb.co/xhdMPp4/entity-relationship-diagram.png)

###### Solution
![](https://i.ibb.co/ZXDVKTg/diagram-solution.jpg)

## Endpoints
In root of the project, there is a JSON file with the Postman collection, in case you want to call the endpoints.
*./collection_postman.json*