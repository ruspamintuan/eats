import request from "supertest";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "../src/schema"; // Adjust the path to your schema
import { initializeDb } from "../src/initializeDb"; // Adjust the path to initializeDb
import { expect } from "chai";
import { randomBytes } from "crypto";

describe("GraphQL API Tests", () => {
  let app: express.Application;

  before(() => {
    // Initialize the database before tests start
    initializeDb();

    // Create a new Express app for testing
    app = express();

    app.use(
      "/graphql",
      graphqlHTTP({
        schema: schema,
        graphiql: false,
      })
    );
  });

  // Check leads query
  describe("Check leads query", () => {
    it("Check Return Value with no variable", async () => {
      const query = `
          query {
            leads {
              id
              name
              email
              mobile
            }
          }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.leads).to.be.an("array");
    });
    it("Check Return Value with all variable", async () => {
      const query = `
          {
            leads(name:"any", email: "email", mobile: "mobile", services: "services", postcode: "postcode") {
                name
                email
            }
            }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.leads).to.be.an("array");
    });
    it("Check Return Value with name variable", async () => {
      const query = `
          {
            leads(name:"any") {
                name
                email
            }
            }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.leads).to.be.an("array");
    });
    it("Check Return Value with email variable", async () => {
      const query = `
          {
            leads(email: "") {
                name
                email
            }
            }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.leads).to.be.an("array");
    });
    it("Check Return Value with mobile variable", async () => {
      const query = `
          {
            leads(mobile: "mobile") {
                name
                email
            }
            }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.leads).to.be.an("array");
    });
    it("Check Return Value with services variable", async () => {
      const query = `
          {
            leads(services: "services") {
                name
                email
            }
            }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.leads).to.be.an("array");
    });
    it("Check Return Value with postcode variable", async () => {
      const query = `
          {
            leads(postcode: "postcode") {
                name
                email
            }
            }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.leads).to.be.an("array");
    });
  });

  // Check lead query
  describe("Check lead query", () => {
    it("Check Return value ", async () => {
      const query = `
          query {
            lead(id: 1) {
              name
              services
              email
            }
          }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.lead).to.be.an("object");
    });
  });

  // Check register mutation
  describe("Check register mutation", () => {
    it("Check Return value for new user", async () => {
      const randomString = randomBytes(5).toString("hex"); // create random unique string for email
      const query = `
          mutation {
            register(name: "MyName", email: "${randomString}@email.com", services: "delivery", mobile: "00000000001", postcode: "123") {
                name
                id
            }
        }
        `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.data.register).to.be.an("object");
    });
    it("Check Error value for existing email", async () => {
      const query = `
          mutation {
            register(name: "MyName", email: "john@example.com", services: "delivery", mobile: "00000000001", postcode: "123") {
                name
                id
            }
          }
          `;

      const response = await request(app).post("/graphql").send({ query }).expect(200);

      expect(response.body.data).to.exist;
      expect(response.body.errors).to.exist;
      expect(response.body.errors).to.be.an("array");
    });
  });

  // Check an invalid query
  it("Check invalid query", async () => {
    const invalidQuery = `
      query {
        invalid
      }
    `;

    const response = await request(app).post("/graphql").send({ query: invalidQuery }).expect(400);

    expect(response.body.errors).to.exist;
    expect(response.body.errors[0].message).to.include("Cannot query field");
  });
});
