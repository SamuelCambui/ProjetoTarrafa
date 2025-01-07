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
  data: Record<string, Docente>; 
};

export default function DataTable({ data }: DataTableProps) {
  return (
    <Table>
      <TableCaption>Ranking de Docentes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Avatar</TableHead>
          <TableHead>Egresso</TableHead>
          <TableHead>Status de Atualização Lattes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.values(data).map((docente, index) => (
          <TableRow key={index}>
            <TableCell>
              <img
                src={docente.avatar}
                alt={`Avatar de ${docente.nome}`}
                className="h-10 w-10 rounded-full"
              />
            </TableCell>
            <TableCell>
                <span className="font-medium">{docente.nome}</span>
                <p>
                  Tipo de vínculo com a {docente.sigla_ies_vinculo}:{" "}
                  {docente.vinculo_ies}
                </p>
                <p>
                  IES de Origem:{" "}{docente.ies}
                </p>
            </TableCell>
            <TableCell>
              {docente.produtos?.["ARTIGO-PUBLICADO"] ?? 0}
            </TableCell>
            <TableCell>
              {docente.produtos?.["TRABALHO-EM-EVENTOS"] ?? 0}
            </TableCell>
            <TableCell>
              {docente.produtos?.["LIVROS-PUBLICADOS-OU-ORGANIZADOS"] ?? 0}
            </TableCell>
            <TableCell>
              {docente.produtos?.["CAPITULOS-DE-LIVROS-PUBLICADOS"] ?? 0}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
