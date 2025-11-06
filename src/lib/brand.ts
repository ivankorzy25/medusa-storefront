/**
 * KOR - Branding Configuration
 * Soluciones Energéticas Profesionales
 */

export const BRAND = {
  // Company Info
  name: "KOR",
  fullName: "KOR - Soluciones Energéticas Profesionales",
  commercialName: "GENERADORES EN LÍNEA",
  tagline: "Venta, Alquiler y Servicio Técnico Multimarca - Todas las Potencias",

  // Contact
  phone: "+54 11 3956-3099",
  phoneDisplay: "+54 11 3956-3099",
  email: "info@generadores.ar",
  website: "www.generadores.ar",

  // Colors
  colors: {
    primary: "#FF6B00",        // Naranja KOR
    secondary: "#FFB300",      // Amarillo/Dorado
    accent: "#FF8C00",         // Naranja medio
    dark: "#000000",           // Negro
    light: "#FFFFFF",          // Blanco
  },

  // Logos
  logos: {
    main: "/logos/kor-logo-3d-final.png",  // Logo K 3D con degradado final
    simple: "/logos/kor-logo.png",         // Logo K 3D simple
    full: "/logos/kor-innovacion.png",     // Logo completo con INNOVACIÓN
  },

  // Services
  services: [
    "Venta de Grupos Electrógenos",
    "Alquiler de Equipos",
    "Servicio Técnico Especializado",
  ],

  // USPs (Unique Selling Points)
  usps: [
    "Todas las marcas disponibles",
    "Todas las potencias",
    "Presupuestos sin cargo en 24hs",
    "Atención inmediata para emergencias",
  ],

  // Social/Contact Links
  whatsapp: "5491139563099",  // Sin símbolos para URL
  whatsappDisplay: "+54 11 3956-3099",
} as const;

// Tailwind class helpers
export const brandColors = {
  primary: "bg-[#FF6B00]",
  primaryHover: "hover:bg-[#FF8C00]",
  primaryText: "text-[#FF6B00]",
  secondary: "bg-[#FFB300]",
  secondaryText: "text-[#FFB300]",
  gradient: "bg-gradient-to-r from-[#FF6B00] to-[#FFB300]",
  gradientReverse: "bg-gradient-to-r from-[#FFB300] to-[#FF6B00]",
} as const;
