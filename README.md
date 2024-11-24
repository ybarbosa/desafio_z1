## Setup
Add environment variables
```bash
cp .env.example .env
```

## Running with docker
Install Yarn and the project dependencies

```bash
docker compose up
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

## Architecture Overview
Entity Relationship Diagram (ERD)
![](https://i.ibb.co/vjCQxSz/estrutura-db.jpg)

Solution
![](https://i.ibb.co/bznFnZ3/fluxo-z1.jpg)
