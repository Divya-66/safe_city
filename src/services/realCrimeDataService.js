import Papa from 'papaparse';

// Function to load and parse CSV data
export const importCrimeData = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Function to process and format NCRB data
export const processNcrbData = (rawData) => {
  return rawData.map(record => ({
    id: record.CRIME_ID || `IND${Math.random().toString(36).substr(2, 9)}`,
    type: mapCrimeType(record.CRIME_HEAD || record.CRIME_TYPE),
    severity: calculateSeverity(record.CRIME_HEAD || record.CRIME_TYPE),
    location: extractLocation(record),
    description: generateDescription(record),
    timestamp: record.DATE_OF_OCCURRENCE || new Date().toISOString(),
    status: record.STATUS || 'REPORTED',
    city: record.CITY || record.DISTRICT,
    district: record.DISTRICT || record.CITY,
    state: record.STATE,
    policeStation: record.POLICE_STATION || 'Not Specified'
  }));
};

// Helper function to map NCRB crime types to our categories
const mapCrimeType = (crimeHead) => {
  const crimeTypeMap = {
    'MURDER': 'VIOLENT',
    'RAPE': 'VIOLENT',
    'KIDNAPPING': 'VIOLENT',
    'ROBBERY': 'THEFT',
    'BURGLARY': 'THEFT',
    'THEFT': 'THEFT',
    'RIOTS': 'VIOLENT',
    'CRIMINAL TRESPASS': 'SUSPICIOUS',
    'CHEATING': 'FRAUD',
    'COUNTERFEITING': 'FRAUD',
    'ARSON': 'VANDALISM',
    'HURT': 'ASSAULT',
    'DOWRY DEATHS': 'VIOLENT',
    'MOLESTATION': 'HARASSMENT',
    'SEXUAL HARASSMENT': 'HARASSMENT',
    'CRUELTY BY HUSBAND': 'DOMESTIC_VIOLENCE'
  };

  // Default to 'OTHER' if crime type is not in our mapping
  return crimeTypeMap[crimeHead?.toUpperCase()] || 'OTHER';
};

// Helper function to calculate severity based on crime type
const calculateSeverity = (crimeType) => {
  const severityMap = {
    'VIOLENT': 'HIGH',
    'THEFT': 'MEDIUM',
    'FRAUD': 'MEDIUM',
    'HARASSMENT': 'MEDIUM',
    'DOMESTIC_VIOLENCE': 'HIGH',
    'VANDALISM': 'LOW',
    'SUSPICIOUS': 'LOW',
    'OTHER': 'MEDIUM'
  };

  return severityMap[mapCrimeType(crimeType)] || 'MEDIUM';
};

// Helper function to extract location coordinates
const extractLocation = (record) => {
  // If exact coordinates are available in the data
  if (record.LATITUDE && record.LONGITUDE) {
    return [parseFloat(record.LONGITUDE), parseFloat(record.LATITUDE)];
  }

  // Otherwise, use city/district center coordinates (you'll need to maintain a mapping)
  return getCityCoordinates(record.CITY || record.DISTRICT, record.STATE);
};

// Helper function to get city coordinates (you should expand this with more cities)
const getCityCoordinates = (city, state) => {
  const cityCoords = {
    'DELHI': [77.2090, 28.6139],
    'MUMBAI': [72.8777, 19.0760],
    'BANGALORE': [77.5946, 12.9716],
    'CHENNAI': [80.2707, 13.0827],
    'KOLKATA': [88.3639, 22.5726],
    'HYDERABAD': [78.4867, 17.3850],
    'PUNE': [73.8567, 18.5204],
    'AHMEDABAD': [72.5714, 23.0225],
    // Add more cities as needed
  };

  return cityCoords[city?.toUpperCase()] || [78.9629, 20.5937]; // Default to India center
};

// Helper function to generate description
const generateDescription = (record) => {
  const location = record.LOCATION_DETAILS || `${record.DISTRICT}, ${record.STATE}`;
  const crimeHead = record.CRIME_HEAD || record.CRIME_TYPE;
  const details = record.DESCRIPTION || '';

  return `${crimeHead} reported in ${location}. ${details}`.trim();
};

// Function to validate and clean the data
export const validateCrimeData = (data) => {
  return data.filter(record => {
    // Basic validation checks
    const hasLocation = record.CITY || record.DISTRICT;
    const hasCrimeType = record.CRIME_HEAD || record.CRIME_TYPE;
    const hasState = record.STATE;

    return hasLocation && hasCrimeType && hasState;
  });
};

// Function to aggregate statistics
export const generateStatistics = (data) => {
  return {
    total: data.length,
    byState: groupBy(data, 'state'),
    byType: groupBy(data, 'type'),
    bySeverity: groupBy(data, 'severity'),
    byStatus: groupBy(data, 'status')
  };
};

// Helper function to group data
const groupBy = (data, key) => {
  return data.reduce((acc, item) => {
    const group = item[key];
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
}; 