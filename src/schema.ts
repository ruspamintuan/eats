import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLEnumType, GraphQLNonNull } from "graphql";
import { openDb } from "./db"; // Import your db connection utility
import { Rows, ExpectedRows, RowWithID } from "./types";
import { GET_LEAD_BY_ID, GET_SPECIFIC_LEADS, INSERT_LEAD } from "./sqlQueries";

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
        const rows: Rows[] = await new Promise((resolve, reject) => {
          const params: Rows = {
            name: args.name || "",
            email: args.email || "",
            services: args.services || "",
            mobile: args.mobile || "",
            postcode: args.postcode || "",
          };

          const { query, queryParams } = GET_SPECIFIC_LEADS(params);

          db.all(query, queryParams, (error: Error, row: Rows[]) => {
            if (error) {
              reject(error);
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
      description: "Retrieve lead data based on id",
      type: LeadsType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (_, args) => {
        const db = openDb();
        const row: Rows = await new Promise((resolve, reject) => {
          db.get(GET_LEAD_BY_ID, [args.id], (error: Error, row: Rows) => {
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
          services: JSON.parse(row.services), // Stored as JSON string, parse back to array
        };
      },
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: LeadsType,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        email: {
          type: GraphQLNonNull(GraphQLString),
        },
        mobile: {
          type: GraphQLNonNull(GraphQLString),
        },
        postcode: {
          type: GraphQLNonNull(GraphQLString),
        },
        services: {
          type: GraphQLNonNull(GraphQLList(GraphQLString)),
        },
      },
      resolve: async (_: any, args) => {
        const { name, email, mobile, postcode, services } = args as ExpectedRows;
        const db = openDb();
        const row: RowWithID = await new Promise((resolve, reject) => {
          db.run(INSERT_LEAD, [name, email, mobile, postcode, JSON.stringify(services)], function (err: Error | null) {
            if (err) {
              reject(err);
            } else {
              resolve({
                id: this.lastID,
                name,
                email,
                mobile,
                postcode,
                services,
              });
            }
          });
        });

        return row;
      },
    },
  },
});

// GraphQL schema
const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

export default schema;
