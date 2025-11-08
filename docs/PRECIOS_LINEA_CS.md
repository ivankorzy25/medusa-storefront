# 💰 PRECIOS LÍNEA CUMMINS CS - EXTRAÍDOS DEL PDF

**Fuente:** Lista de Precios Mayorista E-Gaucho 1083 - Dolarizada
**Fecha:** 2025-11-08
**Páginas:** 8-9

---

## 📊 TABLA COMPLETA DE PRECIOS

| Modelo | Precio USD | IVA % | Bonificación % | Desc. Contado % | Tipo | Potencia |
|--------|-----------|-------|----------------|-----------------|------|----------|
| **CS200A** | **26,411** | 10.5% | 11% | 9% | Abierto | 200 KVA |
| **CS200S** | **28,707** | 10.5% | 11% | 9% | Silent | 200 KVA |
| **CS275A** | **32,720** | 10.5% | 11% | 9% | Abierto | 275 KVA |
| **CS360A** | **40,746** | 10.5% | 11% | 9% | Abierto | 360 KVA |
| **CS375S** | **49,389** | 10.5% | 11% | 9% | Silent | 375 KVA |
| **CS450A** | **56,550** | 10.5% | 11% | 9% | Abierto | 450 KVA |
| **CS450S** | **63,588** | 10.5% | 11% | 9% | Silent | 450 KVA |
| **CS550A** | **67,430** | 10.5% | 11% | 9% | Abierto | 550 KVA |
| **CS550S** | **76,552** | 10.5% | 11% | 9% | Silent | 550 KVA |
| **CS650S** | **91,370** | 10.5% | 11% | 9% | Silent | 650 KVA |
| **CS1000A** | consultar | 10.5% | 11% | 9% | Abierto | 1000 KVA |
| **CS1000S** | consultar | 10.5% | 11% | 9% | Silent | 1000 KVA |

---

## 💵 EJEMPLO DE CÁLCULO (CS200A)

### Precio Base
```
USD 26,411 (sin IVA)
```

### Conversión a ARS (Dólar Blue)
```
Dólar Blue Venta: 1,415
USD 26,411 × 1,415 = ARS 37,371,565 (sin IVA)
```

### IVA 10.5%
```
IVA: ARS 37,371,565 × 10.5% = ARS 3,924,014
TOTAL CON IVA: ARS 41,295,579
```

### Bonificación 11%
```
Descuento: ARS 41,295,579 × 11% = ARS 4,542,514
PRECIO CON BONIF: ARS 36,753,065
```

### Descuento Contado 9% (adicional)
```
Descuento: ARS 36,753,065 × 9% = ARS 3,307,776
PRECIO FINAL CONTADO: ARS 33,445,289
```

---

## 🔍 DIFERENCIAS DE PRECIO A vs S

| Potencia | Abierto (A) | Silent (S) | Diferencia | % Más |
|----------|-------------|------------|------------|-------|
| 200 KVA | USD 26,411 | USD 28,707 | USD 2,296 | 8.7% |
| 450 KVA | USD 56,550 | USD 63,588 | USD 7,038 | 12.4% |
| 550 KVA | USD 67,430 | USD 76,552 | USD 9,122 | 13.5% |
| 1000 KVA | consultar | consultar | - | - |

**Observación:** Las versiones Silent son entre 8-13% más caras que las Abierto.

---

## 📋 CONFIGURACIÓN PARA MEDUSA

### pricing_config para cada producto:

```json
{
  "precio_lista_usd": 26411,
  "currency_type": "usd_blue",
  "iva_percentage": 10.5,
  "bonificacion_percentage": 11,
  "descuento_contado_percentage": 9,
  "familia": "Generadores Cummins - Línea CS"
}
```

---

## 🏷️ TAXONOMÍA ASIGNADA

- **Type:** `ptype_generador_diesel` (Generador Diesel)
- **Collection:** `pcoll_cummins_cs` (Generadores Cummins - Línea CS)
- **Categories:**
  - CS200A, CS200S → `pcat_gen_diesel_100_200` (100 a 200 KVA)
  - CS275A, CS360A, CS375S, CS450A, CS450S → `pcat_gen_diesel_200_500` (200 a 500 KVA)
  - CS550A, CS550S, CS650S, CS1000A, CS1000S → `pcat_gen_diesel_500` (Más de 500 KVA)

---

## 🏭 TAGS POR MODELO

### Común a todos:
- `ptag_diesel`
- `ptag_cummins`
- `ptag_industrial`
- `ptag_estacionario`
- `ptag_trifasico`
- `ptag_stamford`

### Por tipo de cabina:
- **Abierto (A):** `ptag_automatico`
- **Silent (S):** `ptag_automatico`, `ptag_insonorizado`

### Por modo de operación:
- `ptag_standby`
- `ptag_prime`

### Por rango de potencia:
- CS200: `ptag_100200kva`
- CS275, CS360, CS375, CS450: `ptag_200500kva`
- CS550, CS650, CS1000: `ptag_500kva`

---

## ⚠️ NOTAS IMPORTANTES

1. **CS1000A y CS1000S:** Precio "consultar" - no importar hasta obtener precio real
2. **IVA 10.5%:** Aplicable a todos los generadores industriales (bienes de capital)
3. **Dólar Blue:** Usar `usd_blue` para currency_type (referencia del mercado)
4. **Bonificación y Descuento:** Son acumulativos (primero bonif, luego desc. contado)

---

## ✅ PRODUCTOS LISTOS PARA IMPORTAR

**Total:** 10 productos (excluir CS1000A y CS1000S por ahora)

1. ✅ CS200A
2. ✅ CS200S
3. ✅ CS275A
4. ✅ CS360A
5. ✅ CS375S
6. ✅ CS450A
7. ✅ CS450S
8. ✅ CS550A
9. ✅ CS550S
10. ✅ CS650S

**Pendientes de precio:**
- ⏳ CS1000A
- ⏳ CS1000S

---

**Extraído:** 2025-11-08
**Verificado:** ✅ Precios coinciden con PDF página 8-9
**Estado:** LISTO PARA IMPORTACIÓN
