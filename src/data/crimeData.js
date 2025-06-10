// Mock crime data with different severity levels and types
export const crimeData = [
  {
    id: 1,
    type: 'THEFT',
    severity: 'MEDIUM',
    location: [77.2090, 28.6139], // Delhi
    description: 'Vehicle theft reported',
    timestamp: '2024-03-15T10:30:00',
    status: 'REPORTED'
  },
  {
    id: 2,
    type: 'ASSAULT',
    severity: 'HIGH',
    location: [77.2167, 28.6200],
    description: 'Physical assault incident',
    timestamp: '2024-03-15T15:45:00',
    status: 'UNDER_INVESTIGATION'
  },
  {
    id: 3,
    type: 'VANDALISM',
    severity: 'LOW',
    location: [77.2000, 28.6100],
    description: 'Property damage reported',
    timestamp: '2024-03-15T08:15:00',
    status: 'RESOLVED'
  }
];

// Severity color mapping
export const SEVERITY_COLORS = {
  LOW: '#3B82F6',    // blue-500
  MEDIUM: '#F59E0B', // amber-500
  HIGH: '#EF4444',   // red-500
};

// Incident type mapping
export const INCIDENT_TYPES = {
  THEFT: 'Theft/Robbery',
  ASSAULT: 'Assault/Violence',
  VANDALISM: 'Vandalism/Property Damage',
  HARASSMENT: 'Harassment',
  SUSPICIOUS: 'Suspicious Activity'
};

// Function to get marker color based on severity
export const getMarkerColor = (severity) => SEVERITY_COLORS[severity] || SEVERITY_COLORS.MEDIUM;

// Function to format timestamp
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}; 