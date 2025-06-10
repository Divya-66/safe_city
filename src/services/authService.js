import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand, GlobalSignOutCommand } from "@aws-sdk/client-cognito-identity-provider";
import { SNSClient, SubscribeCommand, UnsubscribeCommand } from "@aws-sdk/client-sns";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const snsClient = new SNSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const calculateSecretHash = async (username) => {
  const message = username + import.meta.env.VITE_COGNITO_CLIENT_ID;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(import.meta.env.VITE_COGNITO_CLIENT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

// Mock user database (replace with your actual user database)
const users = [
  { email: 'user@example.com', password: 'password123', subscriptionArn: null }
];

export const signUp = async (phoneNumber, password, name) => {
  try {
    // Format phone number with country code
    const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    const secretHash = await calculateSecretHash(formattedPhoneNumber);
    
    const command = new SignUpCommand({
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      Username: formattedPhoneNumber,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: 'phone_number',
          Value: formattedPhoneNumber,
        },
        {
          Name: 'name',
          Value: name,
        }
      ],
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const confirmSignUp = async (phoneNumber, code) => {
  try {
    const secretHash = await calculateSecretHash(phoneNumber);
    const command = new ConfirmSignUpCommand({
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      Username: phoneNumber,
      ConfirmationCode: code,
      SecretHash: secretHash,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Error confirming sign up:", error);
    throw error;
  }
};

export const login = async (phoneNumber, password) => {
  try {
    const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    const secretHash = await calculateSecretHash(formattedPhoneNumber);
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: formattedPhoneNumber,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });

    const response = await cognitoClient.send(command);
    return {
      phoneNumber: formattedPhoneNumber,
      tokens: response.AuthenticationResult,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const forgotPassword = async (phoneNumber) => {
  try {
    const secretHash = await calculateSecretHash(phoneNumber);
    const command = new ForgotPasswordCommand({
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      Username: phoneNumber,
      SecretHash: secretHash,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Error initiating forgot password:", error);
    throw error;
  }
};

export const confirmForgotPassword = async (phoneNumber, code, newPassword) => {
  try {
    const secretHash = await calculateSecretHash(phoneNumber);
    const command = new ConfirmForgotPasswordCommand({
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      Username: phoneNumber,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: secretHash,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Error confirming forgot password:", error);
    throw error;
  }
};

export const subscribeToIncidents = async (phoneNumber) => {
  try {
    const params = {
      Protocol: 'sms',
      TopicArn: import.meta.env.VITE_SNS_TOPIC_ARN,
      Endpoint: phoneNumber,
    };

    const command = new SubscribeCommand(params);
    const response = await snsClient.send(command);
    return response.SubscriptionArn;
  } catch (error) {
    console.error("Error subscribing to SNS:", error);
    throw error;
  }
};

export const unsubscribeFromIncidents = async (subscriptionArn) => {
  try {
    const params = {
      SubscriptionArn: subscriptionArn,
    };

    const command = new UnsubscribeCommand(params);
    await snsClient.send(command);
  } catch (error) {
    console.error("Error unsubscribing from SNS:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.tokens?.AccessToken) {
        const command = new GlobalSignOutCommand({
          AccessToken: userData.tokens.AccessToken,
        });
        await cognitoClient.send(command);
      }
    }
    localStorage.removeItem('user');
  } catch (error) {
    console.error("Error logging out:", error);
    // Even if there's an error, we still want to clear the local storage
    localStorage.removeItem('user');
  }
}; 