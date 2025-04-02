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
import type { UserStatus } from "@/types/user_status";

interface PropsTabelaUsuarios {
  listaUsuariosStatus: UserStatus[] | undefined;
}

export default function TabelaUsuarios({ listaUsuariosStatus }: PropsTabelaUsuarios) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do Usuário</TableHead>
          <TableHead>Nome do Formulário</TableHead>
          <TableHead>Data de Preenchimento</TableHead>
          <TableHead>Preencheu</TableHead>
          <TableHead>Curso</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listaUsuariosStatus?.map((usuario, index) => (
          <TableRow key={index}>
            <TableCell>{usuario.nome_usuario || "-"}</TableCell>
            <TableCell>{usuario.nome_formulario || "-"}</TableCell>
            <TableCell>{usuario.data_preenchimento ? new Date(usuario.data_preenchimento).toLocaleDateString('pt-BR') : "-"}</TableCell>
            <TableCell>{usuario.preencheu ? "Sim" : "Não"}</TableCell>
            <TableCell>{usuario.curso || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
