"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, RefreshCw, AlertCircle, Info } from "lucide-react";

interface PriceDisplayProps {
  productId: string;
  priceUSD?: number;
}

type ExchangeRateType = "oficial" | "blue" | "mep" | "ccl" | "mayorista" | "cripto" | "tarjeta";

const EXCHANGE_RATE_LABELS: Record<ExchangeRateType, { label: string; shortLabel: string }> = {
  oficial: { label: "Dólar BNA (Oficial)", shortLabel: "BNA Oficial" },
  blue: { label: "Dólar Blue (Billete)", shortLabel: "Blue" },
  mep: { label: "Dólar MEP (Bolsa)", shortLabel: "MEP" },
  ccl: { label: "Dólar CCL (Cable)", shortLabel: "CCL" },
  mayorista: { label: "Dólar Mayorista", shortLabel: "Mayorista" },
  cripto: { label: "Dólar Cripto", shortLabel: "Cripto" },
  tarjeta: { label: "Dólar Tarjeta", shortLabel: "Tarjeta" },
};

export function PriceDisplay({ productId, priceUSD }: PriceDisplayProps) {
  // Tipo de cambio fijo según producto - por defecto "oficial"
  // TODO: Leer desde metadata del producto si debe usar "blue"
  const tipoCambio: ExchangeRateType = "oficial";

  const [data, setData] = useState<any>(null);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Siempre incluir IVA
  const incluirIva = true;

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener tasas de cambio
      const ratesResponse = await fetch('/api/exchange-rates', {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!ratesResponse.ok) {
        const errorData = await ratesResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al obtener tasas: ${ratesResponse.status}`);
      }

      const ratesData = await ratesResponse.json();
      if (ratesData.success) {
        setExchangeRates(ratesData.data);
      }

      // Obtener precio calculado
      const priceResponse = await fetch(
        `/api/calculate-price?product_id=${productId}&tipo_cambio=${tipoCambio}&incluir_iva=${incluirIva}`,
        {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!priceResponse.ok) {
        const errorData = await priceResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al calcular precio: ${priceResponse.status}`);
      }

      const priceData = await priceResponse.json();
      if (priceData.success) {
        setData(priceData.data);
      } else {
        throw new Error(priceData.message || "Error al calcular precio");
      }
    } catch (err: any) {
      console.error("[PriceDisplay] Error:", err);
      setError(err.message || "Error al cargar precios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceNumber = (price: number): string => {
    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatUSD = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatUSDNumber = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const selectedRateData = exchangeRates.find(r => r.tipo === tipoCambio);
  const selectedRateLabel = EXCHANGE_RATE_LABELS[tipoCambio];

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold text-sm">Error al cargar precios</p>
        </div>
        <p className="text-red-600 text-xs mb-3">{error}</p>
        <button
          onClick={fetchData}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Precio Final */}
      {isLoading ? (
        <div className="bg-gray-50 rounded p-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent mb-2"></div>
          <p className="text-gray-600 text-sm">Calculando precio...</p>
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* Precio Principal ARS */}
          <div>
            <div className="flex items-start gap-2">
              <span className="text-3xl text-gray-700 mt-1">$</span>
              <p className="text-4xl font-normal text-[#333333] leading-tight">
                {formatPriceNumber(data.precio_ars.final)}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Precio sin impuestos nacionales: $ {formatPriceNumber(data.precio_ars.sin_iva)}
            </p>
          </div>

          {/* Precio USD */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Precio en dólares</p>
            <div className="flex items-baseline gap-2">
              <span className="text-base text-gray-700">US$</span>
              <p className="text-xl font-medium text-[#333333]">
                {formatUSDNumber(data.precio_base_usd * 1.105)}
              </p>
            </div>
          </div>

          {/* Stock */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-900 font-medium">Stock disponible</p>
            <p className="text-sm text-gray-600 mt-1">Cantidad: 1 unidad</p>
          </div>

          {/* Botón CTA */}
          <div className="flex justify-start">
            <button className="w-[77%] bg-[#3483FA] hover:bg-[#2968C8] text-white font-semibold py-2 px-3 rounded transition-colors text-sm text-center">
              Consultar ahora
            </button>
          </div>

          {/* Información adicional */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-900 font-medium mb-1">Entrega a acordar con el vendedor</p>
              <p className="text-sm text-gray-600">Florida, Buenos Aires</p>
            </div>

            <div>
              <p className="text-sm text-gray-900 font-medium mb-1">Cotización de referencia</p>
              <p className="text-sm text-gray-600">{selectedRateLabel.label}: ${selectedRateData?.venta.toFixed(2)}</p>
            </div>
          </div>

          {/* Botón Ver Detalles */}
          <div className="flex justify-start">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-700 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              {showDetails ? "Ver menos información del precio" : "Ver más información del precio"}
              <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Panel de Detalles Expandible */}
          {showDetails && (
            <div className="bg-gray-50 rounded-lg p-2 space-y-2 w-[85%] overflow-hidden">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900">Desglose del precio</h3>

                <div className="space-y-2 bg-white rounded p-2">
                  <div className="flex justify-between text-xs gap-2">
                    <span className="text-gray-600">Precio base (sin IVA)</span>
                    <span className="font-semibold text-gray-900 text-right">$ {formatPriceNumber(data.precio_ars.sin_iva)}</span>
                  </div>

                  {data.precio_ars.iva > 0 && (
                    <div className="flex justify-between text-xs gap-2">
                      <span className="text-gray-600">IVA (10.5%)</span>
                      <span className="font-semibold text-gray-900 text-right">$ {formatPriceNumber(data.precio_ars.iva)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs pt-2 border-t border-gray-200 gap-2">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 text-right">$ {formatPriceNumber(data.precio_ars.final)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900">Tipo de cambio aplicado</h3>
                <div className="bg-white rounded p-2 text-xs">
                  <p className="font-semibold text-gray-900">
                    {selectedRateLabel.label}
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    Compra: ${selectedRateData?.compra.toFixed(2)} • Venta: ${selectedRateData?.venta.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Otras cotizaciones */}
              {exchangeRates.length > 1 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-900">Otras cotizaciones de referencia</h3>
                  <div className="grid grid-cols-2 gap-1">
                    {exchangeRates
                      .filter(rate => rate.tipo !== tipoCambio)
                      .slice(0, 4)
                      .map(rate => {
                        const label = EXCHANGE_RATE_LABELS[rate.tipo as ExchangeRateType];
                        return (
                          <div key={rate.tipo} className="bg-white rounded p-1.5 text-center">
                            <p className="text-xs text-gray-600 truncate">{label?.shortLabel}</p>
                            <p className="text-xs font-bold text-gray-900">${rate.venta.toFixed(2)}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
