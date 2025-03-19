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
import { User } from "@/lib/ppg/definitions";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, UserRoundCheck, UserRoundX } from "lucide-react";
import { obterPerfil } from "@/lib/utils";

type PropsTabelaUsuarios = {
  dados: User[] | undefined;
  usuarioAtual: {
    idLattes: string;
    isAdmin: boolean;
    isSuperuser: boolean;
  };
  aoExcluirUsuario: (usuario: User) => void;
  aoModificarStatus: (usuario: User) => void;
  aoEditarUsuario: (usuario: User) => void;
};

export default function TabelaUsuarios({
  dados,
  usuarioAtual,
  aoExcluirUsuario,
  aoModificarStatus,
  aoEditarUsuario,
}: PropsTabelaUsuarios) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do usuário</TableHead>
          <TableHead>ID Lattes</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Ativo</TableHead>
          {/* <TableHead>Logado</TableHead> */}
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dados?.map((usuario) => (
          <TableRow key={usuario.idLattes}>
            <TableCell>{usuario.nome}</TableCell>
            <TableCell>{usuario.idLattes}</TableCell>
            <TableCell>{usuario.email || ""}</TableCell>
            <TableCell>{obterPerfil(usuario)}</TableCell>
            <TableCell>{usuario.isActive ? "Sim" : "Não"}</TableCell>
            {/* <TableCell>{usuario.logado ? "Sim" : "Não"}</TableCell> */}
            <TableCell>
              {usuarioAtual.isAdmin || usuarioAtual.isSuperuser ? (
                <div className="flex space-x-2">
                  {/* Botão para ativar/desativar */}
                  <Button
                    variant="ghost"
                    title={usuario.isActive ? "Desativar" : "Ativar"}
                    onClick={() => aoModificarStatus(usuario)}
                  >
                    {usuario.isActive ? <UserRoundX /> : <UserRoundCheck />}
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
                  {usuarioAtual.idLattes !== usuario.idLattes && (
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
