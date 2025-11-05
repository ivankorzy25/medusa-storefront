"use client";

import { useEffect, useState } from "react";
import { medusaConfig } from "@/lib/config";

interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle: string;
  thumbnail?: string;
  images?: Array<{ id: string; url: string; rank: number }>;
  variants?: Array<{
    id: string;
    title: string;
    sku: string;
  }>;
  metadata?: Record<string, any>;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setDebugInfo(`Intentando conectar a: ${medusaConfig.baseUrl}/store/products`);
        
        const response = await fetch(`${medusaConfig.baseUrl}/store/products`, {
          headers: {
            "x-publishable-api-key": medusaConfig.publishableKey,
            "Content-Type": "application/json",
          },
        });

        setDebugInfo(`Respuesta recibida: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.products || []);
        setDebugInfo(`Productos cargados: ${data.products?.length || 0}`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error al cargar productos";
        setError(errorMsg);
        setDebugInfo(`Error: ${errorMsg}`);
        console.error("Error completo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
          <p className="mt-2 text-sm text-gray-500">{debugInfo}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-red-600">Error</p>
          <p className="mt-2 text-gray-700">{error}</p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-sm font-mono">{debugInfo}</p>
            <p className="text-sm font-mono mt-2">Backend URL: {medusaConfig.baseUrl}</p>
            <p className="text-sm font-mono">API Key: {medusaConfig.publishableKey?.substring(0, 20)}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No hay productos disponibles</p>
          <p className="mt-2 text-sm text-gray-500">{debugInfo}</p>
        </div>
      </div>
    );
  }

  const product = products[0]; // CS200A

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">{product.title}</h1>
            {product.subtitle && (
              <p className="text-blue-100 mt-2">{product.subtitle}</p>
            )}
          </div>

          <div className="p-8">
            {/* Imágenes del producto */}
            {product.images && product.images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Galería de Imágenes
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.images.slice(0, 8).map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} - Imagen ${image.rank + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {product.images.length > 8 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{product.images.length - 8} imágenes más disponibles
                  </p>
                )}
              </div>
            )}

            {/* Descripción */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Descripción
                </h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}

            {/* Variantes */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Variantes Disponibles
                </h2>
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="border border-gray-200 rounded-lg p-4 mb-2"
                  >
                    <p className="font-medium text-gray-800">{variant.title}</p>
                    <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Metadata - Información técnica */}
            {product.metadata && Object.keys(product.metadata).length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Especificaciones Técnicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.metadata).slice(0, 20).map(([key, value]) => (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {typeof value === "boolean"
                          ? value
                            ? "Sí"
                            : "No"
                          : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
