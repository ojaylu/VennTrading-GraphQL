import { getOrderBook } from "../crypto_connector/binance.js";

export const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      orderBook: (parent, {symbol, limit}) => {
        return getOrderBook(symbol, limit);
      }
    },
  };