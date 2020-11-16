import * as AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

/** put an item in the db table */
export function saveItemInDB(user: string, isPresent: boolean, loc: string, timestamp: string) {
    const params = {
        TableName: "geofences",
        Key: { "user": user },
        UpdateExpression: "set isPresent = :p, locationMapUrl = :l, occurredAt = :t",
        ExpressionAttributeValues:{
            ":p":isPresent,
            ":l":loc,
            ":t":timestamp
        },
        ReturnValues:"UPDATED_NEW"
    };

    return dynamoDB
        .update(params)
        .promise()
        .then(res => res)
        .catch(err => err);
}

/** get an item from the db table */
export function getItemFromDB(user: string) {
    const params = {
        TableName: "geofences",
        Key: {
            user
        }
    };

    return dynamoDB
        .get(params)
        .promise()
        .then(res => res.Item)
        .catch(err => err);
}