import { useState, useEffect } from 'react';
import { searchPlaces, calculateSafeRoute } from '../services/awsLocationService';
import debounce from 'lodash/debounce';

const LocationSearch = ({ onLocationSelect, crimeData, map }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeMode, setRouteMode] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [route, setRoute] = useState(null);

  // Debounced search function
  const debouncedSearch = debounce(async (text) => {
    if (!text) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchPlaces(text);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search locations');
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchText);
    return () => debouncedSearch.cancel();
  }, [searchText]);

  const handleLocationSelect = (location) => {
    if (routeMode) {
      if (!startLocation) {
        setStartLocation(location);
      } else if (!endLocation) {
        setEndLocation(location);
        calculateRoute(startLocation, location);
      }
    } else {
      onLocationSelect(location);
    }
    setSearchText('');
    setSearchResults([]);
  };

  const calculateRoute = async (start, end) => {
    setLoading(true);
    setError(null);

    try {
      const routeData = await calculateSafeRoute(
        start.coordinates,
        end.coordinates,
        crimeData
      );

      // Add the route to the map
      if (map.current) {
        // Remove existing route layer if it exists
        if (map.current.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }

        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeData.geometry
            }
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4A90E2',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        // Fit the map to show the entire route
        const bounds = routeData.geometry.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new maplibregl.LngLatBounds(routeData.geometry[0], routeData.geometry[0]));

        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
      }

      setRoute(routeData);
    } catch (err) {
      console.error('Route calculation error:', err);
      setError('Failed to calculate safe route');
    } finally {
      setLoading(false);
    }
  };

  const resetRoute = () => {
    setStartLocation(null);
    setEndLocation(null);
    setRoute(null);
    if (map.current && map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-80">
      <div className="bg-gray-900/95 rounded-lg shadow-lg border border-gray-800/50 backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => {
              setRouteMode(!routeMode);
              resetRoute();
            }}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              routeMode
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {routeMode ? 'Route Mode' : 'Search Mode'}
          </button>
          {routeMode && (
            <button
              onClick={resetRoute}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              Reset
            </button>
          )}
        </div>

        {routeMode && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-300">
                {startLocation ? startLocation.text : 'Select start location'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-300">
                {endLocation ? endLocation.text : 'Select end location'}
              </span>
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={
              routeMode
                ? `Search for ${!startLocation ? 'start' : 'end'} location`
                : 'Search for a location'
            }
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
          />

          {loading && (
            <div className="absolute right-3 top-2">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-gray-900 rounded-lg border border-gray-800 shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleLocationSelect(result)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-800 text-gray-300 text-sm"
                >
                  {result.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-2 text-red-500 text-sm">{error}</div>
        )}

        {route && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <h3 className="text-white font-medium mb-2">Route Details</h3>
            <div className="text-sm text-gray-300">
              <div>Distance: {(route.distance / 1000).toFixed(1)} km</div>
              <div>Duration: {Math.round(route.duration / 60)} minutes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch; 