import useDadosAbaDocentes from "@/hooks/ppg/use-aba-docentes";
import { CurriculosDesatualizados } from "./(graficos)/qtd-curriculos-desatualizados-docentes";
import { DocentesCategoria } from "./(graficos)/qtd-docentes-categoria";
import { Loading } from "@/components/loading";

interface TabDocentesProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
  nota: string;
}

export default function TabDocentes(
  {
    idIes,
    idPpg,
    anoInicial,
    anoFinal,
    nota,
  }: TabDocentesProps
)  {

  const { dadosDocentes, isLoading } = useDadosAbaDocentes(
      idIes,
      idPpg,
      anoInicial,
      anoFinal,
      nota
    );
  
    if (isLoading) {
      return <Loading />;
    }
  
    if (!dadosDocentes) {
      return <div>Nenhum dado foi encontrado</div>;
    }
  

  return (
    <h1>
      Docentes
      <div>
        < DocentesCategoria />
        < CurriculosDesatualizados />
        {/* TabelaProfessores  e produtos*/}
        {/* Grafo */}
        {/* MapadeCoautorias */}
        {/* Rede de Colaboração Mini */}
      </div>
    </h1>
  )
}