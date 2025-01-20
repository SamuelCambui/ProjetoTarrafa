"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Docente } from "@/lib/ppg/definitions";

type DataTableProps = {
  data: Record<string, Docente>;
};

type SortConfig = {
  key: keyof Docente | keyof Docente['produtos'];
  direction: 'asc' | 'desc';
};

export default function DataTable({ data }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nome', direction: 'asc' });

  const sortedData = Object.values(data).sort((a, b) => {
    if (sortConfig.key in a.produtos) {
      return (a.produtos[sortConfig.key as keyof Docente['produtos']] ?? 0) > (b.produtos[sortConfig.key as keyof Docente['produtos']] ?? 0) ? 
        (sortConfig.direction === 'asc' ? 1 : -1) : 
        (sortConfig.direction === 'asc' ? -1 : 1);
    }
    if (a[sortConfig.key as keyof Docente] < b[sortConfig.key as keyof Docente]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof Docente] > b[sortConfig.key as keyof Docente]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: SortConfig['key']) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortButton = ({ column }: { column: SortConfig['key'] }) => (
    <Button
      variant="ghost"
      onClick={() => requestSort(column)}
      className="h-8 w-8 p-0"
    >
      {sortConfig.key === column ? (
        sortConfig.direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4" />
      )}
      <span className="sr-only">Sort by {column}</span>
    </Button>
  );

  return (
    <Table>
      <TableCaption>Ranking de Docentes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            Docente
            <SortButton column="nome" />
          </TableHead>
          <TableHead>
            Art. Periódicos
            <SortButton column="ARTIGO-PUBLICADO" />
          </TableHead>
          <TableHead>
            Art. Eventos
            <SortButton column="TRABALHO-EM-EVENTOS" />
          </TableHead>
          <TableHead>
            Livros
            <SortButton column="LIVROS-PUBLICADOS-OU-ORGANIZADOS" />
          </TableHead>
          <TableHead>
            Cap. Livros
            <SortButton column="CAPITULOS-DE-LIVROS-PUBLICADOS" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((docente, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center space-x-4">
                <img
                  src={docente.avatar}
                  alt={`Avatar de ${docente.nome}`}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <span className="font-medium block">{docente.nome}</span>
                  <p className="text-sm text-gray-500">
                    Tipo de vínculo: {docente.vinculo_ies} ({docente.sigla_ies_vinculo})
                  </p>
                  <p className="text-sm text-gray-500">IES de Origem: {docente.ies}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{docente.produtos?.["ARTIGO-PUBLICADO"] ?? 0}</TableCell>
            <TableCell>{docente.produtos?.["TRABALHO-EM-EVENTOS"] ?? 0}</TableCell>
            <TableCell>{docente.produtos?.["LIVROS-PUBLICADOS-OU-ORGANIZADOS"] ?? 0}</TableCell>
            <TableCell>{docente.produtos?.["CAPITULOS-DE-LIVROS-PUBLICADOS"] ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

