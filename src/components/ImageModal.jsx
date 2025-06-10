import React from 'react';
import { X, Maximize2 } from 'lucide-react';

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={image.url}
          alt="Full size"
          className="w-full h-auto rounded-lg shadow-2xl"
        />
        <a
          href={image.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </a>
      </div>
    </div>
  );
};

export default ImageModal; 