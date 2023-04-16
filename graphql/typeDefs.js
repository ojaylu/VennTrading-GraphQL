import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String
    userAssets: AssetData!
    orderBook(symbol: String!, limit: Int): OrderBook!
    tradeRecord(symbol: String!, limit: Int): [TradeRecord]!
    orderRecord(symbol: String!, limit: Int): [OrderRecord]!
    userTradeRecord(symbol: String!): [UserTradeRecord]!
    windowStats(symbol: String!, interval: String!): WindowStats!
  }

  type Mutation {
    limitOrder(symbol: String!, side: String!, price: Float!, quantity: Float!, timeInForce: String!): TradeResponse!
    marketOrder(symbol: String!, side: String!, quantity: Float!): TradeResponse!
  }

  type AssetData {
    assetList: [String]!
    assets: [Assets]!
  }

  type Assets {
    asset: String
    free: Float
    locked: Float
    freeze: Float
    withdrawing: Float
    ipoable: Float
    btcValuation: Float
    total: Float
  }

  type Order {
    price: String
    qty: String
  }

  type OrderBook {
    bids: [[String]]!
    asks: [[String]]!
  }

  type TradeRecord {
    price: String!
    qty: String!
    quoteQty: String!
    time: Float!
  }

  type OrderRecord {
    orderId: Float
    price: String
    origQty: String
    executedQty: String
    type: String
    side: String
    time: Float
  }

  type TradeResponse {
    orderId: Float
    transactionTime: Float
  }

  type UserTradeRecord {
    id: Float
    orderId: Float
    price: String
    qty: String
    commission: String
    commissionAsset: String
    time: Float
    isBuyer: Boolean
    isMaker: Boolean
  }

  type WindowStats {
    priceChange: String!
    priceChangePercent: String!
    weightedAvgPrice: String!
    highPrice: String!
    lowPrice: String!
    lastPrice: String!
    volume: String!
    count: Float!
  }
`;