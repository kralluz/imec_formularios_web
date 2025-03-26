"use client";

import Link from "next/link";
import {
  FaShieldAlt,
  FaQuestionCircle,
  FaFileContract,
  FaInfoCircle,
} from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {/* Branding */}
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              <span className="text-purple-600 dark:text-purple-400">IMEC</span>{" "}
              Formulários
            </h2>
          </div>

          {/* Links Horizontais */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-8">
            <ul className="flex space-x-4 text-sm">
              <li>
                <Link
                  href="/about"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaInfoCircle className="mr-1" />
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaFileContract className="mr-1" />
                  Políticas
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaShieldAlt className="mr-1" />
                  Segurança
                </Link>
              </li>
            </ul>
            <ul className="flex space-x-4 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaQuestionCircle className="mr-1" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaFileContract className="mr-1" />
                  Termo de Responsabilidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} IMEC Formulários. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
