import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = "UserProfiles";

export const createUserProfile = async (userData) => {
  try {
    console.log('Creating user profile with data:', userData);
    
    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId: userData.phoneNumber, // Using phone number as the primary key
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profilePicture: userData.profilePicture || null,
        emergencyContacts: userData.emergencyContacts || [],
        preferences: {
          notifications: true,
          darkMode: true,
          language: 'en'
        }
      },
      ConditionExpression: "attribute_not_exists(userId)" // Ensure user doesn't already exist
    };

    console.log('DynamoDB params:', params);
    const command = new PutCommand(params);
    const result = await docClient.send(command);
    console.log('DynamoDB response:', result);
    return params.Item;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId
      }
    };

    const command = new GetCommand(params);
    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.entries(updates).forEach(([key, value]) => {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    // Always update the updatedAt timestamp
    updateExpression.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    };

    const command = new UpdateCommand(params);
    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const deleteUserProfile = async (userId) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId
      }
    };

    const command = new DeleteCommand(params);
    await docClient.send(command);
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
};

export const addEmergencyContact = async (userId, contact) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId
      },
      UpdateExpression: "SET emergencyContacts = list_append(if_not_exists(emergencyContacts, :empty_list), :contact)",
      ExpressionAttributeValues: {
        ":contact": [contact],
        ":empty_list": []
      },
      ReturnValues: "ALL_NEW"
    };

    const command = new UpdateCommand(params);
    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    console.error("Error adding emergency contact:", error);
    throw error;
  }
};

export const removeEmergencyContact = async (userId, contactIndex) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId
      },
      UpdateExpression: `REMOVE emergencyContacts[${contactIndex}]`,
      ReturnValues: "ALL_NEW"
    };

    const command = new UpdateCommand(params);
    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    console.error("Error removing emergency contact:", error);
    throw error;
  }
}; 