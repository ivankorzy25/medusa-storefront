-- =========================================================================
-- IMPORTAR PRODUCTO: CUMMINS CS275A
-- =========================================================================
-- Generador Diesel Cummins CS275A 275 KVA Standby / 250 KVA Prime
-- Precio: USD 32,720 | IVA 10.5% | Bonif 11% | Desc. Contado 9%
-- Basado en estructura CS200A (template de referencia)
-- =========================================================================

DO $$
DECLARE
  v_product_id text;
  v_variant_id text;
  v_image_id text;
BEGIN
  -- =========================================================================
  -- 1. CREAR PRODUCTO
  -- =========================================================================

  v_product_id := 'prod_cs275a_' || substring(gen_random_uuid()::text from 1 for 12);

  INSERT INTO product (
    id,
    title,
    subtitle,
    description,
    handle,
    is_giftcard,
    thumbnail,
    status,
    type_id,
    collection_id,
    created_at,
    updated_at
  ) VALUES (
    v_product_id,
    'Generador Diesel Cummins CS275A - 275 KVA Standby / 250 KVA Prime',
    'Motor Cummins 6LTAA8.9-G2 + Alternador Stamford UCI274 - Uso Industrial',
    'Generador industrial diesel Cummins CS275A de 275 KVA Stand-By / 250 KVA Prime.

Equipado con motor Cummins 6LTAA8.9-G2 TDI de 6 cilindros en linea turboalimentado con 326 HP y alternador Stamford UCI274 sin escobillas.

Ideal para uso continuo 24/7 en aplicaciones industriales y comerciales de alta potencia.

Panel de control COMAP AMF25 electronico con funcion auto-start. Refrigeracion por agua. Tanque de 670 litros para autonomia extendida.

Disenado para maxima confiabilidad y bajo costo operativo en instalaciones criticas.

CARACTERISTICAS PRINCIPALES:
• Motor Cummins 6LTAA8.9-G2 TDI - 6 cilindros turboalimentado
• Alternador Stamford UCI274 sin escobillas
• 275 KVA Stand-By / 250 KVA Prime
• Panel COMAP AMF25 electronico con auto-start
• Refrigeracion por agua
• Tanque de combustible: 670 litros
• Consumo a 75 porciento carga: 45 L/h
• Uso continuo 24/7
• Peso: 2200 kg

APLICACIONES:
• Industrias medianas y grandes
• Comercios de alta potencia
• Edificios residenciales y comerciales
• Hospitales y clinicas
• Data centers
• Instalaciones criticas
• Zonas sin red electrica',
    'cummins-cs275a',
    false,
    'http://localhost:9000/static/CS 275 A_20251014_153958_6.webp',
    'published',
    'ptype_generador_diesel',
    'pcoll_cummins_cs',
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Producto creado: %', v_product_id;

  -- =========================================================================
  -- 2. CREAR VARIANT (con metadata completa y formulas de precio)
  -- =========================================================================

  v_variant_id := 'variant_cs275a_' || substring(gen_random_uuid()::text from 1 for 12);

  INSERT INTO product_variant (
    id,
    title,
    product_id,
    sku,
    allow_backorder,
    manage_inventory,
    weight,
    length,
    height,
    width,
    metadata,
    created_at,
    updated_at
  ) VALUES (
    v_variant_id,
    'Generador CS275A - Abierto',
    v_product_id,
    'GEN-CS275A-STD',
    false,
    true,
    2200000,  -- 2200 kg en gramos
    2540,     -- 2540 mm
    1670,     -- 1670 mm
    950,      -- 950 mm
    jsonb_build_object(
      'pricing_config', jsonb_build_object(
        'precio_lista_usd', 32720,
        'currency_type', 'usd_blue',
        'iva_percentage', 10.5,
        'bonificacion_percentage', 11,
        'descuento_contado_percentage', 9,
        'familia', 'Generadores Cummins - Línea CS'
      ),
      'especificaciones_tecnicas', jsonb_build_object(
        'potencia', jsonb_build_object(
          'standby_kva', 275,
          'standby_kw', 220,
          'prime_kva', 250,
          'prime_kw', 200,
          'factor_potencia', 0.8,
          'tension', '380/220V',
          'frecuencia', '50 Hz',
          'fases', 3
        ),
        'motor', jsonb_build_object(
          'marca', 'Cummins',
          'modelo', '6LTAA8.9-G2 TDI',
          'tipo', '6 cilindros en linea, turboalimentado',
          'cilindros', 6,
          'cilindrada_litros', 8.9,
          'potencia_hp', 326,
          'velocidad_rpm', 1500,
          'consumo_75_lh', 45,
          'capacidad_aceite_litros', 27.6,
          'refrigeracion', 'Por agua',
          'turboalimentado', true
        ),
        'alternador', jsonb_build_object(
          'marca', 'Stamford',
          'modelo', 'UCI274',
          'tipo', 'Sin escobillas (Brushless)',
          'excitacion', 'Autoexcitado'
        ),
        'panel_control', jsonb_build_object(
          'marca', 'COMAP',
          'modelo', 'AMF25',
          'tipo', 'Electronico LCD',
          'arranque_automatico', true,
          'caracteristicas', jsonb_build_array(
            'Tablero digital',
            'Auto-start',
            'Parada de emergencia externa'
          )
        ),
        'combustible', jsonb_build_object(
          'tipo', 'Diesel',
          'capacidad_tanque_litros', 670,
          'autonomia_75_horas', 14.9
        ),
        'dimensiones', jsonb_build_object(
          'largo_mm', 2540,
          'ancho_mm', 950,
          'alto_mm', 1670,
          'peso_kg', 2200
        ),
        'caracteristicas_principales', jsonb_build_array(
          'Motor turboalimentado',
          'Alternador sin escobillas',
          'Refrigeracion por agua',
          'Parada de emergencia externa',
          'Carga de combustible',
          'Tablero digital COMAP',
          'Arranque automatico',
          'Precalentador disponible'
        )
      )
    ),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Variant creado: %', v_variant_id;

  -- =========================================================================
  -- 3. CREAR IMÁGENES (27 imágenes ordenadas por tamaño - mayor a menor)
  -- =========================================================================

  RAISE NOTICE 'Creando 27 imagenes ordenadas por tamano...';

  -- Imagen 1 (2.3MB - PRINCIPAL/THUMBNAIL)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_6.webp', 1, v_product_id, NOW(), NOW());

  -- Imagen 2 (2.1MB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_7.webp', 2, v_product_id, NOW(), NOW());

  -- Imagen 3 (1.4MB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_1.webp', 3, v_product_id, NOW(), NOW());

  -- Imagen 4 (1.3MB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_1.webp', 4, v_product_id, NOW(), NOW());

  -- Imagen 5 (1.1MB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_4.webp', 5, v_product_id, NOW(), NOW());

  -- Imagen 6 (1.1MB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_4.webp', 6, v_product_id, NOW(), NOW());

  -- Imagen 7 (911KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_2.webp', 7, v_product_id, NOW(), NOW());

  -- Imagen 8 (606KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_2.webp', 8, v_product_id, NOW(), NOW());

  -- Imagen 9 (428KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_11.webp', 9, v_product_id, NOW(), NOW());

  -- Imagen 10 (423KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_8.webp', 10, v_product_id, NOW(), NOW());

  -- Imagen 11 (367KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_5.webp', 11, v_product_id, NOW(), NOW());

  -- Imagen 12 (342KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_10.webp', 12, v_product_id, NOW(), NOW());

  -- Imagen 13 (336KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_12.webp', 13, v_product_id, NOW(), NOW());

  -- Imagen 14 (330KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_14.webp', 14, v_product_id, NOW(), NOW());

  -- Imagen 15 (330KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_9.webp', 15, v_product_id, NOW(), NOW());

  -- Imagen 16 (300KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_13.webp', 16, v_product_id, NOW(), NOW());

  -- Imagen 17 (295KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_10.webp', 17, v_product_id, NOW(), NOW());

  -- Imagen 18 (284KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_5.webp', 18, v_product_id, NOW(), NOW());

  -- Imagen 19 (278KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_11.webp', 19, v_product_id, NOW(), NOW());

  -- Imagen 20 (274KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_8.webp', 20, v_product_id, NOW(), NOW());

  -- Imagen 21 (273KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_12.webp', 21, v_product_id, NOW(), NOW());

  -- Imagen 22 (263KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_6.webp', 22, v_product_id, NOW(), NOW());

  -- Imagen 23 (243KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_9.webp', 23, v_product_id, NOW(), NOW());

  -- Imagen 24 (205KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_13.webp', 24, v_product_id, NOW(), NOW());

  -- Imagen 25 (202KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_7.webp', 25, v_product_id, NOW(), NOW());

  -- Imagen 26 (137KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_153958_3.webp', 26, v_product_id, NOW(), NOW());

  -- Imagen 27 (136KB)
  v_image_id := substring(md5(random()::text) from 1 for 6);
  INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
  VALUES (v_image_id, 'http://localhost:9000/static/CS 275 A_20251014_145929_3.webp', 27, v_product_id, NOW(), NOW());

  RAISE NOTICE '27 imagenes creadas (ordenadas por tamano)';

  -- =========================================================================
  -- 4. ASIGNAR CATEGORÍA
  -- =========================================================================

  INSERT INTO product_category_product (product_category_id, product_id)
  VALUES ('pcat_gen_diesel_200_500', v_product_id)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Categoria asignada: 200 a 500 KVA';

  -- =========================================================================
  -- 5. ASIGNAR TAGS
  -- =========================================================================

  INSERT INTO product_tags (product_id, product_tag_id)
  VALUES
    (v_product_id, 'ptag_diesel'),
    (v_product_id, 'ptag_cummins'),
    (v_product_id, 'ptag_industrial'),
    (v_product_id, 'ptag_estacionario'),
    (v_product_id, 'ptag_automatico'),
    (v_product_id, 'ptag_trifasico'),
    (v_product_id, 'ptag_standby'),
    (v_product_id, 'ptag_prime'),
    (v_product_id, 'ptag_stamford'),
    (v_product_id, 'ptag_200500kva')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Tags asignados: 10 tags';

  -- =========================================================================
  -- 6. ASIGNAR SALES CHANNEL (Default Sales Channel)
  -- =========================================================================

  INSERT INTO product_sales_channel (id, product_id, sales_channel_id, created_at, updated_at)
  VALUES (
    gen_random_uuid()::text,
    v_product_id,
    'sc_01K9FZ84KQM1PG94Q6YT6248EW',  -- Default Sales Channel
    NOW(),
    NOW()
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Sales Channel asignado: Default Sales Channel';

  -- =========================================================================
  -- VERIFICACIÓN
  -- =========================================================================
  RAISE NOTICE '';
  RAISE NOTICE '=== PRODUCTO CS275A CREADO EXITOSAMENTE ===';
  RAISE NOTICE 'ID: %', v_product_id;
  RAISE NOTICE 'Handle: cummins-cs275a';
  RAISE NOTICE 'Precio: USD 32,720 (sin IVA)';
  RAISE NOTICE 'IVA: 10.5 porciento';
  RAISE NOTICE 'Type: Generador Diesel';
  RAISE NOTICE 'Collection: Generadores Cummins - Linea CS';
  RAISE NOTICE 'Category: 200 a 300 KVA';
  RAISE NOTICE 'Tags: 10 (abierto - no insonorizado)';
  RAISE NOTICE 'Imagenes: 27 (ordenadas por tamano)';
  RAISE NOTICE '';

END $$;

-- Verificar producto creado
SELECT
  p.id,
  p.title,
  p.handle,
  pt.value as tipo,
  pc.title as coleccion,
  COUNT(DISTINCT pcp.product_category_id) as categorias,
  COUNT(DISTINCT ptags.product_tag_id) as tags,
  COUNT(DISTINCT img.id) as imagenes
FROM product p
LEFT JOIN product_type pt ON p.type_id = pt.id
LEFT JOIN product_collection pc ON p.collection_id = pc.id
LEFT JOIN product_category_product pcp ON p.id = pcp.product_id
LEFT JOIN product_tags ptags ON p.id = ptags.product_id
LEFT JOIN image img ON p.id = img.product_id
WHERE p.handle = 'cummins-cs275a'
GROUP BY p.id, p.title, p.handle, pt.value, pc.title;
