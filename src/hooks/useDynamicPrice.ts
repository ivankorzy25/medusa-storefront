"use client";

import { useState, useEffect, useCallback } from "react";
import { medusaConfig } from "@/lib/config";

export type ExchangeRateType =
  | "oficial"
  | "blue"
  | "mep"
  | "ccl"
  | "mayorista"
  | "cripto"
  | "tarjeta";

export interface ExchangeRate {
  tipo: ExchangeRateType;
  compra: number;
  venta: number;
  fuente: string;
  ultima_actualizacion: string;
}

export interface PriceARS {
  sin_iva: number;
  iva: number;
  final: number;
}

export interface DynamicPriceData {
  product: {
    id: string;
    title: string;
    sku: string;
  };
  precio_base_usd: number;
  cotizacion: ExchangeRate;
  precio_ars: PriceARS;
  calculo: {
    formula: string;
    pasos: string[];
  };
}

interface UseDynamicPriceOptions {
  productId?: string;
  tipoCambio?: ExchangeRateType;
  incluirIva?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
}

interface UseDynamicPriceResult {
  data: DynamicPriceData | null;
  exchangeRates: ExchangeRate[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setTipoCambio: (tipo: ExchangeRateType) => void;
  setIncluirIva: (incluir: boolean) => void;
}

export function useDynamicPrice(options: UseDynamicPriceOptions = {}): UseDynamicPriceResult {
  const {
    productId,
    tipoCambio: initialTipoCambio = "oficial",
    incluirIva: initialIncluirIva = true,
    autoRefresh = true,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [data, setData] = useState<DynamicPriceData | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoCambio, setTipoCambio] = useState<ExchangeRateType>(initialTipoCambio);
  const [incluirIva, setIncluirIva] = useState(initialIncluirIva);

  // Fetch all exchange rates
  const fetchExchangeRates = useCallback(async () => {
    try {
      const response = await fetch(`${medusaConfig.baseUrl}/exchange-rates`);

      if (!response.ok) {
        throw new Error(`Error fetching exchange rates: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setExchangeRates(result.data);
      }
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
      // Don't set error state here, as this is a background fetch
    }
  }, []);

  // Fetch dynamic price for product
  const fetchDynamicPrice = useCallback(async () => {
    if (!productId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        product_id: productId,
        tipo_cambio: tipoCambio,
        incluir_iva: incluirIva.toString(),
      });

      const response = await fetch(
        `${medusaConfig.baseUrl}/exchange-rates/calculate-price?${params}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Error calculating price");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar precio";
      setError(errorMessage);
      console.error("Error fetching dynamic price:", err);
    } finally {
      setIsLoading(false);
    }
  }, [productId, tipoCambio, incluirIva]);

  // Fetch both exchange rates and dynamic price
  const refetch = useCallback(async () => {
    await Promise.all([fetchExchangeRates(), fetchDynamicPrice()]);
  }, [fetchExchangeRates, fetchDynamicPrice]);

  // Initial fetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchExchangeRates();
      // Only refetch price if it was already loaded
      if (data) {
        fetchDynamicPrice();
      }
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchExchangeRates, fetchDynamicPrice, data]);

  return {
    data,
    exchangeRates,
    isLoading,
    error,
    refetch,
    setTipoCambio,
    setIncluirIva,
  };
}
