-- =========================================================================
-- ASIGNAR TAXONOMÍA AL PRODUCTO CUMMINS CS200A
-- =========================================================================
-- Este script asigna Type, Collection, Categories y Tags al producto CS200A
-- ¡IMPORTANTE! Ejecutar DESPUÉS de crear el producto en Medusa
-- =========================================================================

-- Primero obtener el ID del producto CS200A
DO $$
DECLARE
  v_product_id text;
BEGIN
  -- Buscar el producto por handle
  SELECT id INTO v_product_id
  FROM product
  WHERE handle = 'cummins-cs200a'
  LIMIT 1;

  -- Verificar que existe
  IF v_product_id IS NULL THEN
    RAISE EXCEPTION 'Producto cummins-cs200a no encontrado. Primero debes crear el producto.';
  END IF;

  RAISE NOTICE 'Producto encontrado: %', v_product_id;

  -- =========================================================================
  -- 1. ASIGNAR TYPE (Tipo de Producto)
  -- =========================================================================
  UPDATE product
  SET type_id = 'ptype_generador_diesel'
  WHERE id = v_product_id;

  RAISE NOTICE '✅ Type asignado: Generador Diesel';

  -- =========================================================================
  -- 2. ASIGNAR COLLECTION (Colección/Familia)
  -- =========================================================================
  UPDATE product
  SET collection_id = 'pcoll_cummins_cs'
  WHERE id = v_product_id;

  RAISE NOTICE '✅ Collection asignada: Generadores Cummins - Línea CS';

  -- =========================================================================
  -- 3. ASIGNAR CATEGORIES (Categorías)
  -- =========================================================================
  -- Limpiar categorías existentes
  DELETE FROM product_category_product WHERE product_id = v_product_id;

  -- Asignar categoría de potencia (100-200 KVA)
  -- Medusa asigna automáticamente todas las categorías padre
  INSERT INTO product_category_product (product_category_id, product_id)
  VALUES ('pcat_gen_diesel_100_200', v_product_id);

  RAISE NOTICE '✅ Categoría asignada: 100 a 200 KVA';

  -- =========================================================================
  -- 4. ASIGNAR TAGS (Etiquetas)
  -- =========================================================================
  -- Limpiar tags existentes
  DELETE FROM product_tags WHERE product_id = v_product_id;

  -- Asignar tags específicos del CS200A
  INSERT INTO product_tags (product_id, product_tag_id)
  VALUES
    -- Combustible y motor
    (v_product_id, 'ptag_diesel'),
    (v_product_id, 'ptag_cummins'),

    -- Aplicación
    (v_product_id, 'ptag_industrial'),
    (v_product_id, 'ptag_estacionario'),

    -- Características
    (v_product_id, 'ptag_automatico'),
    (v_product_id, 'ptag_insonorizado'),

    -- Configuración eléctrica
    (v_product_id, 'ptag_trifasico'),

    -- Modo de operación
    (v_product_id, 'ptag_standby'),
    (v_product_id, 'ptag_prime'),

    -- Marca alternador
    (v_product_id, 'ptag_stamford'),

    -- Rango de potencia
    (v_product_id, 'ptag_100200kva')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Tags asignados: 11 tags en total';

  -- =========================================================================
  -- VERIFICACIÓN FINAL
  -- =========================================================================
  RAISE NOTICE '';
  RAISE NOTICE '=== VERIFICACIÓN DE TAXONOMÍA CS200A ===';

END $$;

-- Mostrar resultado final
SELECT
  p.id,
  p.title,
  p.handle,
  pt.value as tipo,
  pc.title as coleccion,
  COUNT(DISTINCT pcp.product_category_id) as num_categorias,
  COUNT(DISTINCT ptags.product_tag_id) as num_tags
FROM product p
LEFT JOIN product_type pt ON p.type_id = pt.id
LEFT JOIN product_collection pc ON p.collection_id = pc.id
LEFT JOIN product_category_product pcp ON p.id = pcp.product_id
LEFT JOIN product_tags ptags ON p.id = ptags.product_id
WHERE p.handle = 'cummins-cs200a'
GROUP BY p.id, p.title, p.handle, pt.value, pc.title;

-- Ver categorías asignadas
SELECT
  'Categorías' as tipo,
  pcat.name as valor
FROM product p
JOIN product_category_product pcp ON p.id = pcp.product_id
JOIN product_category pcat ON pcp.product_category_id = pcat.id
WHERE p.handle = 'cummins-cs200a'
ORDER BY pcat.mpath;

-- Ver tags asignados
SELECT
  'Tags' as tipo,
  string_agg(ptag.value, ', ' ORDER BY ptag.value) as valor
FROM product p
JOIN product_tags ptags ON p.id = ptags.product_id
JOIN product_tag ptag ON ptags.product_tag_id = ptag.id
WHERE p.handle = 'cummins-cs200a';

-- =========================================================================
-- RESULTADO ESPERADO:
-- =========================================================================
-- ✅ Type: Generador Diesel
-- ✅ Collection: Generadores Cummins - Línea CS
-- ✅ Categorías: 1 (100 a 200 KVA)
-- ✅ Tags: 11 total
--
-- Tags asignados:
-- diesel, cummins, industrial, estacionario, automatico, insonorizado,
-- trifasico, standby, prime, stamford, 100-200kva
-- =========================================================================
