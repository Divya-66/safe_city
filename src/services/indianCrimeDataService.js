// Major cities in India with their coordinates and districts
const INDIAN_CITIES = {
  'Delhi': {
    center: [77.2090, 28.6139],
    districts: ['Central Delhi', 'New Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi']
  },
  'Mumbai': {
    center: [72.8777, 19.0760],
    districts: ['South Mumbai', 'Western Suburbs', 'Eastern Suburbs', 'Thane', 'Navi Mumbai']
  },
  'Bangalore': {
    center: [77.5946, 12.9716],
    districts: ['Central Bangalore', 'East Bangalore', 'West Bangalore', 'North Bangalore', 'South Bangalore']
  },
  'Chennai': {
    center: [80.2707, 13.0827],
    districts: ['Central Chennai', 'North Chennai', 'South Chennai', 'West Chennai']
  },
  'Kolkata': {
    center: [88.3639, 22.5726],
    districts: ['North Kolkata', 'Central Kolkata', 'South Kolkata', 'East Kolkata', 'West Kolkata']
  },
  'Hyderabad': {
    center: [78.4867, 17.3850],
    districts: ['Central Zone', 'East Zone', 'South Zone', 'West Zone', 'North Zone']
  },
  'Pune': {
    center: [73.8567, 18.5204],
    districts: ['Hadapsar', 'Kothrud', 'Pune City', 'Pimpri-Chinchwad']
  },
  'Ahmedabad': {
    center: [72.5714, 23.0225],
    districts: ['East Ahmedabad', 'West Ahmedabad', 'North Ahmedabad', 'South Ahmedabad']
  }
};

const CRIME_TYPES = {
  'theft': {
    descriptions: [
      'Vehicle theft reported',
      'Residential burglary',
      'Mobile phone snatching',
      'Shoplifting incident',
      'Bicycle theft'
    ]
  },
  'assault': {
    descriptions: [
      'Physical altercation reported',
      'Street fight incident',
      'Assault with weapon',
      'Group violence'
    ]
  },
  'harassment': {
    descriptions: [
      'Street harassment reported',
      'Verbal abuse incident',
      'Stalking complaint',
      'Workplace harassment'
    ]
  },
  'vandalism': {
    descriptions: [
      'Property damage reported',
      'Graffiti vandalism',
      'Vehicle vandalism',
      'Public property damage'
    ]
  },
  'suspicious_activity': {
    descriptions: [
      'Suspicious person reported',
      'Unusual behavior observed',
      'Suspicious vehicle parked',
      'Strange activity in vacant property'
    ]
  }
};

// Generate a random date within the last 30 days
const generateRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
};

// Generate random coordinates within a radius of a center point
const generateRandomLocation = (centerLng, centerLat, radiusKm = 5) => {
  const radiusInDeg = radiusKm / 111; // Rough approximation of kilometers to degrees
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomRadius = Math.random() * radiusInDeg;
  
  return [
    centerLng + (randomRadius * Math.cos(randomAngle)),
    centerLat + (randomRadius * Math.sin(randomAngle))
  ];
};

// Get random status
const getRandomStatus = () => {
  const statuses = ['reported', 'under_investigation', 'resolved', 'closed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Get severity based on crime type
const getSeverity = (crimeType) => {
  const severityMap = {
    'theft': ['low', 'medium'],
    'assault': ['medium', 'high'],
    'harassment': ['low', 'medium'],
    'vandalism': ['low', 'medium'],
    'suspicious_activity': ['low']
  };
  
  const possibleSeverities = severityMap[crimeType];
  return possibleSeverities[Math.floor(Math.random() * possibleSeverities.length)];
};

// Generate mock crime data
export const generateMockCrimeData = () => {
  const crimeData = [];
  const crimeTypes = Object.keys(CRIME_TYPES);
  
  // Generate 200 random incidents across all cities
  for (let i = 0; i < 200; i++) {
    const cityName = Object.keys(INDIAN_CITIES)[Math.floor(Math.random() * Object.keys(INDIAN_CITIES).length)];
    const city = INDIAN_CITIES[cityName];
    const district = city.districts[Math.floor(Math.random() * city.districts.length)];
    const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
    const description = CRIME_TYPES[crimeType].descriptions[
      Math.floor(Math.random() * CRIME_TYPES[crimeType].descriptions.length)
    ];
    
    const [longitude, latitude] = generateRandomLocation(city.center[0], city.center[1]);
    
    crimeData.push({
      id: `incident-${Math.random().toString(36).substr(2, 9)}`,
      city: cityName,
      district: district,
      location: [longitude, latitude],
      crimeType: crimeType,
      description: description,
      timestamp: generateRandomDate().toISOString(),
      severity: getSeverity(crimeType),
      status: getRandomStatus(),
      policeStation: `${district} Police Station`
    });
  }
  
  return crimeData;
}; 