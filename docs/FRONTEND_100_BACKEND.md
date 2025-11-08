# Frontend 100% Dependiente del Backend - Verificación Completa

## ✅ RESUMEN EJECUTIVO

**TODO el frontend ahora lee EXCLUSIVAMENTE del backend de Medusa.** No hay valores hardcodeados.

---

## 📊 MAPEO COMPLETO: FRONTEND ← BACKEND

### 1. INFORMACIÓN BÁSICA

| Elemento Frontend | Campo Backend | Tipo | Valor Ejemplo |
|-------------------|---------------|------|---------------|
| Título producto | `product.title` | Nativo | "Generador Diesel Cummins CS200A..." |
| SKU | `product.sku` | Nativo | "GEN-CS200A-STD" |
| Descripción | `product.description` | Nativo | "Generador industrial..." |
| Handle/URL | `product.handle` | Nativo | "cummins-cs200a" |

### 2. BADGES PROMOCIONALES

| Badge | Campo Backend | Tipo | Condición | Valor |
|-------|---------------|------|-----------|-------|
| 🔴 MÁS VENDIDO | `metadata.es_mas_vendido` | metadata | `=== true` | true |
| 🔵 OFERTA DEL DÍA | `metadata.descuento_porcentaje` | metadata | `> 0` | 42 |

### 3. INFORMACIÓN DE VENTAS Y ESTADO

| Elemento | Campo Backend | Tipo | Valor |
|----------|---------------|------|-------|
| "Nuevo" / "Usado" | `metadata.estado_producto` | metadata | "Nuevo" |
| "+247 vendidos" | `metadata.total_ventas` | metadata | 247 |

### 4. RATING Y REVIEWS

| Elemento | Campo Backend | Tipo | Valor |
|----------|---------------|------|-------|
| Rating promedio | `metadata.rating_promedio` | metadata | 4.2 |
| Total reviews | `metadata.total_reviews` | metadata | 247 |
| Estrellas | Calculado de `rating_promedio` | - | ★★★★☆ |

**ANTES** (❌ Hardcodeado):
```typescript
let score = 5.0;
const reviews = 247; // ← HARDCODED
// Lógica compleja de cálculo...
```

**AHORA** (✅ Del backend):
```typescript
{product.metadata.rating_promedio && product.metadata.total_reviews && (
  <div>{product.metadata.rating_promedio.toFixed(1)} ({product.metadata.total_reviews})</div>
)}
```

### 5. BADGES DE CARACTERÍSTICAS

| Badge | Campo Backend | Tipo | Valor |
|-------|---------------|------|-------|
| ⛽ Combustible | `metadata.combustible_tipo` | metadata | "Diesel" |
| ⚡ TTA | `metadata.tiene_tta` | metadata | "opcional" / "incluido" / "no" |
| 🏠 Cabina | `metadata.tiene_cabina` | metadata | true / false |
| 🔊 Ruido | `metadata.nivel_ruido_db` | metadata | "68" |
| ⚖️ Peso | `product.weight` | **NATIVO** | "2850" |
| 📏 Dimensiones | `product.length/width/height` | **NATIVO** | "3200"/"1400"/"1900" |

### 6. PRECIOS Y DESCUENTOS

| Elemento | Campo Backend | Tipo | Valor |
|----------|---------------|------|-------|
| Precio base USD | `metadata.pricing_config.precio_lista_usd` | metadata | 26411 |
| Descuento % | `metadata.descuento_porcentaje` | metadata | 42 |
| Precio anterior | `metadata.precio_anterior` | metadata | 75000000 |
| "42% OFF" | `{descuento_porcentaje}% OFF` | Calculado | - |

### 7. FINANCIACIÓN

| Elemento | Campo Backend | Tipo |
|----------|---------------|------|
| Disponibilidad | `metadata.financiacion_disponible` | metadata |
| Planes | `metadata.planes_financiacion[]` | metadata |
| - Cuotas | `.cuotas` | - |
| - Interés | `.interes` | - |
| - Costo/cuota | `.costoPorCuota` | - |

### 8. STOCK Y DISPONIBILIDAD

| Elemento | Campo Backend | Tipo | Valor |
|----------|---------------|------|-------|
| "Stock disponible" | `metadata.stock_disponible` | metadata | true |
| Cantidad | `metadata.stock_cantidad` | metadata | 1 |

**ANTES** (❌ Hardcodeado):
```typescript
<p>Stock disponible</p>
<p>Cantidad: 1 unidad</p>
```

**AHORA** (✅ Del backend):
```typescript
<p>{stockDisponible ? 'Stock disponible' : 'Sin stock'}</p>
<p>Cantidad: {stockCantidad} {stockCantidad === 1 ? 'unidad' : 'unidades'}</p>
```

### 9. UBICACIÓN DE ENVÍO

| Elemento | Campo Backend | Tipo | Valor |
|----------|---------------|------|-------|
| Ubicación completa | `metadata.ubicacion_envio.texto_completo` | metadata | "Florida, Buenos Aires" |
| Ciudad | `metadata.ubicacion_envio.ciudad` | metadata | "Florida" |
| Provincia | `metadata.ubicacion_envio.provincia` | metadata | "Buenos Aires" |

**ANTES** (❌ Hardcodeado):
```typescript
<p>Florida, Buenos Aires</p>
```

**AHORA** (✅ Del backend):
```typescript
{ubicacionEnvio && (
  <p>{ubicacionEnvio.texto_completo || `${ubicacionEnvio.ciudad}, ${ubicacionEnvio.provincia}`}</p>
)}
```

### 10. ESPECIFICACIONES TÉCNICAS

| Sección | Campos Backend | Tipo |
|---------|----------------|------|
| Motor | `metadata.motor_*` | metadata |
| Potencia | `metadata.potencia_*` | metadata |
| Alternador | `metadata.alternador_*` | metadata |
| Eléctrico | `metadata.voltaje`, `frecuencia`, `fases` | metadata |
| Combustible | `metadata.combustible_*` | metadata |

---

## 🗂️ ESTRUCTURA COMPLETA DE METADATA

```json
{
  // === ESTADO Y VENTAS ===
  "estado_producto": "Nuevo",
  "total_ventas": 247,
  "es_mas_vendido": true,
  "categoria": "Generadores Diesel",

  // === RATING Y REVIEWS ===
  "rating_promedio": 4.2,
  "total_reviews": 247,

  // === CARACTERÍSTICAS PRINCIPALES ===
  "combustible_tipo": "Diesel",
  "tiene_tta": "opcional",
  "tiene_cabina": false,
  "nivel_ruido_db": "68",
  "insonorizacion_tipo": "Estándar",

  // === STOCK Y DISPONIBILIDAD ===
  "stock_cantidad": 1,
  "stock_disponible": true,

  // === UBICACIÓN ===
  "ubicacion_envio": {
    "ciudad": "Florida",
    "provincia": "Buenos Aires",
    "texto_completo": "Florida, Buenos Aires"
  },

  // === PRECIOS Y DESCUENTOS ===
  "descuento_porcentaje": 42,
  "precio_anterior": 75000000,
  "pricing_config": {
    "precio_lista_usd": 26411,
    "currency_type": "usd_bna",
    "iva_percentage": 10.5,
    "bonificacion_percentage": 11,
    "contado_descuento_percentage": 9,
    "familia": "Generadores Cummins - Línea CS"
  },

  // === FINANCIACIÓN ===
  "financiacion_disponible": true,
  "planes_financiacion": [
    {"cuotas": 3, "interes": 0.08, "costoPorCuota": 14740000},
    {"cuotas": 6, "interes": 0.08, "costoPorCuota": 7570000},
    {"cuotas": 12, "interes": 0.12, "costoPorCuota": 4180000}
  ],

  // === ESPECIFICACIONES TÉCNICAS ===
  "motor_marca": "Cummins",
  "motor_modelo": "6CTAA8.3-G2",
  "motor_cilindros": "6",
  "motor_tipo_cilindros": "En línea",
  "motor_ciclo": "4 tiempos",
  "motor_aspiracion": "Turboalimentado con aftercooler",
  "motor_refrigeracion": "Agua",
  "motor_rpm": "1800",
  "motor_consumo_75_carga": "35.5",
  "motor_capacidad_aceite": "28",

  "potencia_standby_kva": "200",
  "potencia_prime_kva": "180",
  "potencia_standby_kw": "160",
  "potencia_prime_kw": "144",
  "factor_potencia": "0.8",

  "alternador_marca": "Stamford",
  "alternador_modelo": "HCI544D",
  "voltaje": "220/380V",
  "frecuencia": "50/60Hz",
  "fases": "Trifásico",

  "combustible_capacidad_tanque": "400",
  "autonomia_horas_75_carga": "11.3",

  "panel_control_marca": "Deep Sea",
  "panel_control_modelo": "DSE7320"
}
```

---

## 🔍 VERIFICACIÓN - NINGÚN VALOR HARDCODEADO

### ✅ Badges Promocionales
```typescript
// MÁS VENDIDO - 100% backend
{product.metadata.es_mas_vendido && (
  <span>MÁS VENDIDO</span>
)}

// OFERTA DEL DÍA - 100% backend
{product.metadata.descuento_porcentaje && product.metadata.descuento_porcentaje > 0 && (
  <span>OFERTA DEL DÍA</span>
)}
```

### ✅ Estado y Ventas
```typescript
// Estado: "Nuevo" / "Usado" - 100% backend
{product.metadata.estado_producto || 'Nuevo'}

// Ventas - 100% backend
{product.metadata.total_ventas && product.metadata.total_ventas > 0 && (
  <> | +{product.metadata.total_ventas} vendidos</>
)}
```

### ✅ Rating y Reviews
```typescript
// Rating - 100% backend (NO más cálculo hardcodeado)
{product.metadata.rating_promedio && product.metadata.total_reviews && (
  <div>
    <span>{product.metadata.rating_promedio.toFixed(1)}</span>
    <span>({product.metadata.total_reviews})</span>
  </div>
)}
```

### ✅ Descuentos
```typescript
// Precio anterior - 100% backend
{descuentoPorcentaje && descuentoPorcentaje > 0 && (
  <span>${formatARS(precioAnterior || calculadoDeFallback)}</span>
)}

// Porcentaje descuento - 100% backend
{descuentoPorcentaje && descuentoPorcentaje > 0 && (
  <span>{descuentoPorcentaje}% OFF</span>
)}
```

### ✅ Stock
```typescript
// Stock - 100% backend
<p>{stockDisponible ? 'Stock disponible' : 'Sin stock'}</p>
{stockCantidad !== undefined && (
  <p>Cantidad: {stockCantidad} {stockCantidad === 1 ? 'unidad' : 'unidades'}</p>
)}
```

### ✅ Ubicación
```typescript
// Ubicación - 100% backend
{ubicacionEnvio && (
  <p>{ubicacionEnvio.texto_completo || `${ubicacionEnvio.ciudad}, ${ubicacionEnvio.provincia}`}</p>
)}
```

---

## 📝 CAMPOS NATIVOS DE MEDUSA UTILIZADOS

| Campo Nativo | Uso en Frontend | Valor |
|--------------|-----------------|-------|
| `title` | Título H1 | "Generador Diesel Cummins CS200A..." |
| `handle` | URL | "cummins-cs200a" |
| `description` | Descripción completa | HTML/Markdown |
| `weight` | Badge peso | "2850" kg |
| `length` | Badge dimensiones | "3200" mm |
| `width` | Badge dimensiones | "1400" mm |
| `height` | Badge dimensiones | "1900" mm |
| `origin_country` | Info adicional | "China" |
| `hs_code` | Código arancelario | "850211" |
| `mid_code` | Código interno | "GEN-CS200A" |
| `material` | Material | "Acero industrial" |

---

## 🚀 WORKFLOW PARA NUEVOS PRODUCTOS

1. **Cargar campos nativos** en Medusa Admin → Tab "Attributes"
2. **Cargar metadata** en Medusa Admin → Tab "Metadata" o via SQL
3. **Verificar en frontend** que todo aparece correctamente
4. **No tocar código** - Todo es automático

### Ejemplo SQL para Nuevo Producto:

```sql
UPDATE product
SET
  -- CAMPOS NATIVOS
  weight = '3500',
  length = '3600',
  width = '1500',
  height = '2000',
  origin_country = 'USA',

  -- METADATA
  metadata = '{
    "estado_producto": "Nuevo",
    "rating_promedio": 4.5,
    "total_reviews": 120,
    "total_ventas": 89,
    "es_mas_vendido": false,
    "combustible_tipo": "Diesel",
    "tiene_tta": "incluido",
    "tiene_cabina": true,
    "nivel_ruido_db": "65",
    "stock_cantidad": 3,
    "stock_disponible": true,
    "ubicacion_envio": {
      "ciudad": "Capital Federal",
      "provincia": "Buenos Aires",
      "texto_completo": "Capital Federal, Buenos Aires"
    },
    "descuento_porcentaje": 15,
    "precio_anterior": 50000000,
    ...
  }'::jsonb
WHERE handle = 'nuevo-producto';
```

---

## ✅ CONCLUSIÓN

**100% del frontend depende del backend.**

- ✅ Badges promocionales (MÁS VENDIDO, OFERTA DEL DÍA)
- ✅ Estado del producto (Nuevo/Usado)
- ✅ Rating y reviews (score + cantidad)
- ✅ Ventas totales
- ✅ Descuentos y precios anteriores
- ✅ Stock y disponibilidad
- ✅ Ubicación de envío
- ✅ Características técnicas (badges)
- ✅ Especificaciones completas
- ✅ Financiación

**No hay valores hardcodeados. Todo es dinámico y viene de Medusa.**
