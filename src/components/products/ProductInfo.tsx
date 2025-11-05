"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ShoppingCart,
  Heart,
  Share2,
  Zap,
  Gauge,
  Settings,
  Package,
  Phone,
  MessageCircle,
  Mail,
} from "lucide-react"
import { formatPrice } from "@/lib/format-price"

interface ProductMetadata {
  potencia_standby_kva?: number
  potencia_prime_kva?: number
  motor_marca?: string
  motor_modelo?: string
  alternador_marca?: string
  alternador_modelo?: string
  tipo_refrigeracion?: string
  voltaje_salida?: string
  frecuencia_salida?: string
  tipo_arranque?: string
  capacidad_tanque_l?: number
  consumo_75_carga_lh?: number
  rpm_motor?: number
  nivel_ruido_dba?: number
  precio_sin_iva?: number
  precio_con_iva?: number
}

interface ProductInfoProps {
  title: string
  sku: string
  description?: string
  metadata?: ProductMetadata
  priceWithoutTax: number
  priceWithTax: number
}

export function ProductInfo({
  title,
  sku,
  description,
  metadata,
  priceWithoutTax,
  priceWithTax,
}: ProductInfoProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || "",
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="font-medium">SKU:</span>
          <span className="font-mono">{sku}</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Key Specs */}
      {metadata && (
        <div className="grid grid-cols-2 gap-3">
          {metadata.potencia_standby_kva && (
            <Card className="p-4 flex items-center gap-3 bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Stand-By</p>
                <p className="text-lg font-bold text-gray-900">
                  {metadata.potencia_standby_kva} KVA
                </p>
              </div>
            </Card>
          )}
          {metadata.potencia_prime_kva && (
            <Card className="p-4 flex items-center gap-3 bg-gradient-to-br from-green-50 to-white border-green-200">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Prime</p>
                <p className="text-lg font-bold text-gray-900">
                  {metadata.potencia_prime_kva} KVA
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Technical Highlights */}
      {metadata && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Especificaciones Principales
          </h3>
          <div className="grid gap-2 text-sm">
            {metadata.motor_marca && metadata.motor_modelo && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Motor:</span>
                <span className="font-medium text-gray-900">
                  {metadata.motor_marca} {metadata.motor_modelo}
                </span>
              </div>
            )}
            {metadata.alternador_marca && metadata.alternador_modelo && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Alternador:</span>
                <span className="font-medium text-gray-900">
                  {metadata.alternador_marca} {metadata.alternador_modelo}
                </span>
              </div>
            )}
            {metadata.rpm_motor && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">RPM:</span>
                <span className="font-medium text-gray-900">
                  {metadata.rpm_motor} RPM
                </span>
              </div>
            )}
            {metadata.capacidad_tanque_l && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tanque:</span>
                <span className="font-medium text-gray-900">
                  {metadata.capacidad_tanque_l} litros
                </span>
              </div>
            )}
            {metadata.consumo_75_carga_lh && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Consumo (75%):</span>
                <span className="font-medium text-gray-900">
                  {metadata.consumo_75_carga_lh} L/h
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-2">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Precio sin IVA:</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(priceWithoutTax)}
            </p>
          </div>
          <div className="pt-3 border-t">
            <p className="text-sm text-gray-600 mb-1">Precio final con IVA:</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(priceWithTax)}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Precio sujeto a cambios sin previo aviso
          </p>
        </div>
      </Card>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Solicitar Cotización
        </Button>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="lg" className="flex-col h-auto py-3">
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs">Favorito</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-col h-auto py-3"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5 mb-1" />
            <span className="text-xs">Compartir</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-auto py-3">
            <Package className="h-5 w-5 mb-1" />
            <span className="text-xs">Comparar</span>
          </Button>
        </div>
      </div>

      {/* Contact Options */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">
          ¿Necesitás asesoramiento?
        </h3>
        <div className="space-y-3">
          <a
            href="tel:+541139563099"
            className="flex items-center gap-3 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Phone className="h-5 w-5" />
            <span>+54 11 3956-3099</span>
          </a>
          <a
            href="https://wa.me/541139563099"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-green-600 hover:text-green-800 font-medium"
          >
            <MessageCircle className="h-5 w-5" />
            <span>WhatsApp</span>
          </a>
          <a
            href="mailto:info@korinnovacion.ar"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            <Mail className="h-5 w-5" />
            <span>info@korinnovacion.ar</span>
          </a>
        </div>
      </Card>

      {/* Delivery Info */}
      <div className="text-sm text-gray-600 space-y-2 pt-4 border-t">
        <p className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Entrega en 15-30 días hábiles
        </p>
        <p className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Instalación disponible (cotizar aparte)
        </p>
      </div>
    </div>
  )
}
