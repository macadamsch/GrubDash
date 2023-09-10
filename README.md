# GrubDash

## Overview

GrubDash is a backend development project designed to create an API that allows customers to browse available dishes, add items to their cart, and complete the checkout process. As a backend project, the goal is to set up the API and build specific routes to support these essential customer interactions.

## Technologies & Tools

The GrubDash project utilizes the following technologies and tools:
- Node.js
- Express.js
- Knex.js
- PostgreSQL

## API Paths

The GrubDash backend provides the following API endpoints:
- `GET /dishes`: Retrieves a list of dishes.
- `GET /dishes/:dishId`: Retrieves details of a specific dish by its ID.
- `POST /dishes`: Creates a new dish entry.
- `PUT /dishes/:dishId`: Updates details of a specific dish by its ID.
- `GET /orders`: Retrieves a list of orders.
- `GET /orders/:orderId`: Retrieves details of a specific order by its ID.
- `POST /orders`: Creates a new order entry.
- `PUT /orders/:orderId`: Updates details of a specific order by its ID.

## Run Locally

To run this project locally, follow these steps:
1. Clone the repository: `git clone https://github.com/macadamsch/grubdash.git`
2. Navigate to the project directory: `cd grubdash`
3. Install dependencies: `npm install` or `yarn install` if you're using Yarn.
4. Configure your database connection in the `knexfile.js` file.
5. Run migrations to set up the database: `npm run knex migrate:latest` or `yarn knex migrate:latest`.
6. Run seed scripts to populate the database: `npm run knex seed:run` or `yarn knex seed:run`.
7. Start the server: `npm start` or `yarn start`.
