import * as turf from '@turf/turf';

// Store high-risk areas as polygons
let highRiskAreas = [];

/**
 * Create a geofence for a high-crime area
 * @param {string} areaName - Name for the geofence area
 * @param {array} coordinates - Array of coordinate pairs defining a polygon
 * @returns {object} The created geofence object
 */
export const createCrimeGeofence = (areaName, coordinates) => {
  try {
    // Ensure coordinates are in the right format for turf
    // Turf expects a polygon format: [[[lng1, lat1], [lng2, lat2], ... , [lng1, lat1]]]
    // Make sure the first and last coordinates are the same to close the polygon
    if (coordinates.length > 0 && JSON.stringify(coordinates[0]) !== JSON.stringify(coordinates[coordinates.length - 1])) {
      coordinates.push(coordinates[0]);
    }

    const geofence = {
      id: `crime-area-${Date.now()}`,
      name: areaName,
      polygon: turf.polygon([coordinates]),
      createdAt: new Date().toISOString()
    };

    // Add to local storage
    highRiskAreas.push(geofence);
    
    // Optionally, persist to localStorage
    saveGeofencesToStorage();

    return geofence;
  } catch (error) {
    console.error('Error creating geofence:', error);
    throw new Error('Failed to create geofence');
  }
};

/**
 * Check if a point is inside any high-risk area
 * @param {array} coordinates - [longitude, latitude] of the point to check
 * @returns {boolean} True if point is in any high-risk area
 */
export const isPointInDangerZone = (coordinates) => {
  try {
    const point = turf.point(coordinates);
    
    for (const area of highRiskAreas) {
      if (turf.booleanPointInPolygon(point, area.polygon)) {
        return { inDanger: true, areaName: area.name };
      }
    }
    
    return { inDanger: false };
  } catch (error) {
    console.error('Error checking geofence:', error);
    return { inDanger: false, error: error.message };
  }
};

/**
 * Get all high-risk areas
 * @returns {array} Array of all geofence objects
 */
export const getHighRiskAreas = () => {
  // Load from localStorage if available
  loadGeofencesFromStorage();
  return highRiskAreas;
};

/**
 * Delete a geofence by ID
 * @param {string} geofenceId - ID of the geofence to delete
 * @returns {boolean} Success status
 */
export const deleteGeofence = (geofenceId) => {
  try {
    const initialLength = highRiskAreas.length;
    highRiskAreas = highRiskAreas.filter(area => area.id !== geofenceId);
    
    // Persist changes
    saveGeofencesToStorage();
    
    return highRiskAreas.length < initialLength;
  } catch (error) {
    console.error('Error deleting geofence:', error);
    return false;
  }
};

/**
 * Create high-risk areas from crime data
 * @param {array} crimeData - Array of crime incidents with location and severity
 * @returns {array} Array of created geofence objects
 */
export const calculateHighRiskAreas = (crimeData) => {
  // Create a geofence for each crime incident
  const newHighRiskAreas = [];
  
  // Group incidents by city to avoid too many overlapping geofences
  const incidentsByCity = {};
  crimeData.forEach(incident => {
    if (!incidentsByCity[incident.city]) {
      incidentsByCity[incident.city] = [];
    }
    incidentsByCity[incident.city].push(incident);
  });
  
  // Create geofences for each city's incidents
  Object.entries(incidentsByCity).forEach(([city, incidents]) => {
    // Create a geofence for each incident
    incidents.forEach(incident => {
      // Create a small circular geofence around the incident
      const radius = 0.002; // roughly 200 meters - smaller radius for more precision
      const center = incident.location;
      
      // Create a polygon with 12 points to approximate a circle
      const coordinates = [];
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * 2 * Math.PI;
        coordinates.push([
          center[0] + radius * Math.cos(angle),
          center[1] + radius * Math.sin(angle)
        ]);
      }
      // Close the polygon
      coordinates.push(coordinates[0]);
      
      const geofence = createCrimeGeofence(
        `${incident.crimeType} in ${incident.district}, ${city}`,
        coordinates
      );
      
      newHighRiskAreas.push(geofence);
    });
  });
    
  return newHighRiskAreas;
};

/**
 * Calculate safe route between two points, avoiding high-risk areas
 * @param {array} startCoords - [longitude, latitude] of starting point
 * @param {array} endCoords - [longitude, latitude] of ending point
 * @param {array} crimeData - Optional crime data to use for high-risk areas
 * @returns {object} Route information
 */
export const calculateSafeRoute = (startCoords, endCoords, crimeData = null) => {
  try {
    // If crime data is provided, recalculate high-risk areas
    if (crimeData) {
      calculateHighRiskAreas(crimeData);
    }
    
    // This is a simplified version that creates a direct route
    // For a real implementation, you'd need a routing engine or API
    // or use a service like OpenRouteService (which has a free tier)
    
    // Create a line from start to end
    const route = turf.lineString([startCoords, endCoords]);
    
    // Check if this route intersects with any high-risk areas
    const intersectsHighRiskArea = highRiskAreas.some(area => 
      turf.booleanIntersects(route, area.polygon)
    );
    
    return {
      geometry: [startCoords, endCoords],
      distance: turf.distance(turf.point(startCoords), turf.point(endCoords), {units: 'kilometers'}),
      duration: null, // Would need a real routing engine for accurate duration
      startPoint: startCoords,
      endPoint: endCoords,
      isSafe: !intersectsHighRiskArea
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    throw new Error('Failed to calculate safe route. Please try again.');
  }
};

// Helper functions for persistence
function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

function saveGeofencesToStorage() {
  if (!isLocalStorageAvailable()) {
    return; // Silently fail if localStorage is not available
  }
  
  try {
    const geofencesJson = JSON.stringify(
      highRiskAreas.map(area => ({
        ...area,
        polygon: area.polygon.geometry
      }))
    );
    localStorage.setItem('highRiskAreas', geofencesJson);
  } catch (e) {
    console.warn('Unable to save geofences to storage - continuing in memory only');
  }
}

function loadGeofencesFromStorage() {
  if (!isLocalStorageAvailable()) {
    return; // Silently fail if localStorage is not available
  }
  
  try {
    const storedGeofences = localStorage.getItem('highRiskAreas');
    if (storedGeofences) {
      const parsedGeofences = JSON.parse(storedGeofences);
      highRiskAreas = parsedGeofences.map(area => ({
        ...area,
        polygon: turf.polygon(area.polygon.coordinates)
      }));
    }
  } catch (e) {
    console.warn('Unable to load geofences from storage - continuing with empty state');
    highRiskAreas = [];
  }
} 