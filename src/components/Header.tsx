"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Phone, Mail } from "lucide-react";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Solo mostrar si está muy cerca del top de la página (menos de 20px)
      if (currentScrollY < 20) {
        setIsVisible(true);
      }
      // Si scrollea hacia abajo, ocultar inmediatamente después de 20px
      else if (currentScrollY > lastScrollY && currentScrollY >= 20) {
        setIsVisible(false);
      }
      // Si scrollea hacia arriba pero aún está lejos del top, mantener oculto
      else if (currentScrollY < lastScrollY && currentScrollY >= 20) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  // Detectar cuando se abre el lightbox
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLightboxOpen(document.body.classList.contains('lightbox-open'));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full shadow-lg transition-transform duration-700 ease-in-out ${(isVisible && !isLightboxOpen) ? "translate-y-0" : "-translate-y-full"}`}>
      {/* Top bar with contact info */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-1">
          <div className="flex flex-wrap items-center justify-between text-[10px]">
            <div className="flex items-center gap-3">
              <a
                href={`tel:${BRAND.phone}`}
                className="flex items-center gap-1 hover:underline text-white/90 hover:text-white"
              >
                <Phone className="w-2.5 h-2.5" />
                <span className="font-semibold">{BRAND.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="hidden sm:flex items-center gap-1 hover:underline text-white/90 hover:text-white"
              >
                <Mail className="w-2.5 h-2.5" />
                <span>{BRAND.email}</span>
              </a>
            </div>
            <div className="text-[10px] text-white/90 font-semibold">
              {BRAND.usps[2]} {/* Presupuestos sin cargo en 24hs */}
            </div>
          </div>
        </div>
      </div>

      {/* Main header - Clean white background */}
      <div className="bg-white border-b-2 border-[#FF6B00]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-14 h-14 md:w-16 md:h-16 transition-transform group-hover:scale-105">
                <Image
                  src={BRAND.logos.main}
                  alt={`${BRAND.name} Logo`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-wide leading-tight">
                  {BRAND.name}
                </h1>
                <p className="text-xs md:text-sm font-bold text-[#FF6B00] tracking-normal">
                  {BRAND.commercialName}
                </p>
              </div>
            </Link>

            {/* Company Info - Center/Right */}
            <div className="hidden lg:flex flex-col items-end flex-grow">
              <h2 className="text-base font-bold text-gray-900 mb-1">
                {BRAND.tagline}
              </h2>
              <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm text-gray-700">
                {BRAND.services.map((service, index) => (
                  <span key={index} className="font-medium">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF6B00] hover:bg-[#FF8C00] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-sm md:text-base shadow-md transition-all hover:scale-105 hover:shadow-lg flex-shrink-0"
            >
              Consultar
            </a>
          </div>
        </div>
      </div>

      {/* Company Info - Mobile */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <p className="text-xs text-center text-gray-800 font-semibold mb-1">
            {BRAND.tagline}
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 text-[10px] text-gray-600">
            {BRAND.services.map((service, index) => (
              <span key={index}>{service}</span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
