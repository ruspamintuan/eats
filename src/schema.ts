import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLEnumType } from "graphql";
import { openDb } from "./db"; // Import your db connection utility
import { Rows, ExpectedRows } from "./types";
import { GET_LEADS, GET_SPECIFIC_LEADS } from "./sqlQueries";

// Define LeadsType
const LeadsType = new GraphQLObjectType({
  name: "Lead",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    mobile: { type: GraphQLString },
    postcode: { type: GraphQLString },
    services: { type: GraphQLList(GraphQLString) },
  },
});

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    leads: {
      description: "Retrieve all leads",
      type: new GraphQLList(LeadsType),
      resolve: async () => {
        const db = openDb();
        const rows: Rows[] = await new Promise((resolve, reject) => {
          db.all(GET_LEADS, (err: Error, row: Rows[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });

        if (!rows) {
          return;
        }
        const mappedRows: ExpectedRows[] = rows.map((row) => {
          const services: string[] = JSON.parse(row.services); // since services is stored in sqlite as JSON string, parse back to array
          return {
            ...row,
            services,
          };
        });

        return mappedRows;
      },
    },
    lead: {
      description: "Retrieve lead data based on input",
      type: LeadsType,
      args: {
        email: {
          type: GraphQLString,
        },
        services: {
          type: GraphQLString,
        },
        name: {
          type: GraphQLString,
        },
        mobile: {
          type: GraphQLString,
        },
        postcode: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args) => {
        const db = openDb();
        const row: Rows = await new Promise((resolve, reject) => {
          const params: Rows = {
            name: args.name || "",
            email: args.email || "",
            services: args.services || "",
            mobile: args.mobile || "",
            postcode: args.postcode || "",
          };

          const { query, queryParams } = GET_SPECIFIC_LEADS(params);

          db.get(query, queryParams, (error: Error, row: Rows) => {
            if (error) {
              reject(error);
            } else {
              resolve(row);
            }
          });
        });

        if (!row) {
          return;
        }
        return {
          ...row,
          services: JSON.parse(row?.services),
        };
      },
    },
  },
});

// GraphQL schema
const schema = new GraphQLSchema({
  query: QueryType,
  // TODO: Mutation register
});

export default schema;
