import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

/**
 * API Route para calcular el precio de un producto en ARS
 * Basado en precio USD y tipo de cambio seleccionado
 *
 * Soporta:
 * - IVA variable (10.5% o 21%)
 * - Bonificaciones mayoristas
 * - Descuentos por pago contado
 * - Múltiples tipos de cambio
 *
 * Query params:
 * - precio_usd: Precio base en USD (requerido)
 * - tipo_cambio: oficial|blue|mep|ccl|mayorista|cripto|tarjeta (default: oficial)
 * - incluir_iva: true|false (default: false)
 * - iva_porcentaje: 10.5|21 (default: 10.5)
 * - bonificacion: 0-100 (default: 0)
 * - descuento_contado: 0-100 (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const precioListaUSD = parseFloat(searchParams.get('precio_usd') || '0');
    const tipoCambio = searchParams.get('tipo_cambio') || 'oficial';
    const incluirIva = searchParams.get('incluir_iva') === 'true';
    const ivaPorcentaje = parseFloat(searchParams.get('iva_porcentaje') || '10.5');
    const bonificacion = parseFloat(searchParams.get('bonificacion') || '0');
    const descuentoContado = parseFloat(searchParams.get('descuento_contado') || '0');

    console.log('[API Route] Calculating price:', {
      precioListaUSD,
      tipoCambio,
      incluirIva,
      ivaPorcentaje,
      bonificacion,
      descuentoContado,
    });

    if (!precioListaUSD || precioListaUSD <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Precio USD inválido',
      }, { status: 400 });
    }

    // Validar porcentajes
    if (bonificacion < 0 || bonificacion > 100) {
      return NextResponse.json({
        success: false,
        error: 'Bonificación debe estar entre 0 y 100',
      }, { status: 400 });
    }

    if (descuentoContado < 0 || descuentoContado > 100) {
      return NextResponse.json({
        success: false,
        error: 'Descuento contado debe estar entre 0 y 100',
      }, { status: 400 });
    }

    if (![10.5, 21].includes(ivaPorcentaje)) {
      return NextResponse.json({
        success: false,
        error: 'IVA debe ser 10.5% o 21%',
      }, { status: 400 });
    }

    // Obtener tipos de cambio
    const ratesResponse = await fetch(
      `${request.nextUrl.origin}/api/exchange-rates`,
      { cache: 'no-store' }
    );
    const ratesData = await ratesResponse.json();

    if (!ratesData.success || !ratesData.data) {
      throw new Error('No se pudieron obtener las cotizaciones');
    }

    // Buscar la cotización del tipo solicitado
    const cotizacion = ratesData.data.find(
      (rate: any) => rate.tipo === tipoCambio
    );

    if (!cotizacion) {
      return NextResponse.json({
        success: false,
        error: `Tipo de cambio '${tipoCambio}' no encontrado`,
      }, { status: 404 });
    }

    // =========================================================================
    // CÁLCULO DE PRECIO CON DESCUENTOS
    // =========================================================================

    // 1. Aplicar bonificación (si existe)
    const precioConBonificacion = precioListaUSD * (1 - bonificacion / 100);

    // 2. Aplicar descuento contado (si existe)
    const precioConDescuentos = precioConBonificacion * (1 - descuentoContado / 100);

    // 3. Convertir a ARS
    const precioARS = precioConDescuentos * cotizacion.venta;

    // 4. Calcular IVA
    const ivaARS = incluirIva ? precioARS * (ivaPorcentaje / 100) : 0;

    // 5. Precio final
    const precioFinalARS = precioARS + ivaARS;

    // =========================================================================
    // CALCULAR PRECIOS PARA LOS 3 ESCENARIOS
    // =========================================================================

    // Precio Público (sin bonificaciones ni descuentos)
    const precioPublicoSinIva = precioListaUSD * cotizacion.venta;
    const precioPublicoConIva = precioPublicoSinIva * (1 + ivaPorcentaje / 100);

    // Precio Mayorista Contado (bonif + desc contado)
    const precioContadoUSD = precioListaUSD * (1 - bonificacion / 100) * (1 - descuentoContado / 100);
    const precioContadoSinIva = precioContadoUSD * cotizacion.venta;
    const precioContadoConIva = precioContadoSinIva * (1 + ivaPorcentaje / 100);

    // Precio Mayorista Financiado (solo bonif)
    const precioFinanciadoUSD = precioListaUSD * (1 - bonificacion / 100);
    const precioFinanciadoSinIva = precioFinanciadoUSD * cotizacion.venta;
    const precioFinanciadoConIva = precioFinanciadoSinIva * (1 + ivaPorcentaje / 100);

    console.log('[API Route] Price calculated:', {
      precioARS,
      ivaARS,
      precioFinalARS,
    });

    // =========================================================================
    // CONSTRUIR FÓRMULA DESCRIPTIVA
    // =========================================================================

    const descuentosTotales = bonificacion + descuentoContado;
    let formula = 'USD';

    if (bonificacion > 0) {
      formula += ` × (1 - ${bonificacion}% bonif)`;
    }
    if (descuentoContado > 0) {
      formula += ` × (1 - ${descuentoContado}% desc)`;
    }
    formula += ` × Venta`;
    if (incluirIva) {
      formula += ` × (1 + IVA ${ivaPorcentaje}%)`;
    }

    // Construir pasos del cálculo
    const pasos: string[] = [
      `Precio lista USD: $${precioListaUSD.toLocaleString('en-US')}`,
    ];

    if (bonificacion > 0) {
      pasos.push(`Bonificación ${bonificacion}%: $${precioConBonificacion.toLocaleString('en-US')}`);
    }

    if (descuentoContado > 0) {
      pasos.push(`Descuento contado ${descuentoContado}%: $${precioConDescuentos.toLocaleString('en-US')}`);
    }

    pasos.push(`Cotización ${cotizacion.fuente} vendedor: $${cotizacion.venta.toLocaleString('es-AR')}`);
    pasos.push(`Conversión a ARS: $${precioARS.toLocaleString('es-AR')}`);

    if (incluirIva) {
      pasos.push(`IVA ${ivaPorcentaje}%: $${ivaARS.toLocaleString('es-AR')}`);
      pasos.push(`Total final: $${precioFinalARS.toLocaleString('es-AR')}`);
    } else {
      pasos.push(`Total: $${precioARS.toLocaleString('es-AR')}`);
    }

    const result = {
      success: true,
      data: {
        precio_base_usd: precioListaUSD,
        cotizacion: {
          tipo: cotizacion.tipo,
          compra: cotizacion.compra,
          venta: cotizacion.venta,
          fuente: cotizacion.fuente,
          ultima_actualizacion: cotizacion.ultima_actualizacion,
        },
        descuentos: {
          bonificacion_porcentaje: bonificacion,
          descuento_contado_porcentaje: descuentoContado,
          descuento_total_porcentaje: descuentosTotales,
          precio_con_descuentos_usd: precioConDescuentos,
        },
        precio_ars: {
          sin_iva: Math.round(precioARS),
          iva: Math.round(ivaARS),
          final: Math.round(precioFinalARS),
        },
        // Precios para los 3 escenarios
        escenarios: {
          publico: {
            sin_iva: Math.round(precioPublicoSinIva),
            con_iva: Math.round(precioPublicoConIva),
            descripcion: 'Precio lista completo',
          },
          mayorista_contado: {
            sin_iva: Math.round(precioContadoSinIva),
            con_iva: Math.round(precioContadoConIva),
            descripcion: `Con bonif ${bonificacion}% + desc contado ${descuentoContado}%`,
            descuento_total: Math.round((1 - precioContadoUSD / precioListaUSD) * 100),
          },
          mayorista_financiado: {
            sin_iva: Math.round(precioFinanciadoSinIva),
            con_iva: Math.round(precioFinanciadoConIva),
            descripcion: `Con bonif ${bonificacion}%`,
            descuento_total: bonificacion,
          },
        },
        calculo: {
          formula,
          pasos,
        },
      },
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API Route] Error calculating price:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al calcular el precio',
    }, { status: 500 });
  }
}
