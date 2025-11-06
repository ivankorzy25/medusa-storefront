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

  useEffect(() => {
    let ticking = false;

    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current || !imageRef.current || !contentRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const imageRect = imageRef.current!.getBoundingClientRect();
          const contentContainer = contentRef.current!;

          // Verificar si la imagen está completamente visible y sticky
          const imageIsSticky = imageRect.top <= 96 && imageRect.top >= 0; // 96px = top-24 (6rem)
          const imageFullyVisible = imageRect.bottom > 0 && imageRect.top < window.innerHeight;

          // Verificar si el contenido tiene scroll disponible
          const hasScrollableContent = contentContainer.scrollHeight > contentContainer.clientHeight;
          const isAtTop = contentContainer.scrollTop <= 0;
          const isAtBottom = contentContainer.scrollTop + contentContainer.clientHeight >= contentContainer.scrollHeight - 5;

          // Solo hijack si la imagen está sticky y hay contenido para scrollear
          if (imageIsSticky && imageFullyVisible && hasScrollableContent) {
            // Scrolleando hacia abajo y no está al final
            if (e.deltaY > 0 && !isAtBottom) {
              e.preventDefault();
              contentContainer.scrollTop += e.deltaY;
            }
            // Scrolleando hacia arriba y no está al principio
            else if (e.deltaY < 0 && !isAtTop) {
              e.preventDefault();
              contentContainer.scrollTop += e.deltaY;
            }
          }

          ticking = false;
        });

        ticking = true;
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
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="grid lg:grid-cols-[45%_55%] gap-6">
        {/* Left Column - Image (becomes sticky) */}
        <div ref={imageRef} className="lg:sticky lg:top-24 lg:self-start">
          {imageContent}
        </div>

        {/* Right Side - Scrollable content container */}
        <div
          ref={contentRef}
          className="overflow-y-auto"
          style={{
            maxHeight: "calc(100vh - 120px)",
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 transparent",
          }}
        >
          <div className="grid lg:grid-cols-[60%_40%] gap-6">
            {/* Center Column - Description */}
            <div>
              {centerContent}
            </div>

            {/* Right Column - Price */}
            <div className="space-y-4 max-w-full overflow-hidden">
              {rightContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
