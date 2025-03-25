"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import SectorService from "@/services/sector-service"
import { useCustomToast } from "@/hooks/use-custom-toast"
import type { Sector, CreateSectorDTO, UpdateSectorDTO } from "@/types/sector"

type SectorContextType = {
  sectors: Sector[]
  isLoading: boolean
  error: string | null
  hasLoaded: boolean

  // Métodos para setores
  loadSectors: () => Promise<void>
  getSector: (id: string) => Promise<Sector | null>
  createSector: (data: CreateSectorDTO) => Promise<Sector | null>
  updateSector: (id: string, data: UpdateSectorDTO) => Promise<Sector | null>
  deleteSector: (id: string) => Promise<boolean>
}

const SectorContext = createContext<SectorContextType | undefined>(undefined)

export function SectorProvider({ children }: { children: React.ReactNode }) {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const toast = useCustomToast()

  // Método para carregar todos os setores
  const loadSectors = useCallback(async () => {
    // Se já carregou os dados e tem setores, não precisa carregar novamente
    if (hasLoaded && sectors.length > 0) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await SectorService.getAllSectors()
      setSectors(data)
      setHasLoaded(true)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao carregar setores"
      setError(errorMessage)
      console.error("Erro ao carregar setores:", err)
    } finally {
      setIsLoading(false)
    }
  }, [hasLoaded, sectors.length, toast])

  // Método para buscar um setor por ID
  const getSector = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await SectorService.getSectorById(id)
        return data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao buscar setor"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // Método para criar um setor
  const createSector = useCallback(
    async (data: CreateSectorDTO) => {
      setIsLoading(true)
      setError(null)

      try {
        const newSector = await SectorService.createSector(data)
        setSectors((prev) => [...prev, newSector])
        toast.success("Sucesso", "Setor criado com sucesso")
        return newSector
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao criar setor"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // Método para atualizar um setor
  const updateSector = useCallback(
    async (id: string, data: UpdateSectorDTO) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedSector = await SectorService.updateSector(id, data)
        setSectors((prev) => prev.map((s) => (s.id === id ? updatedSector : s)))
        toast.success("Sucesso", "Setor atualizado com sucesso")
        return updatedSector
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao atualizar setor"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // Método para excluir um setor
  const deleteSector = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await SectorService.deleteSector(id)
        setSectors((prev) => prev.filter((s) => s.id !== id))
        toast.success("Sucesso", "Setor excluído com sucesso")
        return true
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao excluir setor"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const value = {
    sectors,
    isLoading,
    error,
    hasLoaded,
    loadSectors,
    getSector,
    createSector,
    updateSector,
    deleteSector,
  }

  return <SectorContext.Provider value={value}>{children}</SectorContext.Provider>
}

export function useSector() {
  const context = useContext(SectorContext)

  if (context === undefined) {
    throw new Error("useSector deve ser usado dentro de um SectorProvider")
  }

  return context
}

