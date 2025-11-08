#!/bin/bash

# Script de Backup Automático - Medusa Storefront
# Uso: ./backup.sh "Descripción del backup"

set -e  # Exit on error

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DESCRIPTION="${1:-Backup automático}"
BACKUP_NAME="backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🔄 SISTEMA DE BACKUP AUTOMÁTICO${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Descripción:${NC} ${DESCRIPTION}"
echo -e "${YELLOW}Timestamp:${NC} ${TIMESTAMP}"
echo ""

# Crear directorio de backups si no existe
mkdir -p "${BACKUP_DIR}"
mkdir -p "${BACKUP_PATH}"

# 1. Backup del código fuente
echo -e "${GREEN}[1/4]${NC} Copiando código fuente..."
rsync -av --exclude 'node_modules' \
          --exclude '.next' \
          --exclude 'backups' \
          --exclude '.git' \
          --exclude 'dist' \
          --exclude 'build' \
          ./ "${BACKUP_PATH}/code/" > /dev/null 2>&1

# 2. Backup de la base de datos
echo -e "${GREEN}[2/4]${NC} Exportando base de datos..."
pg_dump postgresql://ivankorzyniewski@localhost:5432/medusa-store > "${BACKUP_PATH}/database.sql"

# 3. Crear archivo de metadata del backup
echo -e "${GREEN}[3/4]${NC} Creando metadata..."
cat > "${BACKUP_PATH}/BACKUP_INFO.txt" << EOF
═══════════════════════════════════════════════════════
BACKUP INFORMACIÓN
═══════════════════════════════════════════════════════

Fecha: $(date "+%Y-%m-%d %H:%M:%S")
Descripción: ${DESCRIPTION}
Timestamp: ${TIMESTAMP}

CONTENIDO:
- Código fuente completo (sin node_modules)
- Base de datos PostgreSQL (medusa-store)
- Documentación
- Scripts SQL
- Configuración

ESTRUCTURA:
${BACKUP_NAME}/
├── code/                 # Código fuente del storefront
├── database.sql         # Dump completo de PostgreSQL
└── BACKUP_INFO.txt      # Este archivo

RESTAURAR:
1. Código: cp -r code/* /path/to/project/
2. Base de datos: psql postgresql://user@localhost:5432/medusa-store < database.sql

═══════════════════════════════════════════════════════
EOF

# 4. Comprimir backup
echo -e "${GREEN}[4/4]${NC} Comprimiendo backup..."
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}/" > /dev/null 2>&1
rm -rf "${BACKUP_NAME}/"
cd ..

# Obtener tamaño del archivo
BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ BACKUP COMPLETADO${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Archivo:${NC} ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo -e "${YELLOW}Tamaño:${NC} ${BACKUP_SIZE}"
echo ""
echo -e "${GREEN}Para restaurar:${NC}"
echo "  tar -xzf ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz -C ${BACKUP_DIR}/"
echo "  cat ${BACKUP_DIR}/${BACKUP_NAME}/BACKUP_INFO.txt"
echo ""
