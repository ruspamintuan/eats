import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema"; // Import your schema
import { initializeDb } from "./initializeDb";

// Database initializer
initializeDb();

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true, // For testing
  })
);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
