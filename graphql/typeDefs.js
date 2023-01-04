import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String
    orderBook(symbol: String!, limit: Int): OrderBook!
    tradeRecord(symbol: String!, limit: Int): [TradeRecord]!
    orderRecord(symbol: String!, limit: Int): [OrderRecord]!
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
    price: String
    origQty: String
    executedQty: String
    type: String
    side: String
    time: String
  }
`;