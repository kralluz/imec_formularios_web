"use client"

import Link from "next/link"
import {
  FaShieldAlt,
  FaQuestionCircle,
  FaFileContract,
  FaInfoCircle,
} from "react-icons/fa"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap justify-between gap-y-8">
          {/* Branding */}
          <div className="w-full sm:w-1/2 lg:w-1/4">
            <h2 className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              <span className="text-purple-600 dark:text-purple-400">IMEC</span> Formulários
            </h2>
          </div>

          {/* Documentos */}
          <div className="w-full sm:w-1/2 lg:w-1/4">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-800 dark:text-white">Documentos</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/about"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaInfoCircle className="mr-2" />
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaFileContract className="mr-2" />
                  Políticas
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaShieldAlt className="mr-2" />
                  Segurança
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div className="w-full sm:w-1/2 lg:w-1/4">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-800 dark:text-white">Suporte</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaQuestionCircle className="mr-2" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaFileContract className="mr-2" />
                  Termo de Responsabilidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} IMEC Formulários. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
