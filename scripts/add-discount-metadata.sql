-- ============================================================================
-- SCRIPT PARA AGREGAR/QUITAR DESCUENTO PROMOCIONAL AL PRODUCTO
-- ============================================================================
-- Este script agrega metadata de descuento al producto CS200A
-- Úsalo para probar el sistema de descuentos dinámico
--
-- EJECUTAR: psql postgresql://ivankorzyniewski@localhost:5432/medusa-store -f scripts/add-discount-metadata.sql
-- ============================================================================

\set ON_ERROR_STOP on

BEGIN;

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📊 AGREGAR DESCUENTO PROMOCIONAL AL PRODUCTO CS200A'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

-- ============================================================================
-- OPCIÓN 1: AGREGAR DESCUENTO 42% (ejemplo MercadoLibre)
-- ============================================================================
-- Descomenta estas líneas para agregar un descuento del 42%

-- UPDATE product
-- SET metadata = jsonb_set(
--   metadata,
--   '{descuento_porcentaje}',
--   '42'
-- )
-- WHERE id = 'prod_cs200a_73150acc-b0b6-413b-8f55-2497142ba4f0';

-- UPDATE product
-- SET metadata = jsonb_set(
--   metadata,
--   '{precio_anterior}',
--   '72850000'
-- )
-- WHERE id = 'prod_cs200a_73150acc-b0b6-413b-8f55-2497142ba4f0';

-- \echo '✅ Descuento 42% agregado al producto CS200A'
-- \echo '   - Precio anterior: ARS $72.850.000'
-- \echo '   - Precio actual: ARS $42.171.104'
-- \echo '   - Descuento: 42% OFF'

-- ============================================================================
-- OPCIÓN 2: QUITAR DESCUENTO (volver a precio normal)
-- ============================================================================
-- Descomenta estas líneas para QUITAR el descuento

UPDATE product
SET metadata = metadata - 'descuento_porcentaje' - 'precio_anterior'
WHERE id = 'prod_cs200a_73150acc-b0b6-413b-8f55-2497142ba4f0';

\echo '✅ Descuento removido del producto CS200A'
\echo '   - Ahora muestra precio normal sin badge "OFERTA DEL DÍA"'

-- ============================================================================
-- VERIFICAR METADATA ACTUAL
-- ============================================================================

\echo ''
\echo '📋 Metadata actual del producto:'
\echo ''

SELECT
  id,
  title,
  metadata->'descuento_porcentaje' as descuento,
  metadata->'precio_anterior' as precio_anterior
FROM product
WHERE id = 'prod_cs200a_73150acc-b0b6-413b-8f55-2497142ba4f0';

COMMIT;

\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '✅ COMPLETADO'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''
\echo 'IMPORTANTE:'
\echo '1. Reinicia el Medusa backend para aplicar cambios'
\echo '2. Recarga la página en http://localhost:3000/producto/cummins-cs200a'
\echo '3. Para AGREGAR descuento: comenta líneas 32-34, descomenta 17-29'
\echo '4. Para QUITAR descuento: deja como está (líneas 32-34 activas)'
\echo ''
