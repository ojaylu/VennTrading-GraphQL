import {
  getOrderBook, 
  getTradeRecords, 
  getUserOrderRecords, 
  createLimitOrder, 
  createMarketOrder,
  getUserTradeRecord,
  getWindowStats,
  getAssetData
} from "../binance/binance.js";

export const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      userAssets: async (_, __, { uid }) => {
        return await getAssetData(uid);
      },
      orderBook: async (_, args, { uid }) => {
        return await getOrderBook(args, uid);
      },
      tradeRecord: async (_, args) => {
        return await getTradeRecords(args);
      },
      orderRecord: async (_, args, { uid }) => {
        return await getUserOrderRecords(args, uid);
      },
      userTradeRecord: async (_, args, { uid }) => {
        return await getUserTradeRecord(args, uid);
      },
      windowStats: async (_, args) => {
        return await getWindowStats(args);
      }
    },
    Mutation: {
      limitOrder: async (_, args, { uid }) => {
        return await createLimitOrder(args, uid);
      },
      marketOrder: async (_, args, { uid }) => {
        return await createMarketOrder(args, uid);
      }
    }
  };