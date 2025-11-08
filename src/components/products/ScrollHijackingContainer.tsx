"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollHijackingContainerProps {
  imageContent: React.ReactNode;
  centerContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export function ScrollHijackingContainer({
  imageContent,
  centerContent,
  rightContent,
}: ScrollHijackingContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollVelocity = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    let lastScrollTime = Date.now();
    let targetScroll = 0;

    const smoothScroll = () => {
      if (!contentRef.current) return;

      const contentContainer = contentRef.current;
      const currentScroll = contentContainer.scrollTop;
      const diff = targetScroll - currentScroll;

      if (Math.abs(diff) > 0.5) {
        // Easing con momentum (ease-out)
        const delta = diff * 0.15; // Factor de suavizado más agresivo
        contentContainer.scrollTop += delta;

        // Continuar la animación
        animationFrameId.current = requestAnimationFrame(smoothScroll);
      } else {
        // Fijar posición final
        contentContainer.scrollTop = targetScroll;
        animationFrameId.current = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!contentRef.current) return;

      const contentContainer = contentRef.current;
      const hasScrollableContent = contentContainer.scrollHeight > contentContainer.clientHeight;

      if (!hasScrollableContent) return;

      e.preventDefault();

      const now = Date.now();
      const timeDelta = now - lastScrollTime;
      lastScrollTime = now;

      // Calcular velocidad basada en deltaY y tiempo
      const speedMultiplier = Math.min(timeDelta / 16, 2); // Normalizar a ~60fps
      const scrollAmount = e.deltaY * speedMultiplier;

      // Actualizar target scroll con límites
      targetScroll = Math.max(
        0,
        Math.min(
          contentContainer.scrollHeight - contentContainer.clientHeight,
          targetScroll + scrollAmount
        )
      );

      // Iniciar animación suave si no está corriendo
      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(smoothScroll);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Grid estilo MercadoLibre: medidas exactas en px */}
      <div className="flex gap-8 justify-center">
        {/* Left Column - Image Gallery (becomes sticky) - 478px */}
        <div
          ref={imageRef}
          className="lg:sticky lg:top-24 lg:self-start flex-shrink-0"
          style={{ width: '478px', height: '504px' }}
        >
          {imageContent}
        </div>

        {/* Right Side - Scrollable content container */}
        <div
          ref={contentRef}
          className="overflow-y-auto flex-shrink-0 scrollbar-hide"
          style={{
            width: 'calc(100% - 478px - 32px)', // Resto del espacio menos galería y gap
            maxWidth: '819px', // Panel info (descripción + precio) max
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          <div className="flex gap-8">
            {/* Center Column - Description - flex para ocupar espacio disponible */}
            <div className="flex-grow space-y-3 min-w-0">
              {centerContent}
            </div>

            {/* Right Column - Price Card - 309px fijo */}
            <div
              className="bg-white border border-[#e0e0e0] rounded-md flex-shrink-0"
              style={{
                width: '309px',
                padding: '25px 16px',
                minHeight: '632px'
              }}
            >
              {rightContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
