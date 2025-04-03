import React, { useState } from "react";
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
import { Artigo } from "@/lib/ppg/definitions";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type DataTableProps = {
  data: Artigo[];
};

type SortConfig = {
  key: keyof Artigo;
  direction: "asc" | "desc";
};

export default function DataTable({ data }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key: keyof Artigo) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const SortButton = ({ column }: { column: keyof Artigo }) => (
    <Button
      variant="ghost"
      onClick={() => requestSort(column)}
      className="h-8 w-8 p-0"
    >
      {sortConfig?.key === column ? (
        sortConfig.direction === "asc" ? (
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
      <TableCaption>Lista de Artigos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            ID Artigo <SortButton column="id_dupl" />
          </TableHead>
          <TableHead>
            Nome do Artigo <SortButton column="nome_producao" />
          </TableHead>
          <TableHead>
            Duplicado <SortButton column="duplicado" />
          </TableHead>
          <TableHead>Programas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((artigo, index) => (
          <TableRow key={index}>
            <TableCell>{artigo.id_dupl + 1}</TableCell>
            <TableCell>{artigo.nome_producao}</TableCell>
            <TableCell>{artigo.duplicado ? "Sim" : "Não"}</TableCell>
            <TableCell>
              <ul>
                {artigo.programas.map((programa, idx) => (
                  <li key={idx}>{programa}</li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
