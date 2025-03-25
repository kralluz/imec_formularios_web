"use client"

import { useEffect, useState } from "react"
import { FaSignOutAlt, FaUser, FaClipboardList, FaBuilding, FaBars, FaTimes } from "react-icons/fa"
import { MdDarkMode, MdLightMode } from "react-icons/md"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useCustomToast } from "@/hooks/use-custom-toast"

export function DashboardHeader() {
  const [darkMode, setDarkMode] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const toast = useCustomToast()

  useEffect(() => {
    // Verificar preferência de tema
    if (typeof window !== "undefined") {
      setDarkMode(document.documentElement.classList.contains("dark"))
    }
  }, [])

  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark")
      const newMode = !darkMode
      setDarkMode(newMode)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)

      toast.info(
        `Tema ${newMode ? "escuro" : "claro"} ativado`,
        `O tema foi alterado para o modo ${newMode ? "escuro" : "claro"}.`,
      )
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("Logout realizado com sucesso", "Você foi redirecionado para a página de login.")
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:px-6 md:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white md:text-2xl">
            <span className="text-purple-600 dark:text-purple-400">IMEC</span> Formulários
          </h1>
        </div>

        {/* Mobile menu button */}
        <button
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          {user?.role === "ADMIN" && (
            <div className="flex items-center gap-2">
              <Link href="/admin/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover-lift"
                >
                  <FaUser className="mr-2 text-purple-600 dark:text-purple-400" />
                  Usuários
                </Button>
              </Link>
              <Link href="/admin/questionnaires">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover-lift"
                >
                  <FaClipboardList className="mr-2 text-purple-600 dark:text-purple-400" />
                  Questionários
                </Button>
              </Link>
              <Link href="/admin/sectors">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover-lift"
                >
                  <FaBuilding className="mr-2 text-purple-600 dark:text-purple-400" />
                  Setores
                </Button>
              </Link>
            </div>
          )}

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover-lift"
              >
                <FaUser className="text-purple-600 dark:text-purple-400" />
                <span className="max-w-[100px] truncate">{user?.name || "Usuário"}</span>
                {user?.role === "ADMIN" && (
                  <span className="ml-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer">
                {darkMode ? <MdLightMode className="mr-2" size={16} /> : <MdDarkMode className="mr-2" size={16} />}
                {darkMode ? "Modo Claro" : "Modo Escuro"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                <FaSignOutAlt className="mr-2" size={16} />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-20 border-b border-gray-200 bg-white px-4 py-2 shadow-md dark:border-gray-800 dark:bg-gray-900 md:hidden">
            <div className="flex flex-col space-y-2 py-2">
              {user?.role === "ADMIN" && (
                <>
                  <Link href="/admin/users">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <FaUser className="mr-2 text-purple-600 dark:text-purple-400" />
                      Usuários
                    </Button>
                  </Link>
                  <Link href="/admin/questionnaires">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <FaClipboardList className="mr-2 text-purple-600 dark:text-purple-400" />
                      Questionários
                    </Button>
                  </Link>
                  <Link href="/admin/sectors">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <FaBuilding className="mr-2 text-purple-600 dark:text-purple-400" />
                      Setores
                    </Button>
                  </Link>
                </>
              )}
              <div className="py-1">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  <FaUser className="text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">{user?.name || "Usuário"}</span>
                  {user?.role === "ADMIN" && (
                    <span className="ml-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="w-full justify-start text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <MdLightMode className="mr-2 text-purple-600 dark:text-purple-400" size={16} />
                ) : (
                  <MdDarkMode className="mr-2 text-purple-600 dark:text-purple-400" size={16} />
                )}
                {darkMode ? "Modo Claro" : "Modo Escuro"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <FaSignOutAlt className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

