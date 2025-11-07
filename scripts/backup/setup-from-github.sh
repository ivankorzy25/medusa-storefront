#!/bin/bash

# Setup Script para Medusa Storefront desde GitHub
# Restaura el proyecto completo desde GitHub

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Medusa Storefront - Setup desde GitHub${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. Verificar Node.js
echo -e "${BLUE}[1/4] 🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}   ✗ Node.js no está instalado${NC}"
    echo -e "${YELLOW}   💡 Instala Node.js v20 usando NVM${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}   ✓ Node.js $NODE_VERSION${NC}"
echo ""

# 2. Instalar dependencias
echo -e "${BLUE}[2/4] 📦 Instalando dependencias...${NC}"
if [ -f "package-lock.json" ]; then
    npm install
elif [ -f "pnpm-lock.yaml" ]; then
    pnpm install
else
    npm install
fi
echo -e "${GREEN}   ✓ Dependencias instaladas${NC}"
echo ""

# 3. Verificar archivo .env.local
echo -e "${BLUE}[3/4] 🔧 Verificando configuración...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}   ⚠️  Archivo .env.local no encontrado${NC}"
    echo -e "${YELLOW}   💡 Creando .env.local de ejemplo...${NC}"

    cat > .env.local << 'EOF'
# Backend URL - ajusta según tu configuración
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable Key - obtén esto del backend
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=

# Base URL del storefront
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF

    echo -e "${YELLOW}   ⚠️  Por favor configura .env.local con tus valores${NC}"
else
    echo -e "${GREEN}   ✓ Archivo .env.local existe${NC}"
fi
echo ""

# 4. Dar permisos de ejecución a scripts
echo -e "${BLUE}[4/4] 🔐 Configurando permisos...${NC}"
chmod +x scripts/backup/*.sh
echo -e "${GREEN}   ✓ Permisos configurados${NC}"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Setup Completado${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🚀 Comandos disponibles:${NC}"
echo -e "${BLUE}   npm run dev         ${NC} - Iniciar servidor de desarrollo"
echo -e "${BLUE}   npm run build       ${NC} - Construir para producción"
echo -e "${BLUE}   npm run backup      ${NC} - Hacer backup manual"
echo -e "${BLUE}   npm run backup:watch${NC} - Activar watcher automático"
echo ""
echo -e "${YELLOW}⚠️  Recuerda configurar .env.local antes de ejecutar${NC}"
echo ""
