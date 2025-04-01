"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserForm } from "@/types/user_form"
import { Button } from "@/components/ui/button";
import { Pencil, Trash, UserRoundCheck, UserRoundX } from "lucide-react";
import { obterPerfil } from "@/lib/utils";

type PropsTabelaUsuarios = {
  dados: UserForm[] | undefined;
  usuarioAtual: {
    idlattes: string;
    is_admin: boolean;
  };
  aoExcluirUsuario: (usuario: UserForm) => void;
  aoModificarStatus: (usuario: UserForm) => void;
  aoEditarUsuario: (usuario: UserForm) => void;
};

export default function TabelaUsuarios({
  dados,
  usuarioAtual,
  aoExcluirUsuario,
  aoModificarStatus,
  aoEditarUsuario,
}: PropsTabelaUsuarios) {
  console.log("Dados recebidos:", dados);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do usuário</TableHead>
          <TableHead>ID Lattes</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Ativo</TableHead>
          {/* <TableHead>Logado</TableHead> */}
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dados?.map((usuario) => (
          <TableRow key={String(usuario.idlattes)}>
            <TableCell>{usuario.name}</TableCell>
            <TableCell>{usuario.idlattes}</TableCell>
            <TableCell>{usuario.email || ""}</TableCell>
            <TableCell>{obterPerfil(usuario)}</TableCell>
            <TableCell>{usuario.cpf || ""}</TableCell>
            <TableCell>{usuario.is_active ? "Sim" : "Não"}</TableCell>
            {/* <TableCell>{usuario.logado ? "Sim" : "Não"}</TableCell> */}
            <TableCell>
              {usuarioAtual.is_admin ? (
                <div className="flex space-x-2">
                  {/* Botão para ativar/desativar */}
                  <Button
                    variant="ghost"
                    title={usuario.is_active ? "Desativar" : "Ativar"}
                    onClick={() => aoModificarStatus(usuario)}
                  >
                    {usuario.is_active ? <UserRoundX /> : <UserRoundCheck />}
                  </Button>
                  {/* Botão para editar */}
                  <Button
                    variant="ghost"
                    title="Editar"
                    onClick={() => aoEditarUsuario(usuario)}
                  >
                    <Pencil />
                  </Button>
                  {/* Botão para excluir */}
                  {usuarioAtual.idlattes !== usuario.idlattes && (
                    <Button
                      variant="ghost"
                      title="Excluir"
                      onClick={() => aoExcluirUsuario(usuario)}
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
