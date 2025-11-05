"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Shield, Settings, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductDocument {
  id: string
  product_id: string
  document_type: string
  title: string
  content_html: string | null
  file_url: string | null
  display_order: number
  is_featured: boolean
  created_at: string
}

interface ProductTabsProps {
  documents: ProductDocument[]
  className?: string
}

const TAB_ICONS = {
  faq: FileText,
  garantia: Shield,
  especificaciones: Settings,
  servicios: Wrench,
} as const

const TAB_LABELS = {
  faq: "Preguntas Frecuentes",
  garantia: "Garantía",
  especificaciones: "Especificaciones",
  servicios: "Servicios",
} as const

export function ProductTabs({ documents, className }: ProductTabsProps) {
  if (!documents || documents.length === 0) {
    return null
  }

  // Sort documents by display_order
  const sortedDocuments = [...documents].sort(
    (a, b) => a.display_order - b.display_order
  )

  // Get the first document as default tab
  const defaultTab = sortedDocuments[0]?.document_type || "faq"

  return (
    <div className={cn("w-full", className)}>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
          {sortedDocuments.map((doc) => {
            const IconComponent =
              TAB_ICONS[doc.document_type as keyof typeof TAB_ICONS] || FileText
            const label =
              TAB_LABELS[doc.document_type as keyof typeof TAB_LABELS] ||
              doc.title

            return (
              <TabsTrigger
                key={doc.id}
                value={doc.document_type}
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {sortedDocuments.map((doc) => (
          <TabsContent
            key={doc.id}
            value={doc.document_type}
            className="mt-6 space-y-4"
          >
            {/* Document Title */}
            {doc.title && (
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {doc.title}
                </h2>
              </div>
            )}

            {/* HTML Content */}
            {doc.content_html && (
              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-blue-700
                  prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-h4:font-semibold
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                  prose-li:text-gray-700 prose-li:mb-2
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  [&_.faq-category]:mb-8 [&_.faq-category]:pb-6 [&_.faq-category]:border-b
                  [&_.faq-item]:mb-5 [&_.faq-item]:p-4 [&_.faq-item]:bg-gray-50 [&_.faq-item]:rounded-lg
                  [&_.alert]:p-4 [&_.alert]:rounded-lg [&_.alert]:bg-blue-50 [&_.alert]:border [&_.alert]:border-blue-200
                  [&_.alert-info]:bg-blue-50 [&_.alert-info]:border-blue-200
                  [&_.list-unstyled]:list-none [&_.list-unstyled]:pl-0
                  [&_table]:border-collapse [&_table]:w-full [&_table]:my-6
                  [&_th]:bg-gray-100 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_th]:border [&_th]:border-gray-300
                  [&_td]:p-3 [&_td]:border [&_td]:border-gray-300
                "
                dangerouslySetInnerHTML={{ __html: doc.content_html }}
              />
            )}

            {/* File Download Link */}
            {doc.file_url && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FileText className="h-5 w-5" />
                  Descargar {doc.title}
                </a>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
