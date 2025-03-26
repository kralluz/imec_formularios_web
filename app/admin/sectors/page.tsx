"use client";

import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSector } from "@/contexts/sector-context";
import { notification, Modal, Button } from "antd";

interface Sector {
  id?: string;
  name: string;
  createdAt?: string;
}

export default function SectorsPage() {
  const {
    sectors,
    loadSectors,
    createSector,
    updateSector,
    deleteSector,
    isLoading,
    hasLoaded,
  } = useSector();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSector, setCurrentSector] = useState<Sector>({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para responsividade: se tablet ou menor, ao clicar na linha abre modal
  const [isTabletOrLess, setIsTabletOrLess] = useState(false);
  const [isRowModalVisible, setIsRowModalVisible] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  useEffect(() => {
    if (!hasLoaded) {
      loadSectors();
    }
  }, [loadSectors, hasLoaded]);

  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrLess(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenCreateDialog = () => {
    setCurrentSector({ name: "" });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (sector: Sector) => {
    setCurrentSector({ id: sector.id, name: sector.name });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentSector({ name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!currentSector.name.trim()) {
        notification.error({
          message: "Erro",
          description: "O nome do setor é obrigatório",
        });
        setIsSubmitting(false);
        return;
      }

      if (isEditMode && currentSector.id) {
        await updateSector(currentSector.id, { name: currentSector.name });
        notification.success({
          message: "Sucesso",
          description: "Setor atualizado com sucesso!",
        });
      } else {
        await createSector({ name: currentSector.name });
        notification.success({
          message: "Sucesso",
          description: "Setor criado com sucesso!",
        });
      }

      handleCloseDialog();
      loadSectors(); // Recarrega os setores após criar/atualizar
    } catch (error) {
      console.error("Erro ao salvar setor:", error);
      notification.error({
        message: "Erro",
        description: "Ocorreu um erro ao salvar o setor.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSector = async (id?: string, name?: string) => {
    if (!id) {
      notification.error({
        message: "Erro",
        description: "ID do setor não encontrado",
      });
      return;
    }

    Modal.confirm({
      title: "Confirmação",
      content: `Tem certeza que deseja excluir o setor "${name}"?`,
      okText: "Sim",
      cancelText: "Não",
      okButtonProps: {
        style: { backgroundColor: "#805ad5", borderColor: "#805ad5" },
      },
      cancelButtonProps: {
        style: { borderColor: "#805ad5", color: "#805ad5" },
        className: "custom-cancel-btn",
      },
      onOk: async () => {
        try {
          await deleteSector(id);
          notification.success({
            message: "Sucesso",
            description: "Setor excluído com sucesso!",
          });
          loadSectors();
        } catch (error) {
          console.error("Erro ao excluir setor:", error);
          notification.error({
            message: "Erro",
            description: "Ocorreu um erro ao excluir o setor.",
          });
        }
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Responsividade: ao clicar na linha em telas menores, abre modal com os detalhes
  const handleRowClick = (sector: Sector) => {
    if (isTabletOrLess) {
      setSelectedSector(sector);
      setIsRowModalVisible(true);
    }
  };

  return (
    <div className="animate-slide-up opacity-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">
            Gerenciar Setores
          </span>
        </h1>
        <Button
          type="primary"
          style={{ backgroundColor: "#805ad5", borderColor: "#805ad5" }}
          onClick={handleOpenCreateDialog}
        >
          <FaPlus className="mr-2" />
          Novo Setor
        </Button>
      </div>

      <Card className="overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-800">
        <div className="p-4">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Nome
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Data de Criação
                    </TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectors.length > 0 ? (
                    sectors.map((sector) => (
                      <TableRow
                        key={sector.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer"
                        onClick={() => handleRowClick(sector)}
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-gray-300">
                          {sector.name}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {formatDate(sector.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          {/* Em telas maiores, exibe os botões de ação na linha */}
                          {!isTabletOrLess && (
                            <div className="flex justify-end space-x-2">
                              <Button
                                type="default"
                                variant="outlined"
                                style={{
                                  borderColor: "#8b5cf6",
                                  color: "#8b5cf6",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditDialog({
                                    id: sector.id,
                                    name: sector.name,
                                  });
                                }}
                                title="Editar"
                              >
                                <FaEdit style={{ color: "#8b5cf6" }} />
                                <span>Editar</span>
                              </Button>
                              <Button
                                type="default"
                                variant="outlined"
                                style={{
                                  borderColor: "red",
                                  color: "red",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSector(sector.id, sector.name);
                                }}
                                title="Excluir"
                              >
                                <FaTrash style={{ color: "red" }} />
                                <span>Excluir</span>
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-gray-700 dark:text-gray-400"
                      >
                        Nenhum setor encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Dialog para criação/edição de setor */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Setor" : "Novo Setor"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Atualize as informações do setor"
                : "Preencha os dados para criar um novo setor"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Nome do Setor
                </Label>
                <Input
                  id="name"
                  value={currentSector.name}
                  onChange={(e) =>
                    setCurrentSector({ ...currentSector, name: e.target.value })
                  }
                  placeholder="Digite o nome do setor"
                  className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button
                type="default"
                variant="outlined"
                style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Salvando..."
                  : isEditMode
                  ? "Atualizar"
                  : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal (Ant Design) para detalhes e ações em telas tablet ou menores */}
      <Modal
        title={selectedSector?.name}
        open={isRowModalVisible}
        onCancel={() => setIsRowModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            type="default"
            variant="outlined"
            style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
            onClick={() => setIsRowModalVisible(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="edit"
            type="default"
            variant="outlined"
            style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
            onClick={() => {
              if (selectedSector) {
                handleOpenEditDialog(selectedSector);
                setIsRowModalVisible(false);
              }
            }}
          >
            <FaEdit style={{ color: "#8b5cf6", marginRight: 4 }} />
            Editar
          </Button>,
          <Button
            key="delete"
            type="default"
            variant="outlined"
            style={{ borderColor: "red", color: "red" }}
            onClick={() => {
              if (selectedSector) {
                handleDeleteSector(selectedSector.id, selectedSector.name);
                setIsRowModalVisible(false);
              }
            }}
          >
            <FaTrash style={{ color: "red", marginRight: 4 }} />
            Excluir
          </Button>,
        ]}
      >
        <p>
          <strong>Data de Criação:</strong>{" "}
          {selectedSector?.createdAt
            ? formatDate(selectedSector.createdAt)
            : "N/A"}
        </p>
      </Modal>
    </div>
  );
}
