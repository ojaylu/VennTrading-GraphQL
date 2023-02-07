import { 
  getAssets,
  getOrderBook, 
  getTradeRecords, 
  getOrderRecords, 
  createLimitOrder, 
  createMarketOrder,
  getUserTradeRecord,
  getWindowStats
} from "../binance/binance.js";

export const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      userAssets: async (_, __, context) => {
        return await getAssets(context);
      },
      orderBook: async (_, {symbol, limit = 10}, context) => {
        return await getOrderBook(symbol, limit, context);
      },
      tradeRecord: async (_, {symbol, limit = 20}, context) => {
        console.log("cred cookie:", context)
        return await getTradeRecords(symbol, limit, context);
      },
      orderRecord: async (_, {symbol, limit = 50}, context) => {
        console.log("cred cookie", context);
        return await getOrderRecords(symbol, limit, context);
      },
      userTradeRecord: async (_, {symbol}, context) => {
        return await getUserTradeRecord(symbol, context);
      },
      windowStats: async (_, {symbol, interval}, context) => {
        return await getWindowStats(symbol, interval, context);
      }
    },
    Mutation: {
      limitOrder: async (_, args, context) => {
        return await createLimitOrder({ ...args, ...context });
      },
      marketOrder: async (_, args, context) => {
        return await createMarketOrder({ ...args, ...context })
      }
    }
  };