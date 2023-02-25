import { Spot } from "@binance/connector";
import { getCredentials } from "../keysDbHandler.js";
import * as dotenv from "dotenv";
dotenv.config();

function binanceErrorHandler(e) {
    if (e.response) {
        throw Error(e.response.data.msg);
    } else {
        throw Error("error with request");
    }
}

function binanceResponseHandler(promise) {
    return promise.then(res => res.data).catch(e => binanceErrorHandler(e));
}

function createClient(credentials) {
    // if (process.env.TEST) {
    //     console.log("running on test");
    //     return new Spot(credentials.apiKey, credentials.apiSecret, { baseURL: 'https://testnet.binance.vision' });
    // } else {
        return new Spot("vKkrps1o5Bze7dPP8vOpkm5ffJ7zGZfrzIVjAuWQTJ5XG3gRz4Xgbh24thM5eCHx", "zYhKhPF1NjXq4BaBkXt3EXYmkkYRj53CNFSadrSS2QoMqe12dZMTyhhP9ifOzPiE");
        // return new Spot(apiKey, apiSecret);
    // }
}

export async function getAssetData() {
    const credentials = getCredentials();
    // const client = createClient(credentials);
    // const assets = await binanceResponseHandler(client.userAsset()); // comment out when testing
    const assets = [
        {
            "asset": "AVAX",
            "free": "1",
            "locked": "0",
            "freeze": "0",
            "withdrawing": "1",
            "ipoable": "1",
            "btcValuation": "0",
        },
        {
            "asset": "BCH",
            "free": "0.9",
            "locked": "0",
            "freeze": "0",
            "withdrawing": "0.1",
            "ipoable": "0.2",
            "btcValuation": "0",
        },
    ]
    const assetList = assets.map(asset => asset.asset);
    const modifiedAssets = assets.map(asset => {
        const {asset: name, ...rest} = asset;
        const values = Object.keys(rest).reduce((accum, current) => {
            accum[current] = Number(asset[current]);
            return accum;
        }, {});

        const total = Object.values(values).reduce((accum, current) => accum + current, 0);

        return {asset: name, ...values, total};
    })
    return {assetList, assets: modifiedAssets};
}

export function getOrderBook({ symbol, limit = 10 }) {
    const client = createClient();
    // const transformOrder = order => ({price: order[0], qty: order[1]});
    return binanceResponseHandler(client.depth(symbol, { limit }));
};

export function getTradeRecords({ symbol, limit = 20 }) {
    const client = createClient();
    return binanceResponseHandler(client.trades(symbol, { limit }));
}

export function getOrderRecords({ symbol, limit = 50 }) {
    console.log("order called")
    const client = createClient();
    return binanceResponseHandler(client.allOrders(symbol, { limit }));
}

export function getWindowStats({ symbol, interval }) {
    console.log(interval)
    const client = createClient();
    return binanceResponseHandler(client.rollingWindowTicker(symbol, [], { windowSize: interval }));
}

export function getUserTradeRecord({ symbol }) {
    const client = createClient();
    return binanceResponseHandler(client.myTrades(symbol));
}

// console.log(await getOrderBook("neobtc"));

export function createLimitOrder({ symbol, side, price, quantity, timeInForce }) {
    const client = createClient();
    return binanceResponseHandler(client.newOrder(symbol, side, "LIMIT", {
        price,
        quantity,
        timeInForce
    }));
}

export function createMarketOrder({ symbol, side, quantity }) {
    const client = createClient();
    return binanceResponseHandler(client.newOrder(symbol, side, "MARKET", {
        quantity
    }));
}

// console.log(process.env.API_KEY);
// console.log(process.env.API_SECRET)

// await createLimitOrder({ symbol: "btcusdt", side: "BUY", price: 1, quantity: 0.1, timeInForce: "GTC" })

getAssetData({}).then(res => console.log(res)).catch(err => console.log(err))
// console.log("hihihihi", temp);

// getTradeRecords("btcusdt", 10, {}).then(res => console.log(res))

// getWindowStats("BTCUSDT", "1d", {}).then(res => console.log(res));