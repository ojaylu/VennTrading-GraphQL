import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import cors from 'cors';
import { encryptObj, decryptObj } from "./crypto.js";
import { db, auth } from './firebase/config.js';
import { setCredentials } from './keysDbHandler.js';
import * as dotenv from "dotenv";
import { getSymbolTradePermissions } from './aws/dynamo.js';
dotenv.config();

// server 
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

function getDocName() {
  const day = new Date().getUTCDate();
  const docName = (process.env.TEST? "test_": "") + "binance_symbol" + "_5"; // `${day}`);
  return docName;
}

await server.start();

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:4000"],
  credentials: true
}));

// app.use((req, res) => {
//   const idToken = req.get("X-Token");
//   if (idToken) {
//     auth.verifyIdToken(idToken)
//     .then(decodedToken => {
//       req.userUID = decodedToken.uid;
//       next();
//     })
//     .catch(err => {
//       res.status(401).send("Unauthorized");
//     });
//   } else {
//     res.status(401).send("Not logged in");
//   }
// });

app.get("/hi", (_, res) => {res.send("hi")});

app.use(
  '/graphql',
  expressMiddleware(server, {
    // context: async ({ req }) => {
    //   console.log("descrypted:", req.signedCookies["cred-token"] && decryptObj(req.signedCookies["cred-token"]));
    //   return ({
    //   cred: req.signedCookies["cred-token"] && decryptObj(req.signedCookies["cred-token"])
    // })}
  })
);

app.get(
  "/symbols", async (_, res, next) => {
    const docName = getDocName();
    const ref = db.doc(`exchanges/${docName}`); // ${day}`);
    const doc = await ref.get();
    if (!doc.exists) {
      next(Error("cannot find document"));
    } else {
      console.log(doc.data());
      const secToMidnight = Math.ceil(((new Date().setHours(24, 0, 0, 0)) - (new Date().getTime())) / 1000);
      res.set("cache-control", `public, max-age=${secToMidnight}`);
      res.send(doc.data());
    }
  }
)

app.get(
  "/logged-out", (_, res) => {
    res.clearCookie("cred-token").send(JSON.stringify("cookie cleared"));
  }
)

app.post(
  "/binance-keys", async (req, res) => {
    try {
      await setCredentials(req.userUID, req.body);
      res.send("keys saved");
    } catch(e) {
      res.send("error with saving keys");
    }
  }
)

app.get(
  "/symbols/:symbol", async (req, res, next) => {
    const docName = getDocName();
    console.log(docName, req.params.symbol);
    getSymbolTradePermissions(docName, req.params.symbol)
      .then(data => {
        console.log("called");
        const secToMidnight = Math.ceil(((new Date().setHours(24, 0, 0, 0)) - (new Date().getTime())) / 1000);
        res.set("cache-control", `public, max-age=${secToMidnight}`);
        res.send(JSON.stringify(data));
      })
      .catch(err => next(err));
  }
)

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);