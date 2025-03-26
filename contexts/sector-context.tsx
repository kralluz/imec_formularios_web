"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { notification } from "antd";
import SectorService from "@/services/sector-service";
import type { Sector, CreateSectorDTO, UpdateSectorDTO } from "@/types/sector";

type SectorContextType = {
  sectors: Sector[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  loadSectors: () => Promise<void>;
  getSector: (id: string) => Promise<Sector | null>;
  createSector: (data: CreateSectorDTO) => Promise<Sector | null>;
  updateSector: (id: string, data: UpdateSectorDTO) => Promise<Sector | null>;
  deleteSector: (id: string) => Promise<boolean>;
};

const SectorContext = createContext<SectorContextType | undefined>(undefined);

export function SectorProvider({ children }: { children: React.ReactNode }) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const openNotification = (
    type: "success" | "error",
    message: string,
    description: string
  ) => {
    notification[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  const loadSectors = useCallback(async () => {
    if (hasLoaded && sectors.length > 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await SectorService.getAllSectors();
      setSectors(data);
      setHasLoaded(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar setores";
      setError(errorMessage);
      console.error("Erro ao carregar setores:", err);
    } finally {
      setIsLoading(false);
    }
  }, [hasLoaded, sectors.length]);

  const getSector = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SectorService.getSectorById(id);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar setor";
      setError(errorMessage);
      openNotification("error", "Erro", errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSector = useCallback(async (data: CreateSectorDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSector = await SectorService.createSector(data);
      setSectors((prev) => [...prev, newSector]);
      openNotification("success", "Sucesso", "Setor criado com sucesso");
      return newSector;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao criar setor";
      setError(errorMessage);
      openNotification("error", "Erro", errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSector = useCallback(
    async (id: string, data: UpdateSectorDTO) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedSector = await SectorService.updateSector(id, data);
        setSectors((prev) =>
          prev.map((s) => (s.id === id ? updatedSector : s))
        );
        openNotification("success", "Sucesso", "Setor atualizado com sucesso");
        return updatedSector;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao atualizar setor";
        setError(errorMessage);
        openNotification("error", "Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteSector = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await SectorService.deleteSector(id);
      setSectors((prev) => prev.filter((s) => s.id !== id));
      openNotification("success", "Sucesso", "Setor excluído com sucesso");
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao excluir setor";
      setError(errorMessage);
      openNotification("error", "Erro", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  };

  return (
    <SectorContext.Provider value={value}>{children}</SectorContext.Provider>
  );
}

export function useSector() {
  const context = useContext(SectorContext);
  if (context === undefined) {
    throw new Error("useSector deve ser usado dentro de um SectorProvider");
  }
  return context;
}
