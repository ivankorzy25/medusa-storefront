import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ProductGallery, ProductInfo, ProductTabs } from "@/components/products"
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
  const prices = getVariantPrice(mainVariant)

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
    },
    images: (product.images || []).map((img: any, index: number) => ({
      id: img.id || String(index),
      url: img.url || "",
      alt: img.metadata?.alt || `${product.title} - Imagen ${index + 1}`,
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
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">
              Inicio
            </a>
            <span>/</span>
            <a href="/productos" className="hover:text-blue-600">
              Productos
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Gallery */}
          <div>
            <ProductGallery images={product.images} productTitle={product.title} />
          </div>

          {/* Right Column - Info */}
          <div>
            <ProductInfo
              title={product.title}
              sku={product.sku}
              description={product.description}
              metadata={product.metadata}
              priceWithoutTax={product.priceWithoutTax}
              priceWithTax={product.priceWithTax}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-6xl mx-auto">
          <ProductTabs documents={documents} />
        </div>
      </div>
    </div>
  )
}
