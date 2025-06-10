import React, { useState } from 'react';
import { login, forgotPassword, confirmForgotPassword } from '../services/authService';
import { Phone, Lock, CheckCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as +91 XXXXXXXXXX
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    try {
      const user = await login(`+91${phoneNumber}`, password);
      onLogin(user);
    } catch (error) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    try {
      await forgotPassword(`+91${phoneNumber}`);
      setShowNewPassword(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmForgotPassword(`+91${phoneNumber}`, verificationCode, newPassword);
      setShowForgotPassword(false);
      setShowNewPassword(false);
      setVerificationCode('');
      setNewPassword('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showNewPassword) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <CheckCircle size={24} />
          </div>
          <h2 className="text-xl font-bold">Reset Password</h2>
        </div>

        <form onSubmit={handleConfirmForgotPassword} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="input-field w-full"
              required
              placeholder="Enter the code sent to your phone"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            <Phone className="inline-block w-4 h-4 mr-2" />
            Phone Number
          </label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-gray-700 text-gray-300 rounded-l-lg">+91</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              className="input-field rounded-r-lg"
              required
              placeholder="XXXXXXXXXX"
              maxLength={10}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            <Lock className="inline-block w-4 h-4 mr-2" />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Forgot Password?
        </button>
      </form>

      {showForgotPassword && (
        <div className="mt-6">
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                <Phone className="inline-block w-4 h-4 mr-2" />
                Phone Number
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-gray-700 text-gray-300 rounded-l-lg">+91</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  className="input-field rounded-r-lg"
                  required
                  placeholder="XXXXXXXXXX"
                  maxLength={10}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              Back to Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login; 