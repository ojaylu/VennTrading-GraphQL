import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { encryptObj, decryptObj } from "./crypto.js";
import { db } from './firebase/config.js';

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:4000"],
  credentials: true
}));

app.use(cookieParser("testing"));

app.use(
  '/graphql',
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      cred: req.signedCookies["cred-token"] && decryptObj(req.signedCookies["cred-token"])
    })
  })
);

app.get(
  "/logged-in", (req, res) => {
    console.log(req.signedCookies);
    res.cookie("cred-token", encryptObj({
      apiKey: process.env.API_KEY,
      apiSecret: process.env.SECRET_KEY
    }), {
      httpOnly: true,
      signed: true,
      sameSite: "None"
    }).send(JSON.stringify("cookie set"));
  }
);

app.get(
  "/check-cookie", (req, res) => {
    console.log(req.signedCookies) // && decryptObj(req.signedCookies["cred-token"]));
    res.end();
  }
)

app.get(
  "/symbols", async (_, res, next) => {
    const day = new Date().getUTCDate();
    const ref = db.doc(`exchanges/binance_symbol_5`); // ${day}`);
    const doc = await ref.get();
    if (!doc.exists) {
      next(Error("cannot find document"));
    } else {
      console.log(doc.data());
      res.send(doc.data());
    }
  }
)

app.get(
  "/logged-out", (_, res) => {
    res.clearCookie("cred-token").send(JSON.stringify("cookie cleared"));
  }
)

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);