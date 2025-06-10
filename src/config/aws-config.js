const apiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY;

if (!apiKey) {
  console.warn('AWS Location Service API key is not configured. Using OpenStreetMap style.');
}

// Default configuration for India
export const AWS_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
  mapName: import.meta.env.VITE_AWS_MAP_NAME || 'india-safety-map',
  apiKey: import.meta.env.VITE_AWS_LOCATION_API_KEY,
  // Using OpenStreetMap style
  MAP_STYLE_URL: {
    version: 8,
    sources: {
      'osm': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  DEFAULT_CENTER: [
    parseFloat(import.meta.env.VITE_DEFAULT_LNG) || 78.9629, // India center longitude
    parseFloat(import.meta.env.VITE_DEFAULT_LAT) || 20.5937  // India center latitude
  ],
  DEFAULT_ZOOM: parseInt(import.meta.env.VITE_DEFAULT_ZOOM) || 5,  // Zoomed out to show all of India
  
  // AWS Location Service configurations
  placeIndexName: import.meta.env.VITE_AWS_PLACE_INDEX || 'india-place-index',
  routeCalculatorName: import.meta.env.VITE_AWS_ROUTE_CALCULATOR || 'india-route-calculator',
  geofenceCollectionName: import.meta.env.VITE_AWS_GEOFENCE_COLLECTION || 'crime-areas',
  
  // AWS Credentials
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  
  // Service endpoints
  locationServiceEndpoint: `https://location.${import.meta.env.VITE_AWS_REGION || 'ap-south-1'}.amazonaws.com`,
  
  // Feature flags
  enableGeofencing: import.meta.env.VITE_ENABLE_GEOFENCING === 'true',
  enableSafeRoutes: import.meta.env.VITE_ENABLE_SAFE_ROUTES === 'true',
  enablePlaceSearch: import.meta.env.VITE_ENABLE_PLACE_SEARCH === 'true',
  enablePoliceStations: import.meta.env.VITE_ENABLE_POLICE_STATIONS === 'true'
}; 