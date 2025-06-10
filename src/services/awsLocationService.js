import { 
  LocationClient, 
  SearchPlaceIndexForTextCommand,
  SearchPlaceIndexForPositionCommand
} from "@aws-sdk/client-location";
import { AWS_CONFIG } from '../config/aws-config';

const locationClient = new LocationClient({
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey
  }
});

// Search for places by text query
export const searchPlace = async (searchText) => {
  try {
    const command = new SearchPlaceIndexForTextCommand({
      IndexName: AWS_CONFIG.placeIndexName,
      Text: searchText,
      BiasPosition: AWS_CONFIG.DEFAULT_CENTER, // Bias towards India
      MaxResults: 5,
      FilterCountries: ['IND'] // Only search in India
    });

    const response = await locationClient.send(command);
    return response.Results.map(result => ({
      id: result.PlaceId,
      text: result.Place.Label,
      coordinates: result.Place.Geometry.Point,
      address: result.Place.Address
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    throw new Error('Failed to search location. Please try again.');
  }
};

// Get nearby police stations
export const getNearbyPoliceStations = async (coordinates, radiusInMeters = 5000) => {
  try {
    const command = new SearchPlaceIndexForPositionCommand({
      IndexName: AWS_CONFIG.placeIndexName,
      Position: coordinates,
      MaxResults: 10,
      FilterCategories: ['police']
    });

    const response = await locationClient.send(command);
    return response.Results.map(result => ({
      id: result.PlaceId,
      name: result.Place.Label,
      coordinates: [
        result.Place.Geometry.Point[0],
        result.Place.Geometry.Point[1]
      ],
      address: result.Place.Address
    }));
  } catch (error) {
    console.error('Error finding police stations:', error);
    throw error;
  }
}; 