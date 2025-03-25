"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaEllipsisV,
  FaMinusCircle,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserService from "@/services/user-service";
import SectorService from "@/services/sector-service";
import type { User, UserUpdateData } from "@/services/auth-service";
import type { Sector } from "@/types/sector";
import { notification, Modal, Button, Dropdown, Menu, Form, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
    loadSectors();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
      notification.success({
        message: "Usuários carregados",
        description: `${data.length} usuários encontrados.`,
      });
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      notification.error({
        message: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
      });
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

  const handleDeleteUser = (id: string, name: string) => {
    Modal.confirm({
      title: "Confirmação de Exclusão",
      content: `Tem certeza que deseja excluir o usuário ${name}?`,
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
          await UserService.deleteUser(id);
          notification.success({
            message: "Usuário excluído",
            description: "Usuário excluído com sucesso.",
          });
          loadUsers();
        } catch (error) {
          console.error("Erro ao excluir usuário:", error);
          notification.error({
            message: "Erro",
            description: "Não foi possível excluir o usuário.",
          });
        }
      },
    });
  };

  const handleAssociateSector = (userId: string, sectorId: string) => {
    Modal.confirm({
      title: "Confirmação de Associação",
      content: `Tem certeza que deseja associar este usuário a este setor?`,
      okText: "Sim",
      cancelText: "Não",
      okButtonProps: {
        style: { backgroundColor: "#805ad5", borderColor: "#805ad5" }
      },
      cancelButtonProps: {
          style: { borderColor: "#805ad5", color: "#805ad5" },
          className: "custom-cancel-btn",
        },
      onOk: async () => {
        try {
          await SectorService.associateUserToSector(userId, sectorId);
          notification.success({
            message: "Setor associado",
            description: "Usuário associado ao setor com sucesso.",
          });
          loadUsers();
        } catch (error) {
          console.error("Erro ao associar setor:", error);
          notification.error({
            message: "Erro",
            description: "Não foi possível associar o setor.",
          });
        }
      }
    });
  };

    const handleDisassociateSector = (userId: string) => {
        Modal.confirm({
            title: "Confirmação de Remoção",
            content: `Tem certeza que deseja remover o usuário deste setor?`,
            okText: "Sim",
            cancelText: "Não",
             okButtonProps: {
                style: { backgroundColor: "#805ad5", borderColor: "#805ad5" }
             },
            cancelButtonProps: {
                style: { borderColor: "#805ad5", color: "#805ad5" },
                className: "custom-cancel-btn",
            },
            onOk: async () => {
                try {
                    await SectorService.disassociateUserFromSector(userId);
                    notification.success({
                        message: "Setor desassociado",
                        description: "Usuário desassociado do setor com sucesso.",
                    });
                    loadUsers();
                } catch (error) {
                    console.error("Erro ao desassociar setor:", error);
                    notification.error({
                        message: "Erro",
                        description: "Não foi possível desassociar o setor.",
                    });
                }
            }
        });
    };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const buildSectorMenu = (user: User) => (
    <Menu>
      {sectors.map((sector) => (
        <Menu.Item
          style={{ fontSize: "1.1rem" }}
          key={sector.id}
          onClick={() => handleAssociateSector(user.id, sector.id)}
        >
          {sector.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const showEditModal = (user: User) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
    });
    setIsEditModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values: UserUpdateData = await editForm.validateFields();
      if (editingUser) {
        await UserService.updateUser(editingUser.id, values);
        notification.success({
          message: "Usuário atualizado",
          description: "Usuário atualizado com sucesso.",
        });
        setIsEditModalVisible(false);
        loadUsers();
      }
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
      notification.error({
        message: "Erro",
        description: "Não foi possível atualizar o usuário.",
      });
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const actionsMenu = (user: User) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => showEditModal(user)}>
        <div className="flex items-center">
          <FaEdit className="mr-2 text-purple-600 dark:text-purple-400" />
          <span style={{ fontSize: "1.1rem" }}>Editar</span>
        </div>
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={() => handleDeleteUser(user.id, user.name)}
        style={{ color: "red" }}
      >
        <div className="flex items-center">
          <FaTrash className="mr-2 text-red-600 dark:text-red-400" />
          <span style={{ fontSize: "1.1rem" }}>Excluir</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="animate-slide-up opacity-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">
            Gerenciar Usuários
          </span>
        </h1>
        <Button
          type="primary"
          onClick={() => router.push("/register")}
          style={{ backgroundColor: "#805ad5", borderColor: "#805ad5" }}
        >
          <FaUserPlus className="mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card className="overflow-hidden">
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
                      Email
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Função
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Setor
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
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-gray-300">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              user.role === "ADMIN"
                                ?
                                  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                :
                                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {user.sector?.name || "Nenhum"}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.sector ? (
                            <Button
                              type="text"
                              className="mr-2 text-red-600"
                              onClick={() => handleDisassociateSector(user.id)}
                            >
                              <FaMinusCircle className="mr-1" /> Remover Setor
                            </Button>
                          ) : (
                            <Dropdown
                              overlay={buildSectorMenu(user)}
                              trigger={["click"]}
                            >
                              <Button type="text" className="mr-2">
                                Setor <DownOutlined />
                              </Button>
                            </Dropdown>
                          )}

                          <Dropdown
                            overlay={actionsMenu(user)}
                            trigger={["click"]}
                          >
                            <Button type="text">
                              <FaEllipsisV />
                            </Button>
                          </Dropdown>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-gray-700 dark:text-gray-400"
                      >
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

      <Modal
        title="Editar Usuário"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Salvar"
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#805ad5", borderColor: "#805ad5" } }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: "Por favor, insira o nome!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Por favor, insira o email!" },
              { type: "email", message: "Por favor, insira um email válido!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Senha"
            rules={[
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}