"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/ppg/definitions";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Pencil,
  Trash,
  UserCheck,
  UserRound,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

type DataTableProps = {
  data: User[];
  currentUser: {
    idlattes: string;
    is_admin: boolean;
    is_superuser: boolean;
  };
};

export default function DataTable({ data, currentUser }: DataTableProps) {
  // Empty handlers
  const handleModifyStatus = (idlattes: string) => {
    // Placeholder for modifying user status
  };

  const handleEditUser = (idlattes: string) => {
    // Placeholder for editing user
  };

  const handleDeleteUser = (idlattes: string, fullName: string) => {
    // Placeholder for deleting user
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do usuário</TableHead>
          <TableHead>ID Lattes</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead>Logado</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <TableRow key={user.idlattes}>
            <TableCell>{user.full_name}</TableCell>
            <TableCell>{user.idlattes}</TableCell>
            <TableCell>{user.email || ""}</TableCell>
            <TableCell>{user.perfil}</TableCell>
            <TableCell>{user.is_active ? "Sim" : "Não"}</TableCell>
            <TableCell>{user.logado ? "Sim" : "Não"}</TableCell>
            <TableCell>
              {currentUser.is_admin || currentUser.is_superuser ? (
                <div className="flex">
                  <Button
                    variant="ghost"
                    className="hover:text-slate-700"
                    title={user.is_active ? "Desativar" : "Ativar"}
                    onClick={() => handleModifyStatus(user.idlattes)}
                  >
                    {user.is_active ? <UserRoundX /> : <UserRoundCheck />}
                  </Button>{" "}
                  <Button
                    variant="ghost"
                    className="hover:text-amber-700"
                    title="Editar"
                    onClick={() => handleEditUser(user.idlattes)}
                  >
                    <Pencil />
                  </Button>
                  {currentUser.idlattes !== user.idlattes && (
                    <Button
                      variant="ghost"
                      className="hover:text-red-500 bg-transparent"
                      title="Excluir"
                      onClick={() =>
                        handleDeleteUser(user.idlattes, user.full_name)
                      }
                    >
                      <Trash />
                    </Button>
                  )}
                </div>
              ) : (
                <span>N/A</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
