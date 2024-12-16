import { Artigo } from "@/lib/ppg/definitions";
import { Metadata } from "next";
import DataTable from "../(components)/table-artigos";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Artigos de Docentes",
};

const artigos: Artigo[] = [
  {
    id_dupl: 0,
    nome_producao: "Estudo sobre Inteligência Artificial",
    duplicado: "Sim",
    programas: ["Programa A", "Programa B"]
  },
  {
    id_dupl: 1,
    nome_producao: "Pesquisa em Machine Learning",
    duplicado: "Não",
    programas: ["Programa C"]
  }
];

export default function Page() {
  return (
    <>
      <h1>Artigos de Docentes</h1>
            
      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Busque por um docente..." className="pl-8" />
      </div>

      <DataTable data={artigos} />
    </>
  );
}
