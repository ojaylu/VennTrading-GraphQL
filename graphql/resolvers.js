import {
  getOrderBook, 
  getTradeRecords, 
  getOrderRecords, 
  createLimitOrder, 
  createMarketOrder,
  getUserTradeRecord,
  getWindowStats,
  getAssetData
} from "../binance/binance.js";

export const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      userAssets: async () => {
        return await getAssetData();
      },
      orderBook: async (_, args) => {
        return await getOrderBook(args);
      },
      tradeRecord: async (_, args) => {
        return await getTradeRecords(args);
      },
      orderRecord: async (_, args) => {
        return await getOrderRecords(args);
      },
      userTradeRecord: async (_, args) => {
        return await getUserTradeRecord(args);
      },
      windowStats: async (_, args) => {
        return await getWindowStats(args);
      }
    },
    Mutation: {
      limitOrder: async (_, args) => {
        return await createLimitOrder(args);
      },
      marketOrder: async (_, args) => {
        return await createMarketOrder(args);
      }
    }
  };