import { getOrderBook, getTradeRecords, getOrderRecords } from "../crypto_connector/binance.js";

export const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      orderBook: async (_, {symbol, limit}) => {
        return await getOrderBook(symbol, limit);
      },
      tradeRecord: async (_, {symbol, limit}, context) => {
        console.log("cred cookie:", context)
        return await getTradeRecords(symbol, limit);
      },
      orderRecord: async (_, {symbol, limit}, context) => {
        console.log("cred cookie", context);
        return await getOrderRecords(symbol, limit);
      }
    },
  };