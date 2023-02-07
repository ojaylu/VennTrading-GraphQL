import { DynamoDBClient  } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import awsCredentials from "../awsCredentials.json" assert { type: "json" };
import dummy from "./dummy.json" assert { type: "json" };

const client = new DynamoDBClient(awsCredentials);

const docClient = DynamoDBDocumentClient.from(client);

export async function getSymbolTradePermissions(tableName, symbol) {
    const params = {
        TableName: tableName,
        Key: {
            symbol
        },
        ProjectionExpression: "orderTypes,filters"
    };
    
    // const data = await docClient.send(new GetCommand(params));
    // return data.Item;
    return dummy;
};

// getSymbolTradePermissions("test_binance_symbol_5", "ETHUSDT").then(data => console.log(data))