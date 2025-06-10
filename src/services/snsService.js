import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: "ap-south-1", // Mumbai region
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const sendIncidentNotification = async (incidentData) => {
  try {
    const message = {
      default: JSON.stringify(incidentData),
      email: `New Incident Reported\n\nType: ${incidentData.type}\nSeverity: ${incidentData.severity}\nLocation: ${incidentData.location}\nDescription: ${incidentData.description}`,
      sms: `New Incident: ${incidentData.type} (${incidentData.severity}) at ${incidentData.location}`,
    };

    const params = {
      Message: JSON.stringify(message),
      MessageStructure: "json",
      TopicArn: import.meta.env.VITE_SNS_TOPIC_ARN,
    };

    const command = new PublishCommand(params);
    const response = await snsClient.send(command);
    return response;
  } catch (error) {
    console.error("Error sending SNS notification:", error);
    throw error;
  }
}; 