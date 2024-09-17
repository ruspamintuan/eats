# Brighte Eats

Brighte Eats is a system developed to accept expressions of interest for a product, where users can register/view interest of customers in services like delivery, pick-up, and payment.

## Overview

Brighte Eats is an API built with Node.js, GraphQL, Express, and SQLite3 as database.

It has two queries: `leads` and `lead`, and one mutation: `register`.

## Setting Up

### Prerequisite

- Node.js
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ruspamintuan/eats.git
   cd eats
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## Start the Server

To start the server, run:

```bash
npm start
# or
yarn start
```

### Default Data

After starting the server for the first time, a customer named John Doe will be inserted into the database by default. This can be verified by running `leads` query.

## Testing It Out

Once server is started, it will be available at `http://localhost:4000/graphql`.

GraphiQL is enabled so you can perform queries and mutations available in the API.

### Sample Queries

View All Leads:

```bash
query {
  leads {
    id
    name
    email
    mobile
    postcode
    services
  }
}
```

View Lead with an id of 1:

```bash
query {
  lead(id: 1) {
    id
    name
    email
    mobile
    postcode
    services
  }
}
```

Registed a lead:

```bash
mutation {
  register(name: "John Smith", email: "john.smith@example.com", mobile: "123456789", postcode: "12345", services: "delivery") {
    id
    name
    email
    mobile
    postcode
    services
  }
}
```

## Unit Tests

This project uses `Mocha` for test framework, `Sinon` for test spies and mocks, and `nyc` for code coverage.

### Run Test

To run unit tests, use:

```bash
npm test
# or
yarn build
```

## Build

To build this project for production, use the following command:

```bash
npm run build
# or
yarn build
```

---

### Notes:

- **Usage**:
  - Provides basic commands to start the server and interact with it via GraphQL.
  - For the register mutation, you can provide multiple values for the `services` field. Just make sure they are separated by a comma(,).
    - Example: `"delivery,payment"`
- **Setup Instructions**:
  - Ensure that the file `mydb.sqlite` is in the root folder of the project. If deleted, please re-create the file with the same name. As mentioned
    [`above`](#default-data), a default customer data will be inserted.
- **Database Schema**:
  - All columns are of string type, except for the primary key `id`.
  - The `email` column in table must be unique. If you try to insert a duplicate email, it will result in an error.
  - The `services` field is stored as stringified JSON array, since SQLite3 does not support native list or array type.

---

Feel free to reach out if you have any questions or need further assistance with the Brighte Eats project.
