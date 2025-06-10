import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import ImageModal from './ImageModal';
import { deleteImage } from '../services/awsS3Service';

const UploadedImages = ({ images, onRemove }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleDelete = async (index) => {
    setDeletingIndex(index);
    try {
      const image = images[index];
      // Extract key from URL
      const key = image.url.split('.amazonaws.com/')[1];
      await deleteImage(key);
      onRemove(index);
    } catch (error) {
      console.error('Error deleting image:', error);
      // You might want to show an error message to the user here
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-800/50 cursor-pointer group"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image.url}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(index);
              }}
              className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
              disabled={deletingIndex === index}
            >
              {deletingIndex === index ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <X className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        ))}
      </div>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

export default UploadedImages; 