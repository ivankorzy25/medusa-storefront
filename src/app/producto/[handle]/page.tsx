import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ProductGallery, ProductInfo, ProductTabs } from "@/components/products"
import { ImageCarousel } from "@/components/products/ImageCarousel"
import { ProductInfoTabs } from "@/components/products/ProductInfoTabs"
import { PriceDisplay } from "@/components/products/PriceDisplay"
import { ScrollHijackingContainer } from "@/components/products/ScrollHijackingContainer"
import { getProductByHandle as fetchProductByHandle, getVariantPrice } from "@/lib/medusa-client"

// Fetch product from Medusa API
async function getProductByHandle(handle: string) {
  const product = await fetchProductByHandle(handle)

  if (!product) {
    return null
  }

  // Get the first variant (most products have one main variant)
  const mainVariant = product.variants?.[0]
  if (!mainVariant) {
    return null
  }

  // Get prices from variant
  const prices = await getVariantPrice(mainVariant)

  // Transform Medusa product to component-friendly format
  return {
    id: product.id,
    title: product.title || "",
    handle: product.handle || "",
    sku: mainVariant.sku || "",
    description: product.description || "",
    priceWithoutTax: prices.priceWithoutTax,
    priceWithTax: prices.priceWithTax,
    currency: prices.currency,
    // Campos nativos de Medusa (peso y dimensiones)
    weight: product.weight,
    length: product.length,
    width: product.width,
    height: product.height,
    origin_country: product.origin_country,
    metadata: {
      // Electric specs
      potencia_standby_kva: product.metadata?.potencia_stand_by ? Number(product.metadata.potencia_stand_by) : undefined,
      potencia_prime_kva: product.metadata?.potencia_prime ? Number(product.metadata.potencia_prime) : undefined,
      motor_marca: product.metadata?.motor_marca as string | undefined,
      motor_modelo: product.metadata?.motor_modelo as string | undefined,
      alternador_marca: product.metadata?.alternador_marca as string | undefined,
      alternador_modelo: product.metadata?.alternador_modelo as string | undefined,
      tipo_refrigeracion: product.metadata?.motor_refrigeracion as string | undefined,
      voltaje_salida: product.metadata?.voltaje as string | undefined,
      frecuencia_salida: product.metadata?.frecuencia as string | undefined,
      capacidad_tanque_l: product.metadata?.combustible_capacidad_tanque ? Number(product.metadata.combustible_capacidad_tanque) : undefined,
      consumo_75_carga_lh: product.metadata?.motor_consumo_75_carga ? Number(product.metadata.motor_consumo_75_carga) : undefined,
      rpm_motor: product.metadata?.motor_rpm ? Number(product.metadata.motor_rpm) : undefined,
      // Pricing config
      pricing_config: product.metadata?.pricing_config as any | undefined,
      // Promotional discount
      descuento_porcentaje: product.metadata?.descuento_porcentaje ? Number(product.metadata.descuento_porcentaje) : undefined,
      precio_anterior: product.metadata?.precio_anterior ? Number(product.metadata.precio_anterior) : undefined,
      // Sales tracking
      total_ventas: product.metadata?.total_ventas ? Number(product.metadata.total_ventas) : undefined,
      es_mas_vendido: product.metadata?.es_mas_vendido === true || product.metadata?.es_mas_vendido === 'true',
      categoria: product.metadata?.categoria as string | undefined,
      // Rating and reviews
      rating_promedio: product.metadata?.rating_promedio ? Number(product.metadata.rating_promedio) : undefined,
      total_reviews: product.metadata?.total_reviews ? Number(product.metadata.total_reviews) : undefined,
      // Product status
      estado_producto: product.metadata?.estado_producto as string | undefined,
      // Stock
      stock_cantidad: product.metadata?.stock_cantidad ? Number(product.metadata.stock_cantidad) : undefined,
      stock_disponible: product.metadata?.stock_disponible === true || product.metadata?.stock_disponible === 'true',
      // Shipping location
      ubicacion_envio: product.metadata?.ubicacion_envio as any | undefined,
      // Additional product attributes
      combustible_tipo: product.metadata?.combustible_tipo as string | undefined,
      tiene_tta: product.metadata?.tiene_tta as string | undefined,
      tiene_cabina: product.metadata?.tiene_cabina === true || product.metadata?.tiene_cabina === 'true',
      nivel_ruido_db: product.metadata?.nivel_ruido_db as string | undefined,
      insonorizacion_tipo: product.metadata?.insonorizacion_tipo as string | undefined,
      financiacion_disponible: product.metadata?.financiacion_disponible === true || product.metadata?.financiacion_disponible === 'true',
      planes_financiacion: product.metadata?.planes_financiacion as any[] | undefined,
    },
    images: (product.images || []).map((img: any, index: number) => ({
      id: img.id || String(index),
      url: img.url || "",
      alt: img.metadata?.alt || `${product.title} - Imagen ${index + 1}`,
    })),
    variants: (product.variants || []).map((variant: any) => ({
      id: variant.id,
      title: variant.title || product.title,
      sku: variant.sku || "",
    })),
  }
}

async function getProductDocuments(productId: string) {
  // TODO: Replace with actual database query
  // For now, return mock documents

  return [
    {
      id: "1",
      product_id: productId,
      document_type: "faq",
      title: "Preguntas Frecuentes - Cummins CS200A",
      content_html: `
        <div class="preguntas-frecuentes">
          <div class="faq-category">
            <h3>Operación y Funcionamiento</h3>
            <div class="faq-item">
              <h4>¿El Cummins CS200A arranca automáticamente cuando se corta la luz?</h4>
              <p>Sí, el panel Comap MRS16 incluye función auto-start. Cuando detecta corte de red, arranca automáticamente el generador en 8-10 segundos y alimenta las cargas. Cuando vuelve la corriente, retorna a la red y apaga el generador con enfriamiento progresivo. <strong>Requiere tablero de transferencia automática (TTA)</strong> que se cotiza aparte.</p>
            </div>
            <div class="faq-item">
              <h4>¿Puedo usarlo en forma continua 24/7 o solo para emergencias?</h4>
              <p>Sí, este generador está diseñado para uso continuo. El motor Cummins 1500 RPM es de ciclo industrial apto para operación 24/7 en potencia Prime (180 KVA). Muchos clientes lo usan como alimentación primaria en zonas sin red eléctrica. Requiere mantenimientos cada 250 horas.</p>
            </div>
          </div>

          <div class="faq-category">
            <h3>Especificaciones Técnicas</h3>
            <div class="faq-item">
              <h4>¿Qué diferencia hay entre 200 KVA Stand-By y 180 KVA Prime?</h4>
              <p><strong>Stand-By (200 KVA)</strong> es la potencia máxima para uso ocasional de emergencia (algunas horas al mes). <strong>Prime (180 KVA)</strong> es la potencia para operación continua prolongada (muchas horas diarias). Si vas a usar el generador frecuentemente o varias horas seguidas, dimensioná según potencia Prime.</p>
            </div>
          </div>
        </div>
      `,
      file_url: null,
      display_order: 1,
      is_featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      product_id: productId,
      document_type: "especificaciones",
      title: "Especificaciones Técnicas Completas",
      content_html: `
        <div class="especificaciones">
          <h3>Motor Cummins 6BTAA5.9-G2</h3>
          <table>
            <tr><th>Especificación</th><th>Valor</th></tr>
            <tr><td>Marca</td><td>Cummins</td></tr>
            <tr><td>Modelo</td><td>6BTAA5.9-G2</td></tr>
            <tr><td>Tipo</td><td>Diesel 4 tiempos</td></tr>
            <tr><td>Cilindros</td><td>6 en línea</td></tr>
            <tr><td>Cilindrada</td><td>5.9 litros</td></tr>
            <tr><td>RPM</td><td>1500</td></tr>
            <tr><td>Refrigeración</td><td>Líquido</td></tr>
          </table>

          <h3>Alternador Stamford HCI434F</h3>
          <table>
            <tr><th>Especificación</th><th>Valor</th></tr>
            <tr><td>Marca</td><td>Stamford</td></tr>
            <tr><td>Modelo</td><td>HCI434F</td></tr>
            <tr><td>Potencia Stand-By</td><td>200 KVA</td></tr>
            <tr><td>Potencia Prime</td><td>180 KVA</td></tr>
            <tr><td>Voltaje</td><td>380/220V Trifásico</td></tr>
            <tr><td>Frecuencia</td><td>50 Hz</td></tr>
            <tr><td>Factor de Potencia</td><td>0.8</td></tr>
          </table>
        </div>
      `,
      file_url: null,
      display_order: 2,
      is_featured: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      product_id: productId,
      document_type: "garantia",
      title: "Garantía y Condiciones",
      content_html: `
        <div class="garantia">
          <h3>Cobertura de Garantía</h3>
          <p>El CS200A cuenta con:</p>
          <ul>
            <li><strong>12 meses</strong> de garantía en equipo completo</li>
            <li><strong>24 meses</strong> de garantía en motor Cummins</li>
            <li><strong>24 meses</strong> de garantía en alternador Stamford</li>
          </ul>

          <div class="alert alert-info">
            <h4>Validez de Garantía</h4>
            <p>La garantía requiere cumplir con el plan de mantenimientos según manual del fabricante. KOR ofrece planes de mantenimiento preventivo con precio fijo anual.</p>
          </div>
        </div>
      `,
      file_url: null,
      display_order: 3,
      is_featured: false,
      created_at: new Date().toISOString(),
    },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    return {
      title: "Producto no encontrado",
    }
  }

  return {
    title: `${product.title} | Generadores.ar`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.map((img) => img.url),
      type: "website",
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  const documents = await getProductDocuments(product.id)

  return (
    <div className="min-h-screen bg-[#EDEDED]">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600 hover:underline">
              Inicio
            </a>
            <span className="text-gray-400">›</span>
            <a href="/productos" className="hover:text-blue-600 hover:underline">
              Productos
            </a>
            <span className="text-gray-400">›</span>
            <span className="text-gray-700 truncate">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-[1200px] mx-auto px-5 py-5">
        <div className="bg-white rounded-lg p-5 mb-5">
          <ScrollHijackingContainer
            imageContent={
              <ImageCarousel
                images={product.images.map(img => ({
                  id: img.id,
                  url: img.url,
                  rank: 0
                }))}
                title={product.title}
              />
            }
            centerContent={
              <div className="space-y-4">
                {/* Badges estilo MercadoLibre - Dinámicos */}
                {(product.metadata.es_mas_vendido || (product.metadata.descuento_porcentaje && product.metadata.descuento_porcentaje > 0)) && (
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    {/* Badge MÁS VENDIDO - solo si tiene flag en metadata */}
                    {product.metadata.es_mas_vendido && (
                      <span className="text-[12px] font-semibold px-2 py-1 rounded" style={{
                        color: 'rgb(255, 255, 255)',
                        backgroundColor: '#FF6633',
                        fontFamily: '"Proxima Nova", -apple-system, Roboto, Arial, sans-serif',
                        fontWeight: 600
                      }}>
                        MÁS VENDIDO
                      </span>
                    )}
                    {/* Badge OFERTA - solo si hay descuento */}
                    {product.metadata.descuento_porcentaje && product.metadata.descuento_porcentaje > 0 && (
                      <span className="text-[12px] font-semibold px-2 py-1 rounded" style={{
                        color: 'rgb(255, 255, 255)',
                        backgroundColor: '#3483FA',
                        fontFamily: '"Proxima Nova", -apple-system, Roboto, Arial, sans-serif',
                        fontWeight: 600
                      }}>
                        OFERTA DEL DÍA
                      </span>
                    )}
                  </div>
                )}

                <div>
                  {/* Subtítulo dinámico (Estado | +X vendidos) - Leer de metadata */}
                  <p className="text-[14px] font-normal mb-2" style={{
                    color: 'rgba(0, 0, 0, 0.55)',
                    fontFamily: '"Proxima Nova", -apple-system, Roboto, Arial, sans-serif'
                  }}>
                    {product.metadata.estado_producto || 'Nuevo'}
                    {product.metadata.total_ventas && product.metadata.total_ventas > 0 && (
                      <> | +{product.metadata.total_ventas} vendidos</>
                    )}
                  </p>

                  {/* Título H1 */}
                  <h1 className="text-[22px] font-semibold mb-2" style={{
                    color: 'rgba(0, 0, 0, 0.9)',
                    fontFamily: '"Proxima Nova", -apple-system, Roboto, Arial, sans-serif',
                    fontWeight: 600,
                    lineHeight: '1.25'
                  }}>
                    {product.title}
                  </h1>

                  {/* Rating estilo MercadoLibre - Leer de metadata */}
                  {product.metadata.rating_promedio && product.metadata.total_reviews && (
                    <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
                      <div className="flex items-center gap-1">
                        <span className="text-[14px] font-semibold" style={{ color: 'rgba(0, 0, 0, 0.9)' }}>
                          {product.metadata.rating_promedio.toFixed(1)}
                        </span>
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(Math.floor(product.metadata.rating_promedio))].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                          {(product.metadata.rating_promedio % 1 >= 0.5) && <span>☆</span>}
                        </div>
                      </div>
                      <span className="text-[14px] font-normal" style={{
                        color: 'rgba(0, 0, 0, 0.55)',
                        fontFamily: '"Proxima Nova", -apple-system, Roboto, Arial, sans-serif'
                      }}>
                        ({product.metadata.total_reviews})
                      </span>
                    </div>
                  )}
                </div>

                {/* Atributos Principales - Badges de Características */}
                <div className="space-y-3 py-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {/* Tipo de Combustible */}
                    {product.metadata.combustible_tipo && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: product.metadata.combustible_tipo.toLowerCase().includes('diesel')
                          ? '#FEF3C7'
                          : product.metadata.combustible_tipo.toLowerCase().includes('nafta')
                          ? '#DBEAFE'
                          : '#D1FAE5',
                        color: product.metadata.combustible_tipo.toLowerCase().includes('diesel')
                          ? '#92400E'
                          : product.metadata.combustible_tipo.toLowerCase().includes('nafta')
                          ? '#1E40AF'
                          : '#065F46'
                      }}>
                        <span>⛽</span>
                        {product.metadata.combustible_tipo}
                      </div>
                    )}

                    {/* TTA (Transferencia Automática) - Leer de metadata.tiene_tta */}
                    {product.metadata.tiene_tta === 'incluido' && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: '#DCFCE7',
                        color: '#166534'
                      }}>
                        <span>⚡</span>
                        TTA Incluido
                      </div>
                    )}
                    {product.metadata.tiene_tta === 'opcional' && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: '#FEF3C7',
                        color: '#92400E'
                      }}>
                        <span>⚡</span>
                        TTA Opcional
                      </div>
                    )}

                    {/* Cabina - Leer de metadata.tiene_cabina */}
                    {product.metadata.tiene_cabina === true && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: '#E0E7FF',
                        color: '#3730A3'
                      }}>
                        <span>🏠</span>
                        Con Cabina
                      </div>
                    )}

                    {/* Insonorizado con nivel dB */}
                    {product.metadata.nivel_ruido_db && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border-2" style={{
                        borderColor: Number(product.metadata.nivel_ruido_db) <= 65 ? '#10B981'
                          : Number(product.metadata.nivel_ruido_db) <= 75 ? '#F59E0B'
                          : '#EF4444',
                        backgroundColor: Number(product.metadata.nivel_ruido_db) <= 65 ? '#D1FAE5'
                          : Number(product.metadata.nivel_ruido_db) <= 75 ? '#FEF3C7'
                          : '#FEE2E2',
                        color: Number(product.metadata.nivel_ruido_db) <= 65 ? '#065F46'
                          : Number(product.metadata.nivel_ruido_db) <= 75 ? '#92400E'
                          : '#991B1B'
                      }}>
                        <span>🔊</span>
                        {product.metadata.nivel_ruido_db} dB
                        {/* Barra de nivel de ruido */}
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-1 h-3 rounded-full" style={{
                              backgroundColor: i < (5 - Math.floor(Number(product.metadata.nivel_ruido_db) / 20))
                                ? '#10B981'
                                : i < 3
                                ? '#F59E0B'
                                : '#EF4444',
                              opacity: i < Math.ceil(Number(product.metadata.nivel_ruido_db) / 20) ? 1 : 0.2
                            }}></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Peso - Campo NATIVO de Medusa */}
                    {product.weight && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: '#F3F4F6',
                        color: '#374151'
                      }}>
                        <span>⚖️</span>
                        {product.weight} kg
                      </div>
                    )}

                    {/* Dimensiones - Campos NATIVOS de Medusa */}
                    {(product.length && product.width && product.height) && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: '#F3F4F6',
                        color: '#374151'
                      }}>
                        <span>📏</span>
                        {Math.round(Number(product.length)/10)}×{Math.round(Number(product.width)/10)}×{Math.round(Number(product.height)/10)} cm
                      </div>
                    )}
                  </div>
                </div>

                {/* Características destacadas */}
                <div className="space-y-3">
                  <h2 className="text-base font-bold text-gray-900">Lo que tenés que saber de este producto</h2>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {product.metadata.motor_marca && product.metadata.motor_modelo && (
                      <li>• Motor {product.metadata.motor_marca} {product.metadata.motor_modelo}</li>
                    )}
                    {product.metadata.potencia_prime_kva && (
                      <li>• Potencia Prime: {product.metadata.potencia_prime_kva} KVA</li>
                    )}
                    {product.metadata.potencia_standby_kva && (
                      <li>• Potencia Stand-By: {product.metadata.potencia_standby_kva} KVA</li>
                    )}
                    {product.metadata.tipo_refrigeracion && (
                      <li>• Refrigeración: {product.metadata.tipo_refrigeracion}</li>
                    )}
                    {product.metadata.alternador_marca && (
                      <li>• Alternador {product.metadata.alternador_marca}</li>
                    )}
                    {product.metadata.voltaje_salida && (
                      <li>• Voltaje: {product.metadata.voltaje_salida}</li>
                    )}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">SKU: {product.sku}</p>
                </div>
              </div>
            }
            rightContent={
              <PriceDisplay
                productId={product.id}
                priceUSD={product.priceWithoutTax}
                pricingConfig={product.metadata.pricing_config}
                descuentoPorcentaje={product.metadata.descuento_porcentaje}
                precioAnterior={product.metadata.precio_anterior}
                financiacionDisponible={product.metadata.financiacion_disponible}
                planesFinanciacion={product.metadata.planes_financiacion}
                stockCantidad={product.metadata.stock_cantidad}
                stockDisponible={product.metadata.stock_disponible}
                ubicacionEnvio={product.metadata.ubicacion_envio}
              />
            }
          />
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white rounded p-6 mb-6">
          <ProductInfoTabs
            description={product.description}
            metadata={product.metadata}
            variants={product.variants}
          />
        </div>

        {/* Document Tabs Section */}
        <div className="bg-white rounded p-6">
          <ProductTabs documents={documents} />
        </div>
      </div>
    </div>
  )
}
