import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

/**
 * ImageModal Component - High Quality Image Lightbox
 * Features:
 * - Fullscreen dark backdrop with blur effect
 * - Close on 'Esc' key press
 * - Close on backdrop click or Close (X) button
 * - Support for single image or image list with gallery navigation (arrows / left-right keys)
 */
export default function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  images = [],
  initialIndex = 0,
  title = ''
}) {
  const allImages = images && images.length > 0 ? images : imageSrc ? [imageSrc] : [];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index when initialIndex or imageSrc changes
  useEffect(() => {
    if (images && images.length > 0) {
      setCurrentIndex(initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0);
    } else {
      setCurrentIndex(0);
    }
  }, [isOpen, imageSrc, images, initialIndex]);

  // Handle ESC key press and Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && allImages.length > 1) {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
      } else if (e.key === 'ArrowRight' && allImages.length > 1) {
        setCurrentIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scrolling while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, allImages.length]);

  if (!isOpen || allImages.length === 0) return null;

  const currentImage = allImages[currentIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      {/* Top Bar with Title & Close Button */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 px-2 sm:px-6">
        <div className="text-white/90 text-sm sm:text-base font-medium truncate max-w-[70%] drop-shadow-md">
          {title ? title : `Image ${currentIndex + 1} of ${allImages.length}`}
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all border border-white/20 shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
          title="Close (Press Esc)"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>
      </div>

      {/* Prev Navigation Button */}
      {allImages.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-all z-10 border border-white/20 shadow-lg cursor-pointer"
          title="Previous Image (Left Arrow)"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Center Image Container */}
      <div
        className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking the image frame
      >
        <img
          src={currentImage}
          alt={title || `Product View ${currentIndex + 1}`}
          className="max-w-[90vw] max-h-[82vh] object-contain rounded-md shadow-2xl border border-white/15 transition-transform duration-200 hover:scale-[1.01]"
        />
      </div>

      {/* Next Navigation Button */}
      {allImages.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-all z-10 border border-white/20 shadow-lg cursor-pointer"
          title="Next Image (Right Arrow)"
          aria-label="Next image"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Bottom Gallery Thumbnails Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
        {allImages.map((img, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === idx ? 'bg-gold w-6' : 'bg-white/40 hover:bg-white/80'
            }`}
            title={`View image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
