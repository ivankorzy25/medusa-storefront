# 📋 PLANTILLA DE REQUISITOS PARA PRODUCTOS MEDUSA

**Base de Referencia:** CS200A (producto completo y funcional)
**Fecha:** 2025-11-08
**Propósito:** Garantizar que TODOS los productos tengan la misma estructura completa

---

## ⚠️ CRÍTICO: Checklist de Requisitos Obligatorios

Cada producto DEBE tener TODOS estos elementos para considerarse completo:

### ✅ 1. PRODUCTO BASE (tabla `product`)
- [ ] `id` - Generado automáticamente
- [ ] `title` - Título completo y descriptivo
- [ ] `subtitle` - Subtítulo técnico con componentes principales
- [ ] `description` - Descripción extensa (mínimo 300 palabras)
- [ ] `handle` - URL amigable (ej: `cummins-cs275a`)
- [ ] `is_giftcard` - Siempre `false`
- [ ] `thumbnail` - URL de la imagen más grande/pesada
- [ ] `status` - Siempre `published`
- [ ] `type_id` - Tipo de producto (ej: `ptype_generador_diesel`)
- [ ] `collection_id` - Colección/familia (ej: `pcoll_cummins_cs`)
- [ ] `created_at` / `updated_at` - Timestamps automáticos

### ✅ 2. VARIANT (tabla `product_variant`)
- [ ] `id` - Generado automáticamente
- [ ] `title` - Nombre del variant (ej: "Generador CS275A - Abierto")
- [ ] `product_id` - FK al producto
- [ ] `sku` - Código único (ej: "GEN-CS275A-STD")
- [ ] `allow_backorder` - `false`
- [ ] `manage_inventory` - `true`
- [ ] `weight` - Peso en gramos (ej: 2200000 = 2200 kg)
- [ ] `length` - Largo en mm
- [ ] `height` - Alto en mm
- [ ] `width` - Ancho en mm
- [ ] **`metadata`** - JSONB con estructura completa (ver abajo)
- [ ] `created_at` / `updated_at` - Timestamps

**IMPORTANTE:** Aunque CS200A no tiene estos campos completos, los productos nuevos DEBEN incluirlos para estar completos en el Admin.

### ✅ 3. METADATA DEL VARIANT (estructura JSONB obligatoria)

```json
{
  "pricing_config": {
    "precio_lista_usd": 32720,          // Precio base sin IVA
    "currency_type": "usd_blue",         // Tipo de dólar a usar
    "iva_percentage": 10.5,              // IVA aplicable
    "bonificacion_percentage": 11,       // Bonificación estándar
    "descuento_contado_percentage": 9,   // Descuento por pago contado
    "familia": "Generadores Cummins - Línea CS"
  },
  "especificaciones_tecnicas": {
    "potencia": {
      "standby_kva": 275,
      "standby_kw": 220,
      "prime_kva": 250,
      "prime_kw": 200,
      "factor_potencia": 0.8,
      "tension": "380/220V",
      "frecuencia": "50 Hz",
      "fases": 3
    },
    "motor": {
      "marca": "Cummins",
      "modelo": "6LTAA8.9-G2 TDI",
      "tipo": "6 cilindros en linea, turboalimentado",
      "cilindros": 6,
      "cilindrada_litros": 8.9,
      "potencia_hp": 326,
      "velocidad_rpm": 1500,
      "consumo_75_lh": 45,
      "capacidad_aceite_litros": 27.6,
      "refrigeracion": "Por agua",
      "turboalimentado": true
    },
    "alternador": {
      "marca": "Stamford",
      "modelo": "UCI274",
      "tipo": "Sin escobillas (Brushless)",
      "excitacion": "Autoexcitado"
    },
    "panel_control": {
      "marca": "COMAP",
      "modelo": "AMF25",
      "tipo": "Electronico LCD",
      "arranque_automatico": true,
      "caracteristicas": [
        "Tablero digital",
        "Auto-start",
        "Parada de emergencia externa"
      ]
    },
    "combustible": {
      "tipo": "Diesel",
      "capacidad_tanque_litros": 670,
      "autonomia_75_horas": 14.9
    },
    "dimensiones": {
      "largo_mm": 2540,
      "ancho_mm": 950,
      "alto_mm": 1670,
      "peso_kg": 2200
    },
    "caracteristicas_principales": [
      "Motor turboalimentado",
      "Alternador sin escobillas",
      "Refrigeracion por agua",
      "Parada de emergencia externa",
      "Carga de combustible",
      "Tablero digital COMAP",
      "Arranque automatico",
      "Precalentador disponible"
    ]
  }
}
```

### ✅ 4. IMÁGENES (tabla `image`)

**CRÍTICO:** Las imágenes deben estar ordenadas por tamaño (mayor a menor)

- [ ] Mínimo 1 imagen (thumbnail)
- [ ] Recomendado: 10-30 imágenes
- [ ] Campos obligatorios por imagen:
  - `id` - Generado (6 caracteres md5)
  - `url` - URL completa `http://localhost:9000/static/nombre_imagen.webp`
  - `rank` - Orden (1 = thumbnail/principal = imagen MÁS GRANDE)
  - `product_id` - FK al producto
  - `created_at` / `updated_at` - Timestamps

**PROCESO:**
1. Listar todas las imágenes .webp de la carpeta
2. Ordenarlas por tamaño de archivo (mayor a menor)
3. La imagen MÁS PESADA va primero (rank = 1, thumbnail)

### ✅ 5. TAXONOMÍA

#### Type (tabla `product_type`)
- [ ] `type_id` asignado en producto
- [ ] Valor: `ptype_generador_diesel` (para línea CS)

#### Collection (tabla `product_collection`)
- [ ] `collection_id` asignado en producto
- [ ] Valor: `pcoll_cummins_cs` (para línea CS)

#### Categories (tabla `product_category_product`)
- [ ] Mínimo 1 categoría asignada
- [ ] Categorías disponibles por KVA:
  - `pcat_gen_diesel_100_200` → 100-200 KVA
  - `pcat_gen_diesel_200_500` → 200-500 KVA
  - `pcat_gen_diesel_500` → +500 KVA

#### Tags (tabla `product_tags`)
- [ ] Mínimo 10 tags asignados
- [ ] Tags obligatorios para línea CS:
  - `ptag_diesel`
  - `ptag_cummins`
  - `ptag_industrial`
  - `ptag_estacionario`
  - `ptag_automatico`
  - `ptag_trifasico`
  - `ptag_standby`
  - `ptag_prime`
  - `ptag_stamford`
  - `ptag_[rango-kva]` (ej: `ptag_200500kva`)
- [ ] Tags opcionales:
  - `ptag_insonorizado` (solo para modelos "S" Silent)

### ✅ 6. SALES CHANNEL (tabla `product_sales_channel`)

**CRÍTICO - OBLIGATORIO:**

- [ ] Producto asignado a Default Sales Channel
- [ ] Campos:
  - `id` - UUID generado
  - `product_id` - FK al producto
  - `sales_channel_id` - `sc_01K9FZ84KQM1PG94Q6YT6248EW`
  - `created_at` / `updated_at` - Timestamps

**Si falta este registro, el producto NO aparecerá en el frontend ni en el listado del admin**

---

## 📁 FUENTES DE INFORMACIÓN

Para cada producto nuevo, extraer información de:

### 1. Carpeta del Producto
**Ruta:** `/Users/ivankorzyniewski/Desktop/RECUPERACION_V_DRIVE/GENERADORES/001-GENERADORES/GAUCHO Generadores Cummins - Linea CS/[MODELO]/`

**Archivos a analizar:**
- `[MODELO].json` - Especificaciones técnicas estructuradas
- `[MODELO].md` - Descripción y características
- `[MODELO].pdf` - Ficha técnica completa
- `*.html` - Página web del producto
- `IMAGENES-*/` - Carpeta con imágenes .webp

### 2. Lista de Precios
**Archivo:** `/Users/ivankorzyniewski/medusa-storefront-product-template-20251106/Lista de Precios Mayorista E-Gaucho 1083 - Dolarizada.pdf`

**Buscar:**
- Precio USD sin IVA
- IVA aplicable (10.5% o 21%)
- Bonificación %
- Descuento contado %

---

## 🔄 PROCESO DE IMPORTACIÓN ESTÁNDAR

### PASO 1: Análisis Completo
```bash
# Usar sub-agente para análisis exhaustivo
Task(subagent_type="general-purpose", prompt="
  Analizar carpeta completa de [MODELO]
  - Listar archivos (JSON, MD, PDF, HTML, imágenes)
  - Ordenar imágenes por tamaño (mayor a menor)
  - Extraer specs técnicas de JSON/MD/PDF
  - Buscar precio en lista de precios
  - Retornar informe estructurado completo
")
```

### PASO 2: Copiar Imágenes Ordenadas
```bash
# Copiar imágenes al static folder
find "[carpeta_producto]" -name "*.webp" -type f -exec cp {} /Users/ivankorzyniewski/medusa-backend/static/ \;

# Verificar cantidad
ls -1 /Users/ivankorzyniewski/medusa-backend/static/ | grep -i "[MODELO]" | wc -l
```

### PASO 3: Generar Script SQL Completo
Usar plantilla base e incluir:
1. Producto (título, subtítulo, descripción, handle, thumbnail, type, collection)
2. Variant (título, SKU, dimensiones, peso, **metadata completa**)
3. Imágenes (ordenadas por tamaño, rank 1 = thumbnail)
4. Categoría (según KVA)
5. Tags (10-11 tags según modelo A o S)
6. **Sales Channel (OBLIGATORIO)**

### PASO 4: Ejecutar y Verificar
```bash
# Ejecutar script
psql -h localhost -U ivankorzyniewski -d medusa-store -f scripts/import-[modelo].sql

# Verificar TODOS los elementos
psql -c "
  SELECT
    p.id, p.title, p.handle,
    COUNT(DISTINCT img.id) as imagenes,
    COUNT(DISTINCT psc.sales_channel_id) as sales_channels,
    COUNT(DISTINCT pcp.product_category_id) as categorias,
    COUNT(DISTINCT pt.product_tag_id) as tags
  FROM product p
  LEFT JOIN image img ON p.id = img.product_id
  LEFT JOIN product_sales_channel psc ON p.id = psc.product_id
  LEFT JOIN product_category_product pcp ON p.id = pcp.product_id
  LEFT JOIN product_tags pt ON p.id = pt.product_id
  WHERE p.handle = '[handle-producto]'
  GROUP BY p.id, p.title, p.handle;
"
```

### PASO 5: Verificación en Admin
- [ ] Producto aparece en listado `/app/products`
- [ ] Thumbnail/imagen visible en listado
- [ ] Sales Channel = "Default Sales Channel" (no "-")
- [ ] Al abrir producto:
  - [ ] Descripción completa visible
  - [ ] Type asignado
  - [ ] Collection asignada
  - [ ] Categories asignadas
  - [ ] Tags asignados
  - [ ] Imágenes visibles (galería)
  - [ ] Attributes poblados (weight, dimensions)

### PASO 6: Verificación en Frontend
- [ ] URL funciona: `http://localhost:3000/products/[handle]`
- [ ] Producto visible en página
- [ ] Imágenes se muestran correctamente
- [ ] Precio se calcula correctamente

---

## 🚨 ERRORES COMUNES A EVITAR

### ❌ Error 1: Sales Channel no asignado
**Síntoma:** Producto no aparece en listado, muestra "-" en columna Sales Channel
**Solución:** Agregar registro en `product_sales_channel`

### ❌ Error 2: Categoría/Tag inexistente
**Síntoma:** Error FK constraint violation
**Solución:** Verificar IDs correctos en tablas `product_category` y `product_tag`

### ❌ Error 3: Imágenes desordenadas
**Síntoma:** Thumbnail no es la imagen principal, imagen pequeña como portada
**Solución:** Ordenar por tamaño ANTES de generar script, imagen más grande rank=1

### ❌ Error 4: Metadata vacía o incompleta
**Síntoma:** Precio no se calcula, specs no se muestran
**Solución:** Incluir estructura JSONB completa con pricing_config + especificaciones_tecnicas

### ❌ Error 5: Handle incorrecto
**Síntoma:** URL 404, producto no accesible
**Solución:** Handle debe ser minúsculas, guiones, sin espacios (ej: `cummins-cs275a`)

---

## 📊 TABLA DE CORRESPONDENCIA DE CATEGORÍAS Y TAGS

### Categorías por Potencia KVA

| Potencia KVA | Category ID | Nombre |
|--------------|-------------|--------|
| 100-200 | `pcat_gen_diesel_100_200` | 100 a 200 KVA |
| 200-500 | `pcat_gen_diesel_200_500` | 200 a 500 KVA |
| 500+ | `pcat_gen_diesel_500` | +500 KVA |

### Tags Obligatorios por Rango

| Rango KVA | Tag ID | Valor |
|-----------|--------|-------|
| 100-200 | `ptag_100200kva` | 100-200kva |
| 200-500 | `ptag_200500kva` | 200-500kva |
| 500+ | `ptag_500kva` | +500kva |

### Tags por Tipo de Cabina

| Tipo | Tag ID | Valor | Cuándo usar |
|------|--------|-------|-------------|
| Abierto | - | - | NO incluir tag "insonorizado" |
| Silent | `ptag_insonorizado` | insonorizado | SOLO para modelos que terminan en "S" |

---

## 🎯 EJEMPLO COMPLETO: CS275A

Ver archivo: `/scripts/import-cs275a.sql`

**Checklist CS275A:**
- ✅ Producto base (título, subtítulo, descripción extensa)
- ✅ Variant con metadata completa (pricing_config + especificaciones_tecnicas)
- ✅ 27 imágenes ordenadas por tamaño (2.3MB la principal)
- ✅ Type: Generador Diesel
- ✅ Collection: Generadores Cummins - Línea CS
- ✅ Category: 200 a 500 KVA
- ✅ Tags: 10 tags (sin "insonorizado" porque es modelo "A" abierto)
- ✅ Sales Channel: Default Sales Channel
- ✅ Handle: cummins-cs275a
- ✅ Thumbnail: Imagen más grande

**Resultado:** Producto 100% completo y funcional

---

## 📝 NOTAS FINALES

1. **NO inventar datos:** Si algo no está en las fuentes, dejarlo vacío o preguntar
2. **Consistencia:** Todos los productos de la misma línea deben tener estructura idéntica
3. **Metadata:** Es CRÍTICA para cálculo de precios y visualización de specs
4. **Sales Channel:** OBLIGATORIO o el producto no aparecerá
5. **Imágenes ordenadas:** La primera impresión importa (thumbnail = imagen más grande/mejor)

---

**Versión:** 1.0
**Última actualización:** 2025-11-08
**Base de referencia:** CS200A
**Productos validados:** CS200A, CS200S, CS275A
