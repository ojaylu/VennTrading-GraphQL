import { Spot } from "@binance/connector";
import * as dotenv from "dotenv";
dotenv.config();

function createClient(apiKey = process.env.API_KEY, secretKey = process.env.SECRET_KEY) {
    return new Spot(apiKey, secretKey, { baseURL: 'https://testnet.binance.vision' });
}

export function getOrderBook(symbol, limit = 10) {
    const client = createClient();
    const transformOrder = order => ({price: order[0], qty: order[1]});
    return client.depth(symbol, { limit }).then(({data}) => {
        // return {bids: bids.map(bid => transformOrder(bid)), asks: asks.map(ask => transformOrder(ask))}
        return data;
    });
};

export function getTradeRecords(symbol, limit = 20) {
    const client = createClient();
    return client.trades(symbol, { limit }).then(response => response.data);
}

export function getOrderRecords(symbol, limit = 20) {
    const client = createClient();
    return client.allOrders(symbol, { limit }).then(response => response.data);
}

console.log(await getOrderBook("BTCUSDT"));