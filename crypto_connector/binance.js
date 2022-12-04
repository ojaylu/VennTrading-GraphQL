import { Spot } from "@binance/connector";

const client = new Spot();

export async function getOrderBook (symbol, limit) {
    client.depth(symbol, {limit}) 
};