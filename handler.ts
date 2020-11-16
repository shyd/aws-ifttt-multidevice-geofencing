import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

import { saveItemInDB, getItemFromDB } from "./dynamodb-actions";

export const respond = (fulfillmentText: any, statusCode: number): any => {
  return {
    statusCode,
    body: JSON.stringify(fulfillmentText),
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  };
};

/** Add an item to the list */
export const addGefenceState: Handler = async (
    event: APIGatewayEvent,
    context: Context
) => {
  const incoming: { user: string, isPresent: boolean, loc: string, timestamp: string } = JSON.parse(event.body);
  const { user, isPresent, loc, timestamp } = incoming;

  try {
    await saveItemInDB(user, isPresent, loc, timestamp);

    return respond({ created: incoming }, 201);
  } catch (err) {
    return respond(err, 400);
  }
};

/** Get an item from the list table */
export const getGefenceState: Handler = async (
    event: APIGatewayEvent,
    context: Context
) => {
  const id: string = event.pathParameters.id;

  try {
    const toDoItem = await getItemFromDB(id);

    return respond(toDoItem, 200);
  } catch (err) {
    return respond(err, 404);
  }
};