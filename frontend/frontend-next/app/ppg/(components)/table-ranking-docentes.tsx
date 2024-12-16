"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Docente } from "@/lib/ppg/definitions";

type DataTableProps = {
  data: Docente[];
};

export default function DataTable({ data }: DataTableProps) {
  return (
    <Table>
      <TableCaption>Ranking de Docentes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Avatar</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Sigla IES</TableHead>
          <TableHead>Artigos Publicados</TableHead>
          <TableHead>Trabalhos em Eventos</TableHead>
          <TableHead>Livros Publicados</TableHead>
          <TableHead>Capítulos de Livros</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((docente, index) => (
          <TableRow key={index}>
            <TableCell>
              <img
                src={docente.avatar}
                alt={`Avatar de ${docente.nome}`}
                className="h-10 w-10 rounded-full"
              />
            </TableCell>
            <TableCell className="font-medium">{docente.nome}</TableCell>
            <TableCell>{docente.sigla_ies_vinculo}</TableCell>
            <TableCell>{docente.produtos["ARTIGO-PUBLICADO"] || 0}</TableCell>
            <TableCell>{docente.produtos["TRABALHO-EM-EVENTOS"] || 0}</TableCell>
            <TableCell>
              {docente.produtos["LIVROS-PUBLICADOS-OU-ORGANIZADOS"] || 0}
            </TableCell>
            <TableCell>
              {docente.produtos["CAPITULOS-DE-LIVROS-PUBLICADOS"] || 0}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
