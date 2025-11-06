"use client";

import React, { useState } from "react";
import { FileText, Settings, Zap, Package } from "lucide-react";

interface ProductInfoTabsProps {
  description?: string;
  metadata?: Record<string, any>;
  variants?: Array<{
    id: string;
    title: string;
    sku: string;
  }>;
}

type TabType = "descripcion" | "especificaciones" | "aplicaciones" | "variantes";

export function ProductInfoTabs({ description, metadata, variants }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("descripcion");

  const tabs = [
    { id: "descripcion" as TabType, label: "Descripción", icon: FileText },
    { id: "especificaciones" as TabType, label: "Especificaciones", icon: Settings },
    { id: "aplicaciones" as TabType, label: "Aplicaciones", icon: Zap },
    ...(variants && variants.length > 0
      ? [{ id: "variantes" as TabType, label: "Variantes", icon: Package }]
      : []),
  ];

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex gap-1 border-b-2 border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#FF6B00] border-b-4 border-[#FF6B00] -mb-[2px] bg-red-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-8 animate-fadeIn">
        {/* Descripción */}
        {activeTab === "descripcion" && (
          <div className="prose max-w-none">
            {description ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#FF6B00]" />
                  Descripción del Producto
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay descripción disponible</p>
            )}
          </div>
        )}

        {/* Especificaciones */}
        {activeTab === "especificaciones" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#FF6B00]" />
              Especificaciones Técnicas
            </h3>
            {metadata && Object.keys(metadata).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:border-[#FF6B00] group"
                  >
                    <p className="text-sm font-medium text-gray-600 capitalize mb-1 group-hover:text-[#FF6B00] transition-colors">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {typeof value === "boolean"
                        ? value
                          ? "Sí"
                          : "No"
                        : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay especificaciones disponibles</p>
            )}
          </div>
        )}

        {/* Aplicaciones */}
        {activeTab === "aplicaciones" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#FF6B00]" />
              Aplicaciones Industriales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Hospitales y Clínicas",
                  description: "Respaldo crítico para equipos médicos y quirófanos",
                  icon: "🏥",
                },
                {
                  title: "Centros de Datos",
                  description: "Energía ininterrumpida para infraestructura TI crítica",
                  icon: "💻",
                },
                {
                  title: "Industria Manufacturera",
                  description: "Continuidad operacional para líneas de producción",
                  icon: "🏭",
                },
                {
                  title: "Edificios Comerciales",
                  description: "Respaldo para sistemas críticos y elevadores",
                  icon: "🏢",
                },
                {
                  title: "Instalaciones Agrícolas",
                  description: "Energía confiable para sistemas de riego",
                  icon: "🌾",
                },
                {
                  title: "Telecomunicaciones",
                  description: "Respaldo para antenas y centros de switching",
                  icon: "📡",
                },
              ].map((app, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:border-[#FF6B00] hover:-translate-y-1 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {app.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#FF6B00] transition-colors">
                    {app.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{app.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variantes */}
        {activeTab === "variantes" && variants && variants.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#FF6B00]" />
              Variantes Disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#FF6B00] hover:shadow-lg transition-all duration-300"
                >
                  <p className="font-semibold text-lg text-gray-900 mb-2">
                    {variant.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">SKU:</span> {variant.sku}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
