import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList } from "graphql";
import { openDb } from "./db"; // Import your db connection utility
import { Rows, ExpectedRows } from "./types";

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
      type: new GraphQLList(LeadsType),
      resolve: async () => {
        const db = openDb();
        const rows: Rows[] = await new Promise((resolve, reject) => {
          db.all("SELECT * FROM leads", (err: Error | undefined, row: Rows[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });

        if (!rows) {
          throw new Error("no rows found");
        }
        const mappedRows: ExpectedRows[] = rows.map((row) => {
          const services: string[] = JSON.parse(row.services);
          return {
            ...row,
            services,
          };
        });

        return mappedRows;
      },
    },

    // TODO: lead query
  },
});

// GraphQL schema
const schema = new GraphQLSchema({
  query: QueryType,
  // TODO: Mutation register
});

export default schema;
