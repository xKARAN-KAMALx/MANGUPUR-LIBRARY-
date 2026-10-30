import React, { useState } from 'react';
import { Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { GalleryItem } from '../types.ts';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="gallery" className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F6F26] bg-[#F7F2E6] px-3 py-1 rounded-full border border-[#E1D4B7]">
            Visual Tour
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#173824] mt-2">
            Library Photo Gallery
          </h2>
        </div>
        <span className="text-xs text-[#6B7C71]">
          Reading hall, quiet study corners & facilities in Mangupur
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {galleryItems.map((item) => {
          const hasError = imageErrors[item.id];
          return (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-[#DFDBCF] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="aspect-[16/10] bg-[#ECE8DC] relative overflow-hidden flex items-center justify-center">
                {!hasError ? (
                  <img
                    src={item.imageUrl}
                    alt={item.caption}
                    onError={() => handleImageError(item.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  // Graceful fallback when image file is missing
                  <div className="p-4 text-center text-[#55695C] space-y-2">
                    <BookOpen className="w-8 h-8 mx-auto text-[#B39352]" />
                    <p className="text-xs font-semibold text-[#1B3B2B]">{item.caption}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-[#E2DDCF] text-[#4A5E50]">
                      Mangupur Self-Study Space
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-2 rounded-full bg-white/90 text-[#173824] shadow-sm transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {item.category && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium tracking-wide">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="p-3 bg-white flex-1 flex flex-col justify-center">
                <p className="text-xs font-medium text-[#25392D] line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-[#18271E] rounded-2xl overflow-hidden border border-[#3E5545] shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              aria-label="Close image modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] bg-black/90 flex items-center justify-center">
              {!imageErrors[selectedImage.id] ? (
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.caption}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="p-8 text-center text-[#D6DEC] space-y-3">
                  <BookOpen className="w-12 h-12 mx-auto text-[#D4AF37]" />
                  <p className="text-base font-serif text-white">{selectedImage.caption}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#142319] text-[#FAF9F5] flex items-center justify-between border-t border-[#294231]">
              <div>
                <p className="text-sm font-medium">{selectedImage.caption}</p>
                {selectedImage.category && (
                  <span className="text-[11px] text-[#A6C0AF]">{selectedImage.category}</span>
                )}
              </div>
              <span className="text-xs text-[#D4AF37] font-semibold">Mangupur Library</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
