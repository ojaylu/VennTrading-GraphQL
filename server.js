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
import { getCredentials, setCredentials } from './keysDbHandler.js';
import axios from "axios";
import * as dotenv from "dotenv";
import { getSymbolInfo, getSymbols } from "./cyclic.js";
// import { chooseContentTypeForSingleResultResponse } from '@apollo/server/dist/esm/ApolloServer.js';
dotenv.config();

// server 
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// function getDocName() {
//   const day = new Date().getUTCDate();
//   const docName = (process.env.TEST? "test_": "") + "binance_symbol" + "_5"; // `${day}`);
//   return docName;
// }

await server.start();

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:4000"],
  credentials: true
}));

// app.use((req, res, next) => {
//   console.log("ble le ");
//   setTimeout(() => {
//     next();
//   }, 1000);
// })

app.use(async(req, res, next) => {
  console.log("called")
  const idToken = req.get("X-Token");
  if (idToken) {
    if(idToken != "testing") {
      const decodedToken = await auth.verifyIdToken(idToken)
        .catch(err => {
          console.log(err);
          res.status(401).send("Unauthorized");
        });
      console.log(decodedToken.uid)
      req.uid = decodedToken.uid;
      console.log(req.body);
    } else {
      req.uid = "rMIBqEDPQfcowg88aecQds4ZqlD2";
    }
    next();
  } else {
    res.status(401).send("Not logged in");
  }
});


app.get("/hi", async(req, res) => {
  console.log(req.body);
  res.end();
})

app.get(
  "/symbols/:symbol", async(req, res, next) => {
    // const docName = getDocName();
    // console.log(docName, req.params.symbol);
    // getSymbolTradePermissions(docName, req.params.symbol)
    //   .then(data => {
    //     console.log("called");
    //     const secToMidnight = Math.ceil(((new Date().setHours(24, 0, 0, 0)) - (new Date().getTime())) / 1000);
    //     res.set("cache-control", `public, max-age=${secToMidnight}`);
    //     res.send(JSON.stringify(data));
    //   })
    //   .catch(err => next(err));
    try {
      // const secToMidnight = Math.ceil(((new Date().setHours(24, 0, 0, 0)) - (new Date().getTime())) / 1000);
      console.log("symbol called: " + req.params.symbol);
      const info = await getSymbolInfo(req.params.symbol);
      console.log(info)
      // res.set("cache-control", `public, max-age=${secToMidnight}`);
      res.json(info);
    } catch(e) {
      res.status(401);
      next(e);
    }
  }
)

app.get(
  "/symbols", async (_, res, next) => {
    // const docName = getDocName();
    // const ref = db.doc(`exchanges/${docName}`); // ${day}`);
    // const doc = await ref.get();
    // if (!doc.exists) {
    //   next(Error("cannot find document"));
    // } else {
    //   console.log("symbols: " + doc.data());
    //   const secToMidnight = Math.ceil(((new Date().setHours(24, 0, 0, 0)) - (new Date().getTime())) / 1000);
    //   res.set("cache-control", `public, max-age=${secToMidnight}`);
    //   res.send(doc.data());
    // }
    try {
      console.log("symbols called");
      const symbols = await getSymbols();
      console.log("symbolssss: " + JSON.stringify(symbols));
      res.json(symbols);
    } catch(e) {
      console.log("symbols error");
      next(e);
    }
  }
)

app.post("/hi", (req, res) => {
  console.log("lelelele:" + JSON.stringify(req.body));
  res.send("hi");
});

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => ({ uid: req.uid })
  })
);

app.get(
  "/logged-out", (_, res) => {
    res.clearCookie("cred-token").send(JSON.stringify("cookie cleared"));
  }
)

app.get(
  "/binance-keys", async(req, res, next) => {
    const docRef = db.collection("users").doc(req.uid);
    const docSnapshot = await docRef.get();
    console.log("doc exists: " + JSON.stringify(docSnapshot.exists));
    if(!docSnapshot.exists) {
      console.log("doesnt exist")
      await docRef.set({});
    }
    try {
      console.log("called ")
      await getCredentials(req.uid);
      res.send("success");
    } catch(e) {
      res.status(404).send("keys not found");
    }
  }
)

app.post(
  "/binance-keys", async(req, res) => {
    try {
      console.log(req.body)
      console.log("bodyyy:" + JSON.stringify(req.body));
      const body = decryptObj(req.body.encryptedCreds, process.env.API_KEY);
      console.log("decrypted!: " + JSON.stringify(body));
      await setCredentials(req.uid, body);
      res.send("keys saved");
    } catch(e) {
      console.log(e);
      res.status(401);
      res.send("error with saving keys");
    }
  }
)

app.post("/backtesting", async(req, res) => {
  const stats = await fetch("http://localhost:8080/backtesting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  }).then(data => data.json());
  console.log(stats);
  res.json(stats);
})

app.post("/trading-bot/:id", async(req, res) => {
  const body = req.body;
  const creds = await getCredentials(req.uid);
  const bodyWithCreds = {...body, ...creds};
  const status = await fetch(`http://localhost:8080/trading-bot/${req.uid}_${req.params.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodyWithCreds)
  }).then(data => data.json());
  const field = `${req.params.id}.running`;
  await db.collection("users").doc(req.uid).update({
    [field]: true
  });
  console.log(status);
  res.json(status);
})


app.delete("/trading-bot/:id", async(req, res) => {
  const status = await fetch(`http://localhost:8080/trading-bot/${req.uid}_${req.params.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  }).then(data => data.json());
  const field = `${req.params.id}.running`;
  await db.collection("users").doc(req.uid).update({
    [field]: false
  });
  console.log(status);
  res.json(status);
})

app.get("/trading-bot/:id", async(req, res, next) => {
  const response = await axios({
    url: `http://localhost:8080/trading-bot/${req.uid}_${req.params.id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      symbol: req.query.symbol,
      interval: req.query.interval
    }
  }).then(response => response.data).catch(e => {
    console.log(e.response.data);
    next(e);
  })

  if(response.status == "no bot") {
    const field = `${req.params.id}.running`;
    await db.collection("users").doc(req.uid).update({
      [field]: false
    });
    res.json(response);
  } else {
    console.log(response);
    res.json(response);
  }
})

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);