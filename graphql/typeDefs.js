import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String
    orderBook(symbol: String!, limit: Int): OrderBook!
  }

  type OrderBook {
    bids: [String]!
    asks: [String]!
  }
`;