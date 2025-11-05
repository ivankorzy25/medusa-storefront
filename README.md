# KOR E-commerce Storefront

Frontend de e-commerce para KOR Generadores, construido con Next.js 15 y conectado a Medusa.js v2 backend.

## 📋 Descripción

Aplicación web moderna para la venta de generadores eléctricos industriales, con catálogo de productos, carrito de compras, y sistema de checkout integrado con Medusa.js.

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Medusa.js v2 (API REST)
- **State Management**: TanStack Query
- **Package Manager**: pnpm

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install
```

## ⚙️ Configuración

1. Crear archivo de environment:
```bash
cp .env.example .env.local
```

2. Configurar variables de entorno:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://192.168.1.100:9000
NEXT_PUBLIC_BASE_URL=http://192.168.1.100:3000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=tu_publishable_key
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 🏗️ Build

```bash
# Compilar para producción
pnpm build

# Iniciar en modo producción
pnpm start
```

## 📁 Estructura del Proyecto

```
storefront/
├── src/
│   ├── app/              # App Router pages
│   │   ├── producto/     # Página de productos
│   │   └── ...
│   ├── components/       # Componentes React
│   │   ├── products/     # Componentes de productos
│   │   └── ui/           # shadcn/ui components
│   └── lib/              # Utilidades y helpers
│       ├── medusa-client.ts  # Cliente Medusa SDK
│       └── format-price.ts   # Formateo de precios
├── public/               # Archivos estáticos
└── next.config.ts        # Configuración Next.js
```

## 🔗 Integración con Backend

El storefront se conecta al backend Medusa.js mediante:
- **API**: Store API de Medusa v2
- **SDK**: @medusajs/js-sdk
- **Region**: USD (United States)

## 🎨 Características

- ✅ Catálogo de productos con búsqueda
- ✅ Páginas de detalle de producto con galería de imágenes
- ✅ Especificaciones técnicas completas
- ✅ Sistema de precios con/sin impuestos
- ✅ Diseño responsive
- ✅ Dark mode support
- 🚧 Carrito de compras (en desarrollo)
- 🚧 Checkout (en desarrollo)
- 🚧 Sistema de autenticación (en desarrollo)

## 📝 Licencia

Privado - KOR Generadores © 2025

---

**Proyecto**: KOR E-commerce
**Desarrollado con**: Claude Code
