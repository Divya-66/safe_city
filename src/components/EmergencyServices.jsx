import React from 'react';
import { Phone, MapPin, Clock, Info, Shield, Ambulance, Building2, AlertTriangle } from 'lucide-react';

const EmergencyServices = () => {
  const services = [
    {
      name: 'Police',
      phone: '100',
      address: 'Local Police Station',
      hours: '24/7',
      description: 'Emergency response and law enforcement services',
      icon: Shield
    },
    {
      name: 'Ambulance',
      phone: '108',
      address: 'Emergency Medical Services',
      hours: '24/7',
      description: 'Emergency medical care and ambulance services',
      icon: Ambulance
    },
    {
      name: 'Fire Department',
      phone: '101',
      address: 'Local Fire Station',
      hours: '24/7',
      description: 'Fire suppression and rescue services',
      icon: Building2
    },
    {
      name: 'Women Helpline',
      phone: '1091',
      address: 'National Women Helpline',
      hours: '24/7',
      description: 'Support for women in distress',
      icon: AlertTriangle
    },
    {
      name: 'Child Helpline',
      phone: '1098',
      address: 'National Child Helpline',
      hours: '24/7',
      description: 'Support for children in distress',
      icon: AlertTriangle
    },
    {
      name: 'Disaster Management',
      phone: '1078',
      address: 'National Disaster Management',
      hours: '24/7',
      description: 'Disaster response and management',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
          <Phone size={24} />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
          Emergency Services
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <Icon size={20} className="text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-100">{service.name}</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Phone size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Emergency Contact</p>
                    <p className="text-gray-100 font-medium">{service.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <MapPin size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-gray-100 font-medium">{service.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Clock size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Operating Hours</p>
                    <p className="text-gray-100 font-medium">{service.hours}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Info size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-gray-100 font-medium">{service.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Important Information</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>All emergency numbers are toll-free and available 24/7</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>When calling emergency services, provide your exact location and nature of emergency</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>For non-emergency police assistance, contact your local police station</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Keep emergency numbers saved in your phone for quick access</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyServices; 