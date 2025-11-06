"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageCarouselProps {
  images: Array<{
    id: string;
    url: string;
    rank: number;
  }>;
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 text-sm">Sin imágenes disponibles</p>
      </div>
    );
  }

  const maxVisibleThumbnails = 7;
  const remainingImages = images.length - maxVisibleThumbnails;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    // Ocultar el header cuando se abre el lightbox
    document.body.classList.add('lightbox-open');
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    // Mostrar el header cuando se cierra el lightbox
    document.body.classList.remove('lightbox-open');
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
    <div className="flex gap-3 w-full">
      {/* Thumbnails - Vertical Left */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2 flex-shrink-0">
          {images.slice(0, maxVisibleThumbnails).map((image, index) => (
            <button
              key={image.id}
              onClick={() => scrollTo(index)}
              className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden transition-all bg-[#FDFBF7] ${
                index === selectedIndex
                  ? "ring-2 ring-blue-500"
                  : "ring-1 ring-gray-300 hover:ring-gray-400 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image.url}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-contain p-1"
                style={{ filter: 'brightness(0.9)' }}
              />
            </button>
          ))}

          {/* Botón +N para imágenes restantes */}
          {remainingImages > 0 && (
            <button
              onClick={() => openLightbox(maxVisibleThumbnails)}
              className="relative flex-shrink-0 w-12 h-12 rounded overflow-hidden transition-all ring-1 ring-gray-300 hover:ring-gray-400 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <span className="text-sm font-semibold text-gray-700">+{remainingImages}</span>
            </button>
          )}
        </div>
      )}

      {/* Main Carousel */}
      <div className="flex-1 min-w-0">
        <div className="relative w-full">
          <div className="overflow-hidden rounded bg-white border border-gray-200" ref={emblaRef}>
            <div className="flex">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative min-w-0 flex-[0_0_100%] cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="w-full aspect-square">
                    <img
                      src={image.url}
                      alt={`${title} - Imagen ${image.rank + 1}`}
                      className="w-full h-full object-contain p-6"
                      style={{ filter: 'brightness(0.9)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-1.5 rounded-full shadow-md transition-all z-10 border border-gray-200"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-1.5 rounded-full shadow-md transition-all z-10 border border-gray-200"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Lightbox Modal */}
    {isLightboxOpen && (
      <div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={closeLightbox}
      >
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          aria-label="Cerrar"
        >
          <X className="w-8 h-8" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            prevLightboxImage();
          }}
          className="absolute left-4 text-white hover:text-gray-300 z-50"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>

        <div
          className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[lightboxIndex].url}
            alt={`${title} - Imagen ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            style={{ filter: 'brightness(0.9)' }}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextLightboxImage();
          }}
          className="absolute right-4 text-white hover:text-gray-300 z-50"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-10 h-10" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
          {lightboxIndex + 1} / {images.length}
        </div>
      </div>
    )}
    </>
  );
}
