import React, { useState } from 'react';
import { Bell, AlertTriangle, TrendingUp, MapPin, Calendar } from 'lucide-react';

// Mock data for alerts
const MOCK_ALERTS = [
  {
    id: 1,
    type: 'crime_trend',
    title: 'Increased Theft Reports',
    description: 'Recent spike in bicycle thefts in the downtown area. Extra vigilance recommended.',
    location: 'Downtown Area',
    severity: 'high',
    timestamp: '2023-05-15T10:30:00',
    prediction: 'High likelihood of continued incidents in the next 48 hours.',
    trend: 'increasing'
  },
  {
    id: 2,
    type: 'safety_advisory',
    title: 'Poor Street Lighting',
    description: 'Multiple reports of malfunctioning street lights on Oak Street. Maintenance scheduled.',
    location: 'Oak Street',
    severity: 'medium',
    timestamp: '2023-05-15T14:15:00',
    prediction: 'Issue expected to be resolved within 24 hours.',
    trend: 'stable'
  },
  {
    id: 3,
    type: 'pattern_detection',
    title: 'Suspicious Activity Pattern',
    description: 'Pattern of suspicious behavior reported near the central station during evening hours.',
    location: 'Central Station',
    severity: 'medium',
    timestamp: '2023-05-15T16:45:00',
    prediction: 'Increased patrols being deployed in the area.',
    trend: 'decreasing'
  }
];

const PredictiveAlerts = () => {
  const [filter, setFilter] = useState('all');
  const [subscribedAreas, setSubscribedAreas] = useState(['Downtown Area', 'Oak Street']);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  const getSeverityBgColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-yellow-50';
      case 'low':
        return 'bg-green-50';
      default:
        return 'bg-blue-50';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing':
        return 'text-red-500';
      case 'decreasing':
        return 'text-green-500';
      default:
        return 'text-yellow-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredAlerts = filter === 'all'
    ? MOCK_ALERTS
    : MOCK_ALERTS.filter(alert => alert.severity === filter);

  const toggleAreaSubscription = (area) => {
    setSubscribedAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  return (
    <div className="page-container">
      <h2 className="page-title">
        <div className="page-title-icon">
          <Bell />
        </div>
        Predictive Safety Alerts
      </h2>

      <div className="grid gap-6">
        {filteredAlerts.map(alert => (
          <div key={alert.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className={`h-5 w-5 mr-2 ${getSeverityColor(alert.severity)}`} />
                <h3 className="text-lg font-semibold text-gray-300">{alert.type}</h3>
              </div>
              <div className={`flex items-center ${getTrendColor(alert.trend)}`}>
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="capitalize">{alert.trend}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <div className="flex items-center text-gray-400 mb-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </div>
                <p className="text-gray-300">{alert.location}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <div className="flex items-center text-gray-400 mb-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timestamp
                </div>
                <p className="text-gray-300">{formatDate(alert.timestamp)}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
              <p className="text-gray-300">{alert.prediction}</p>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => toggleAreaSubscription(alert.location)}
                className={`btn-secondary ${
                  subscribedAreas.includes(alert.location)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {subscribedAreas.includes(alert.location) ? 'Subscribed' : 'Subscribe'}
              </button>
              <button className="btn-primary">
                Take Action
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictiveAlerts; 