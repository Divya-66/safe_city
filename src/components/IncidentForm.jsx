import React, { useState } from 'react';
import { FileText, Camera, MapPin, AlertTriangle, Clock, Send, Loader2, X } from 'lucide-react';
import { uploadImage } from '../services/awsS3Service';
import { sendIncidentNotification } from '../services/snsService';
import UploadedImages from './UploadedImages';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const IncidentForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
    date: '',
    time: '',
    severity: 'medium',
    images: []
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(`File ${file.name} has an unsupported format. Please upload JPG or PNG files only.`);
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      try {
        if (validateFile(file)) {
          validFiles.push(file);
        }
      } catch (error) {
        errors.push(error.message);
      }
    });

    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    setUploadError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);

    try {
      if (formData.images.length === 0) {
        throw new Error('Please upload at least one image');
      }

      // Upload images to S3
      const imageUrls = await Promise.all(
        formData.images.map(file => uploadImage(file))
      );

      // Create incident data with image URLs
      const incidentData = {
        ...formData,
        imageUrls,
        timestamp: new Date().toISOString()
      };

      // Send SNS notification
      await sendIncidentNotification(incidentData);

      // Add uploaded images to state
      const newUploadedImages = imageUrls.map(url => ({
        url,
        timestamp: new Date().toISOString()
      }));
      setUploadedImages(prev => [...prev, ...newUploadedImages]);

      // Handle form submission
      console.log('Form submitted:', incidentData);
      // TODO: Send incident data to your backend
      
      // Clear form after successful submission
      setFormData({
        type: '',
        description: '',
        location: '',
        date: '',
        time: '',
        severity: 'medium',
        images: []
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setUploadError(error.message || 'Failed to submit report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeUploadedImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full px-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
          <AlertTriangle size={24} />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
          Report Incident
        </h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Incident Type */}
            <div className="card">
              <label className="block text-gray-400 text-sm mb-2">Incident Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Type</option>
                <option value="theft">Theft</option>
                <option value="harassment">Harassment</option>
                <option value="vandalism">Vandalism</option>
                <option value="suspicious">Suspicious Activity</option>
                <option value="assault">Assault</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Severity */}
            <div className="card">
              <label className="block text-gray-400 text-sm mb-2">Severity Level</label>
              <div className="flex space-x-4">
                {['low', 'medium', 'high'].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="severity"
                      value={level}
                      checked={formData.severity === level}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className={`
                      px-4 py-2 rounded-lg border transition-all duration-200
                      ${formData.severity === level
                        ? level === 'high'
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : level === 'medium'
                            ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                            : 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600'
                      }
                    `}>
                      <span className="capitalize">{level}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="card">
              <label className="block text-gray-400 text-sm mb-2">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Date and Time
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <label className="block text-gray-400 text-sm mb-2">
                <MapPin className="inline-block w-4 h-4 mr-2" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location or use current location"
                className="input-field w-full"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <label className="block text-gray-400 text-sm mb-2">
              <AlertTriangle className="inline-block w-4 h-4 mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description of the incident..."
              className="input-field w-full h-32 resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="card">
            <label className="block text-gray-400 text-sm mb-2">
              <Camera className="inline-block w-4 h-4 mr-2" />
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-400">Click to upload images</p>
                <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB each</p>
              </label>
            </div>

            {/* Preview of images to be uploaded */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm text-gray-400 mb-2">Images to be uploaded:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800/50">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm text-gray-400 mb-2">Uploaded Images:</h3>
                <UploadedImages 
                  images={uploadedImages} 
                  onRemove={removeUploadedImage}
                />
              </div>
            )}

            {uploadError && (
              <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500 whitespace-pre-line">{uploadError}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button type="button" className="btn-secondary" disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm; 