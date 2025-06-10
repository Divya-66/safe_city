import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Map as MapIcon, AlertCircle, Users, Phone, Menu, X, LogOut, User } from 'lucide-react';
import Home from './components/Home';
import SafetyMap from './components/SafetyMap';
import IncidentForm from './components/IncidentForm';
import CommunityForum from './components/CommunityForum';
import EmergencyServices from './components/EmergencyServices';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { login, logout } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const handleLogin = async (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white">SafetyNet</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <MapIcon className="inline-block w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={() => navigate('/map')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/map'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <MapIcon className="inline-block w-4 h-4 mr-2" />
                Map
              </button>
              <button
                onClick={() => navigate('/report-incident')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/report-incident'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Report Incident
              </button>
              <button
                onClick={() => navigate('/community')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/community'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                Community
              </button>
              <button
                onClick={() => navigate('/emergency-services')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/emergency-services'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Phone className="inline-block w-4 h-4 mr-2" />
                Emergency Services
              </button>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {user?.name || 'User'}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        {user?.phoneNumber}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => {
                  navigate('/');
                  setShowMobileMenu(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <MapIcon className="inline-block w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={() => {
                  navigate('/map');
                  setShowMobileMenu(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/map'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <MapIcon className="inline-block w-4 h-4 mr-2" />
                Map
              </button>
              <button
                onClick={() => {
                  navigate('/report-incident');
                  setShowMobileMenu(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/report-incident'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Report Incident
              </button>
              <button
                onClick={() => {
                  navigate('/community');
                  setShowMobileMenu(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/community'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                Community
              </button>
              <button
                onClick={() => {
                  navigate('/emergency-services');
                  setShowMobileMenu(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/emergency-services'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Phone className="inline-block w-4 h-4 mr-2" />
                Emergency Services
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<SafetyMap />} />
          <Route path="/report-incident" element={<IncidentForm />} />
          <Route path="/community" element={<CommunityForum />} />
          <Route path="/emergency-services" element={<EmergencyServices />} />
        </Routes>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <Login
              onLogin={handleLogin}
              onClose={() => setShowLogin(false)}
              onSwitchToSignUp={() => {
                setShowLogin(false);
                setShowSignUp(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <SignUp
              onSignUpSuccess={(phoneNumber) => {
                setShowSignUp(false);
                setShowLogin(true);
              }}
              onClose={() => setShowSignUp(false)}
              onSwitchToLogin={() => {
                setShowSignUp(false);
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 