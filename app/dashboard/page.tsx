import { PdfList } from "@/components/pdf-list"

export default function DashboardPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white animate-slide-up opacity-0">
        <span className="text-purple-600 dark:text-purple-400">Formulários</span>
      </h1>
      <PdfList />
    </>
  )
}

