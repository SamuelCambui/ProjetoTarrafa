import { Docente } from "@/lib/ppg/definitions";
import DataTable from "@/app/ppg/(components)/table-ranking-docentes";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const docentes: Docente[] = [
  {
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/1920px-Grosser_Panda.JPG",
    nome: "Professor A",
    sigla_ies_vinculo: "ABC",
    vinculo_ies: "Instituição ABC",
    ies: "abc-university",
    produtos: {
      "ARTIGO-PUBLICADO": 5,
      "TRABALHO-EM-EVENTOS": 3,
      "LIVROS-PUBLICADOS-OU-ORGANIZADOS": 1,
      "CAPITULOS-DE-LIVROS-PUBLICADOS": 2,
    },
  },
  {
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/1920px-Grosser_Panda.JPG",
    nome: "Professor A",
    sigla_ies_vinculo: "ABC",
    vinculo_ies: "Instituição ABC",
    ies: "abc-university",
    produtos: {
      "ARTIGO-PUBLICADO": 5,
      "TRABALHO-EM-EVENTOS": 3,
      "LIVROS-PUBLICADOS-OU-ORGANIZADOS": 1,
      "CAPITULOS-DE-LIVROS-PUBLICADOS": 2,
    },
  },  {
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/1920px-Grosser_Panda.JPG",
    nome: "Professor A",
    sigla_ies_vinculo: "ABC",
    vinculo_ies: "Instituição ABC",
    ies: "abc-university",
    produtos: {
      "ARTIGO-PUBLICADO": 1,
      "TRABALHO-EM-EVENTOS": 2,
      "LIVROS-PUBLICADOS-OU-ORGANIZADOS": 3,
      "CAPITULOS-DE-LIVROS-PUBLICADOS": 4,
    },
  },

];

export default function Page() {
  return (
    <>

      <h1 className="">Ranking de Docentes</h1>
            
      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Busque por um docente..." className="pl-8" />
      </div>

      <DataTable data={docentes}  />
    </>
  );
}
