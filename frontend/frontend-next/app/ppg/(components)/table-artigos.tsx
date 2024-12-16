import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Artigo } from "@/lib/ppg/definitions";

type DataTableProps = {
  data: Artigo[];
};

export default function DataTable({ data }: DataTableProps) {
  return (
    <Table>
      <TableCaption>Lista de Artigos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID Artigo</TableHead>
          <TableHead>Nome do Artigo</TableHead>
          <TableHead>Duplicado</TableHead>
          <TableHead>Programas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((artigo, index) => (
          <TableRow key={index}>
            <TableCell>{artigo.id_dupl + 1}</TableCell> 
            <TableCell>{artigo.nome_producao}</TableCell>
            <TableCell>{artigo.duplicado}</TableCell> 
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
