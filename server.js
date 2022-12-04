import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";

const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);