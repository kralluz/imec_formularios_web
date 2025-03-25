"use client"

import Link from "next/link"
import { FaHeart, FaShieldAlt, FaQuestionCircle, FaFileContract, FaInfoCircle } from "react-icons/fa"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col">
            <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
              <span className="text-purple-600 dark:text-purple-400">IMEC</span> Formulários
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Sistema de gerenciamento de formulários médicos para profissionais de saúde.
            </p>
            <div className="mt-auto flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Feito com</span>
              <FaHeart className="mx-1 text-purple-600 dark:text-purple-400" />
              <span>pela equipe IMEC</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-800 dark:text-white">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  Administração
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  Ajuda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-800 dark:text-white">Documentos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="flex items-center text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  <FaInfoCircle className="mr-2 text-purple-600 dark:text-purple-400" />
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="flex items-center text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  <FaFileContract className="mr-2 text-purple-600 dark:text-purple-400" />
                  Políticas
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="flex items-center text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  <FaShieldAlt className="mr-2 text-purple-600 dark:text-purple-400" />
                  Segurança
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-800 dark:text-white">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="flex items-center text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  <FaQuestionCircle className="mr-2 text-purple-600 dark:text-purple-400" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  <FaFileContract className="mr-2 text-purple-600 dark:text-purple-400" />
                  Termo de Responsabilidade
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  <FaInfoCircle className="mr-2 text-purple-600 dark:text-purple-400" />
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} IMEC Formulários. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Privacidade
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Cookies
              </Link>
              <Link
                href="/legal"
                className="text-sm text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

