"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaUserPlus, FaPlusCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserService from "@/services/user-service";
import SectorService from "@/services/sector-service";
import type { User } from "@/services/auth-service";
import type { Sector } from "@/types/sector";
import { useCustomToast } from "@/hooks/use-custom-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSectorSelect, setShowSectorSelect] = useState<{ userId: string; visible: boolean }>({
    userId: "",
    visible: false,
  });
  const toast = useCustomToast();
  const router = useRouter();

  useEffect(() => {
    loadUsers();
    loadSectors();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
      toast.success("Usuários carregados", `${data.length} usuários encontrados.`);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários", "Não foi possível carregar a lista de usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSectors = async () => {
    try {
      const data = await SectorService.getAllSectors();
      setSectors(data);
    } catch (error) {
      console.error("Erro ao carregar setores:", error);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${name}?`)) {
      try {
        await UserService.deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        toast.success("Usuário excluído", `O usuário ${name} foi excluído com sucesso.`);
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        toast.error("Erro ao excluir usuário", "Não foi possível excluir o usuário.");
      }
    }
  };

  const handleAssociateSector = async (userId: string, sectorId: string) => {
    try {
      await SectorService.associateUserToSector(userId, sectorId);
      toast.success("Setor associado", "Usuário associado ao setor com sucesso.");
      setShowSectorSelect({ userId: "", visible: false });
      loadUsers();
    } catch (error) {
      console.error("Erro ao associar setor:", error);
      toast.error("Erro", "Não foi possível associar o setor.");
    }
  };

  const handleDisassociateSector = async (userId: string) => {
    try {
      await SectorService.disassociateUserFromSector(userId);
      toast.success("Setor desassociado", "Usuário desassociado do setor com sucesso.");
      loadUsers();
    } catch (error) {
      console.error("Erro ao desassociar setor:", error);
      toast.error("Erro", "Não foi possível desassociar o setor.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="animate-slide-up opacity-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">Gerenciar Usuários</span>
        </h1>
        <Button
          className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 transition-all hover-lift"
          onClick={() => router.push("/register")}
        >
          <FaUserPlus className="mr-2" />
          Novo Usuário
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
                    <TableHead className="text-gray-700 dark:text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Função</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Setor</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Data de Criação</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-gray-300">{user.name}</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">{user.email}</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {user.sector?.name ? (
                            <>
                              {user.sector.name}
                              <Button variant="ghost" size="sm" onClick={() => handleDisassociateSector(user.id)}>
                                Desassociar
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => setShowSectorSelect({ userId: user.id, visible: true })}
                            >
                              <FaPlusCircle className="text-green-600" />
                              Associar
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toast.info(
                                  "Funcionalidade em desenvolvimento",
                                  "Esta funcionalidade estará disponível em breve."
                                )
                              }
                              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover-lift"
                            >
                              <FaEdit className="text-purple-600 dark:text-purple-400" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover-lift"
                            >
                              <FaTrash className="text-red-600 dark:text-red-400" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-700 dark:text-gray-400">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Se a flag showSectorSelect estiver ativa, renderiza uma lista simples para escolher o setor */}
      {showSectorSelect.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-xl font-bold mb-4">Selecione um Setor</h2>
            <ul>
              {sectors.map((sector) => (
                <li key={sector.id} className="mb-2">
                  <button
                    className="w-full text-left p-2 border border-gray-200 rounded hover:bg-gray-100"
                    onClick={() => handleAssociateSector(showSectorSelect.userId, sector.id)}
                  >
                    {sector.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowSectorSelect({ userId: "", visible: false })}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
