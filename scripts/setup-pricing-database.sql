-- ============================================================================
-- SCRIPT DE CONFIGURACIÓN AUTOMÁTICA DEL SISTEMA DE PRICING MULTI-CANAL
-- ============================================================================
-- Crea Customer Groups, Price Lists y actualiza precios para CS200A
--
-- EJECUTAR: psql postgresql://ivankorzyniewski@localhost:5432/medusa-store -f scripts/setup-pricing-database.sql
-- ============================================================================

\set ON_ERROR_STOP on

-- Variables del producto CS200A
\set product_id 'prod_cs200a_73150acc-b0b6-413b-8f55-2497142ba4f0'
\set variant_id 'variant_9173cb95160e3448'

BEGIN;

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📋 PASO 1: CREAR CUSTOMER GROUPS'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

-- Limpiar customer groups existentes (solo para testing)
DELETE FROM customer_group WHERE name IN ('MercadoLibre', 'Público General', 'Mayorista');

-- Crear Customer Group: MercadoLibre
INSERT INTO customer_group (id, name, metadata, created_at, updated_at)
VALUES (
  'cgrp_mercadolibre_' || substr(md5(random()::text), 1, 16),
  'MercadoLibre',
  '{"description":"Clientes de MercadoLibre - Precio competitivo","channel":"mercadolibre","discount_type":"promotional"}'::jsonb,
  NOW(),
  NOW()
)
RETURNING id, name;

-- Guardar ID en variable
\gset mercadolibre_

-- Crear Customer Group: Público General
INSERT INTO customer_group (id, name, metadata, created_at, updated_at)
VALUES (
  'cgrp_publico_' || substr(md5(random()::text), 1, 16),
  'Público General',
  '{"description":"Clientes de web pública - Precio lista","channel":"web","discount_type":"none"}'::jsonb,
  NOW(),
  NOW()
)
RETURNING id, name;

\gset publico_

-- Crear Customer Group: Mayorista
INSERT INTO customer_group (id, name, metadata, created_at, updated_at)
VALUES (
  'cgrp_mayorista_' || substr(md5(random()::text), 1, 16),
  'Mayorista',
  '{"description":"Clientes mayoristas - Contacto directo","channel":"direct","discount_type":"wholesale"}'::jsonb,
  NOW(),
  NOW()
)
RETURNING id, name;

\gset mayorista_

\echo ''
\echo '✅ Customer Groups creados:'
\echo '   - MercadoLibre: ' :mercadolibre_id
\echo '   - Público: ' :publico_id
\echo '   - Mayorista: ' :mayorista_id
\echo ''

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '💰 PASO 2: ACTUALIZAR PRECIO BASE DEL PRODUCTO'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

-- Actualizar el precio base en la tabla price de USD 25,000 a USD 26,411
UPDATE price
SET amount = 2641100,  -- USD 26,411 en centavos
    updated_at = NOW()
WHERE id IN (
  SELECT p.id
  FROM price p
  JOIN price_set ps ON p.price_set_id = ps.id
  JOIN variant v ON v.price_set_id = ps.id
  WHERE v.id = :'variant_id'
  AND p.currency_code = 'usd'
);

\echo ''
\echo '✅ Precio base actualizado: USD 25,000 → USD 26,411'
\echo ''

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📊 PASO 3: CREAR PRICE LISTS Y PRECIOS POR CUSTOMER GROUP'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

-- Obtener price_set_id del variant
SELECT price_set_id INTO TEMP TABLE variant_priceset
FROM variant
WHERE id = :'variant_id';

-- ============================================================================
-- PRICE LIST 1: MERCADOLIBRE (USD 25,090 - 5% descuento)
-- ============================================================================

INSERT INTO price_list (
  id,
  title,
  description,
  type,
  status,
  created_at,
  updated_at
) VALUES (
  'plist_ml_cs200a_' || substr(md5(random()::text), 1, 16),
  'Precios MercadoLibre - CS200A',
  'Precios competitivos para canal MercadoLibre',
  'override',
  'active',
  NOW(),
  NOW()
)
RETURNING id;

\gset plist_ml_

-- Crear precio para MercadoLibre
INSERT INTO price (
  id,
  price_list_id,
  price_set_id,
  currency_code,
  amount,
  min_quantity,
  max_quantity,
  rules_count,
  created_at,
  updated_at
)
SELECT
  'price_ml_cs200a_' || substr(md5(random()::text), 1, 16),
  :'plist_ml_id',
  price_set_id,
  'usd',
  2509000,  -- USD 25,090 en centavos
  1,
  NULL,
  1,
  NOW(),
  NOW()
FROM variant_priceset;

-- Crear price_rule para asociar con customer group
INSERT INTO price_rule (
  id,
  price_id,
  attribute,
  value,
  priority,
  created_at,
  updated_at
)
SELECT
  'prule_ml_' || substr(md5(random()::text), 1, 16),
  p.id,
  'customer_group_id',
  :'mercadolibre_id',
  0,
  NOW(),
  NOW()
FROM price p
WHERE p.price_list_id = :'plist_ml_id';

\echo ''
\echo '✅ Price List MercadoLibre: USD 25,090 (5% off)'
\echo ''

-- ============================================================================
-- PRICE LIST 2: PÚBLICO (USD 26,411 - precio lista)
-- ============================================================================

INSERT INTO price_list (
  id,
  title,
  description,
  type,
  status,
  created_at,
  updated_at
) VALUES (
  'plist_pub_cs200a_' || substr(md5(random()::text), 1, 16),
  'Precios Público - CS200A',
  'Precio lista para público general',
  'override',
  'active',
  NOW(),
  NOW()
)
RETURNING id;

\gset plist_pub_

INSERT INTO price (
  id,
  price_list_id,
  price_set_id,
  currency_code,
  amount,
  min_quantity,
  max_quantity,
  rules_count,
  created_at,
  updated_at
)
SELECT
  'price_pub_cs200a_' || substr(md5(random()::text), 1, 16),
  :'plist_pub_id',
  price_set_id,
  'usd',
  2641100,  -- USD 26,411 en centavos
  1,
  NULL,
  1,
  NOW(),
  NOW()
FROM variant_priceset;

INSERT INTO price_rule (
  id,
  price_id,
  attribute,
  value,
  priority,
  created_at,
  updated_at
)
SELECT
  'prule_pub_' || substr(md5(random()::text), 1, 16),
  p.id,
  'customer_group_id',
  :'publico_id',
  0,
  NOW(),
  NOW()
FROM price p
WHERE p.price_list_id = :'plist_pub_id';

\echo '✅ Price List Público: USD 26,411 (precio lista)'
\echo ''

-- ============================================================================
-- PRICE LIST 3: MAYORISTA CONTADO (USD 21,390 - 19% off)
-- ============================================================================

INSERT INTO price_list (
  id,
  title,
  description,
  type,
  status,
  created_at,
  updated_at
) VALUES (
  'plist_may_cont_cs200a_' || substr(md5(random()::text), 1, 16),
  'Precios Mayorista Contado - CS200A',
  'Precio mayorista con pago contado (Bonif 11% + Desc 9%)',
  'override',
  'active',
  NOW(),
  NOW()
)
RETURNING id;

\gset plist_may_cont_

INSERT INTO price (
  id,
  price_list_id,
  price_set_id,
  currency_code,
  amount,
  min_quantity,
  max_quantity,
  rules_count,
  created_at,
  updated_at
)
SELECT
  'price_may_cont_cs200a_' || substr(md5(random()::text), 1, 16),
  :'plist_may_cont_id',
  price_set_id,
  'usd',
  2139000,  -- USD 21,390 en centavos
  1,
  NULL,
  1,
  NOW(),
  NOW()
FROM variant_priceset;

INSERT INTO price_rule (
  id,
  price_id,
  attribute,
  value,
  priority,
  created_at,
  updated_at
)
SELECT
  'prule_may_cont_' || substr(md5(random()::text), 1, 16),
  p.id,
  'customer_group_id',
  :'mayorista_id',
  1,  -- Mayor prioridad
  NOW(),
  NOW()
FROM price p
WHERE p.price_list_id = :'plist_may_cont_id';

\echo '✅ Price List Mayorista Contado: USD 21,390 (19% off)'
\echo ''

-- ============================================================================
-- PRICE LIST 4: MAYORISTA FINANCIADO (USD 23,506 - 11% off)
-- ============================================================================

INSERT INTO price_list (
  id,
  title,
  description,
  type,
  status,
  created_at,
  updated_at
) VALUES (
  'plist_may_fin_cs200a_' || substr(md5(random()::text), 1, 16),
  'Precios Mayorista Financiado - CS200A',
  'Precio mayorista financiado (Bonif 11%)',
  'override',
  'active',
  NOW(),
  NOW()
)
RETURNING id;

\gset plist_may_fin_

INSERT INTO price (
  id,
  price_list_id,
  price_set_id,
  currency_code,
  amount,
  min_quantity,
  max_quantity,
  rules_count,
  created_at,
  updated_at
)
SELECT
  'price_may_fin_cs200a_' || substr(md5(random()::text), 1, 16),
  :'plist_may_fin_id',
  price_set_id,
  'usd',
  2350600,  -- USD 23,506 en centavos
  1,
  NULL,
  1,
  NOW(),
  NOW()
FROM variant_priceset;

INSERT INTO price_rule (
  id,
  price_id,
  attribute,
  value,
  priority,
  created_at,
  updated_at
)
SELECT
  'prule_may_fin_' || substr(md5(random()::text), 1, 16),
  p.id,
  'customer_group_id',
  :'mayorista_id',
  0,  -- Menor prioridad que contado
  NOW(),
  NOW()
FROM price p
WHERE p.price_list_id = :'plist_may_fin_id';

\echo '✅ Price List Mayorista Financiado: USD 23,506 (11% off)'
\echo ''

-- Limpiar tabla temporal
DROP TABLE variant_priceset;

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📊 RESUMEN DE CONFIGURACIÓN'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

\echo ''
\echo '✅ Customer Groups Creados:'
SELECT name, id, metadata->>'channel' as canal
FROM customer_group
WHERE name IN ('MercadoLibre', 'Público General', 'Mayorista')
ORDER BY name;

\echo ''
\echo '✅ Price Lists Creados:'
SELECT title, type, status
FROM price_list
WHERE title LIKE '%CS200A%'
ORDER BY title;

\echo ''
\echo '✅ Precios Configurados:'
SELECT
  pl.title as price_list,
  p.amount / 100.0 as precio_usd,
  pr.value as customer_group_id
FROM price p
JOIN price_list pl ON p.price_list_id = pl.id
LEFT JOIN price_rule pr ON pr.price_id = p.id
WHERE pl.title LIKE '%CS200A%'
ORDER BY p.amount;

COMMIT;

\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '✅ CONFIGURACIÓN COMPLETADA EXITOSAMENTE'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''
\echo '🔄 Próximos pasos:'
\echo '   1. Reiniciar Medusa backend para aplicar cambios'
\echo '   2. Verificar precios en http://localhost:3000/producto/cummins-cs200a'
\echo '   3. Actualizar frontend para mostrar precios por customer group'
\echo ''
