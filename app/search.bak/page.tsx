import { Suspense } from "react"
import dynamicImport from "next/dynamic"

const SearchClient = dynamicImport(() => import("./search-client"), {
  ssr: false,
})

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando búsqueda…</div>}>
      <SearchClient />
    </Suspense>
  )
}
