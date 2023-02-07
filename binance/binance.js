import { Spot } from "@binance/connector";
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

function createClient(apiKey = process.env.API_KEY, apiSecret = process.env.API_SECRET) {
    if (process.env.TEST) {
        console.log("running on test");
        return new Spot(apiKey, apiSecret, { baseURL: 'https://testnet.binance.vision' });
    } else {
        return new Spot("vKkrps1o5Bze7dPP8vOpkm5ffJ7zGZfrzIVjAuWQTJ5XG3gRz4Xgbh24thM5eCHx", "zYhKhPF1NjXq4BaBkXt3EXYmkkYRj53CNFSadrSS2QoMqe12dZMTyhhP9ifOzPiE");
    }
}

export function getAssets({ apiKey, apiSecret }) {
    const client = createClient();
    return binanceResponseHandler(client.userAsset());
}

export function getOrderBook(symbol, limit, { apiKey, apiSecret }) {
    const client = createClient();
    // const transformOrder = order => ({price: order[0], qty: order[1]});
    return binanceResponseHandler(client.depth(symbol, { limit }));
};

export function getTradeRecords(symbol, limit, { apiKey, apiSecret }) {
    const client = createClient();
    return binanceResponseHandler(client.trades(symbol, { limit }));
}

export function getOrderRecords(symbol, limit, { apiKey, apiSecret }) {
    console.log("order called")
    const client = createClient();
    return binanceResponseHandler(client.allOrders(symbol, { limit }));
}

export function getWindowStats(symbol, interval, { apiKey, apiSecret }) {
    console.log(interval)
    const client = createClient();
    return binanceResponseHandler(client.rollingWindowTicker(symbol, [], { windowSize: interval }));
}

export function getUserTradeRecord(symbol, { apiKey, apiSecret }) {
    const client = createClient();
    return binanceResponseHandler(client.myTrades(symbol));
}

// console.log(await getOrderBook("neobtc"));

export function createLimitOrder({ symbol, side, price, quantity, timeInForce, apiKey, apiSecret }) {
    const client = createClient();
    return binanceResponseHandler(client.newOrder(symbol, side, "LIMIT", {
        price,
        quantity,
        timeInForce
    }));
}

export function createMarketOrder({ symbol, side, quantity, apiKey, apiSecret }) {
    const client = createClient();
    return binanceResponseHandler(client.newOrder(symbol, side, "MARKET", {
        quantity
    }));
}

// console.log(process.env.API_KEY);
// console.log(process.env.API_SECRET)

// await createLimitOrder({ symbol: "btcusdt", side: "BUY", price: 1, quantity: 0.1, timeInForce: "GTC" })

// getAssets({}).then(res => console.log(res)).catch(err => console.log(err))
// console.log("hihihihi", temp);

// getTradeRecords("btcusdt", 10, {}).then(res => console.log(res))

getWindowStats("BTCUSDT", "1d", {}).then(res => console.log(res));