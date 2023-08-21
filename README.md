## Description

This is an application written in Nestjs, which is a framework for building efficient, scalable Node.js server-side applications. It is built with TypeScript and demos the use of Nestjs with MongoDB via Mongoose ODM and Redis, to build an authentication/authorization system and expose a REST API to Manage different Users and Roles.

## Installation

You only need docker and docker compose installed on your machine to run this application. If you don't have them installed, you can follow the instructions on the links below:

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

## Environment Variables

The application uses environment variables to configure the datastores connections and various other settings. You need to create a `.env` file in the root directory of the project and copy the contents of the `.env.example` file into it. You can then change the values of the variables to suit your needs.

## Running the app

You can run the application with the following command in the root directory of the project:

```bash
$ docker-compose up
```

The application will be available at http://localhost:3000. 
Note that docker-compose overrides some environment variables to run the application within the container, you can find the overrides in the `docker-compose.yml` file under the auth-svc service.

## API Documentation

The API documentation will be available via Swagger at http://localhost:3000/docs

## Database

The application uses MongoDB and Redis as datastores. Theses datastores are automatically created when you run the application for the first time.

The application uses in-memory datastores when running in development/test mode. This means that the datastores are destroyed when the application is stopped.

The application uses a persistent database when running in staging/production mode. This means that the datastores are not destroyed when the application is stopped.

## Seed Data

The application uses seed data to populate mongodb with some initial data. The seed data is automatically loaded when you run the application for the first time.
You can find the seed data in the `src/modules/seed/seed.json` file. You can change the seed data to suit your needs.

## Test

Tests are written with Jest and Supertest. They are automatically run when you build the application docker image. You can also run them manually with the following commands:

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e

$ npm run test:e2e:coverage
```
