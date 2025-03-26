"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaPlus, FaFileAlt, FaList } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuestionnaire } from "@/contexts/questionnaire-context";
import { useAuth } from "@/contexts/auth-context";
import { Button, Modal, message } from "antd";

export default function QuestionnairesPage() {
  const { questionnaires, loadQuestionnaires, deleteQuestionnaire, isLoading } =
    useQuestionnaire();
  const { user } = useAuth();
  const router = useRouter();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isTabletOrLess, setIsTabletOrLess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);

  // Detecta o tamanho da tela (tablet ou menor)
  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrLess(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      const fetchData = async () => {
        try {
          await loadQuestionnaires();
        } catch (error) {
          console.error("Erro ao carregar questionários:", error);
          message.error(
            "Não foi possível carregar os questionários. Tente novamente mais tarde."
          );
        } finally {
          setHasLoaded(true);
        }
      };
      fetchData();
    }
  }, [loadQuestionnaires, hasLoaded]);

  const handleDeleteQuestionnaire = async (id: string, title: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o questionário "${title}"?`
      )
    ) {
      try {
        const success = await deleteQuestionnaire(id);
        if (success) {
          message.success(
            `O questionário "${title}" foi excluído com sucesso.`
          );
          setIsModalVisible(false);
        }
      } catch (error) {
        console.error("Erro ao excluir questionário:", error);
        message.error(
          "Não foi possível excluir o questionário. Tente novamente mais tarde."
        );
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Abre o modal ao clicar na linha (em telas menores)
  const handleRowClick = (questionnaire: any) => {
    if (isTabletOrLess) {
      setSelectedQuestionnaire(questionnaire);
      setIsModalVisible(true);
    }
  };

  // Renderiza os botões de ação
  const renderActionButtons = (questionnaire: any) => (
    <div className="flex justify-end space-x-2">
      <Button
        type="default"
        variant="outlined"
        style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/admin/questionnaires/${questionnaire.id}`);
        }}
        className="flex items-center space-x-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
        title="Gerenciar Questões"
      >
        <FaList className="text-purple-600 dark:text-purple-400" />
        <span>Questões</span>
      </Button>
      <Button
        type="default"
        variant="outlined"
        style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/admin/questionnaires/edit/${questionnaire.id}`);
        }}
        className="flex items-center space-x-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
        title="Editar Questionário"
      >
        <FaEdit className="text-purple-600 dark:text-purple-400" />
        <span>Editar</span>
      </Button>
      <Button
        type="default"
        variant="outlined"
        style={{ borderColor: "red", color: "red" }}
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteQuestionnaire(questionnaire.id, questionnaire.title);
        }}
        className="flex items-center space-x-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
        title="Excluir Questionário"
      >
        <FaTrash style={{ color: "red" }} />
        <span style={{ color: "red" }}>Excluir</span>
      </Button>
    </div>
  );

  return (
    <div className="animate-slide-up opacity-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">
            Gerenciar Questionários
          </span>
        </h1>
        <Button
          type="primary"
          style={{ backgroundColor: "#805ad5", borderColor: "#805ad5" }}
          onClick={() => router.push("/admin/questionnaires/new")}
        >
          <FaPlus className="mr-2" />
          Novo Questionário
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
                      Título
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Responsáveis
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
                  {questionnaires && questionnaires.length > 0 ? (
                    questionnaires.map((questionnaire) => (
                      <TableRow
                        key={questionnaire.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer"
                        onClick={() => handleRowClick(questionnaire)}
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-gray-300">
                          <div className="flex items-center">
                            {questionnaire.icon ? (
                              <span className="w-6 h-6 mr-2 flex items-center justify-center">
                                <FaFileAlt className="text-purple-600 dark:text-purple-400" />
                              </span>
                            ) : (
                              <FaFileAlt className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                            )}
                            {questionnaire.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {questionnaire.responsibles?.length || 0} responsáveis
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {formatDate(questionnaire.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          {!isTabletOrLess &&
                            renderActionButtons(questionnaire)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-gray-700 dark:text-gray-400"
                      >
                        Nenhum questionário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Modal do AntD para telas pequenas */}
      <Modal
        title={selectedQuestionnaire?.title}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <div key="actions" className="flex space-x-2">
            <Button
              variant="outlined"
              type="default"
              style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
              onClick={() => {
                router.push(
                  `/admin/questionnaires/${selectedQuestionnaire?.id}`
                );
                setIsModalVisible(false);
              }}
              title="Gerenciar Questões"
            >
              <FaList className="text-purple-600 dark:text-purple-400" />
              <span>Questões</span>
            </Button>
            <Button
              variant="outlined"
              type="default"
              style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
              onClick={() => {
                router.push(
                  `/admin/questionnaires/edit/${selectedQuestionnaire?.id}`
                );
                setIsModalVisible(false);
              }}
              title="Editar Questionário"
            >
              <FaEdit className="text-purple-600 dark:text-purple-400" />
              <span>Editar</span>
            </Button>
            <Button
              type="default"
              variant="outlined"
              danger
              onClick={() =>
                handleDeleteQuestionnaire(
                  selectedQuestionnaire?.id,
                  selectedQuestionnaire?.title
                )
              }
              title="Excluir Questionário"
            >
              <FaTrash style={{ color: "red" }} />
              <span>Excluir</span>
            </Button>
          </div>,
        ]}
      >
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Responsáveis:</strong>{" "}
          {selectedQuestionnaire?.responsibles?.length || 0}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Data de Criação:</strong>{" "}
          {formatDate(selectedQuestionnaire?.createdAt)}
        </p>
      </Modal>
    </div>
  );
}
