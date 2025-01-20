import { Loading } from "@/components/loading";
import useDadosAbaDocentes from "@/hooks/ppg/use-aba-docentes";
import { CurriculosDesatualizados } from "./(graficos)/docentes/qtd-curriculos-desatualizados-docentes";
import { DocentesCategoria } from "./(graficos)/docentes/qtd-docentes-categoria";
import DataTable from "./(graficos)/docentes/table-docentes";

interface TabDocentesProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
}

export default function TabDocentes({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
}: TabDocentesProps) {
  const { dadosDocentes, isLoading } = useDadosAbaDocentes(
    idIes,
    idPpg,
    anoInicial,
    anoFinal,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!dadosDocentes) {
    return <div>Nenhum dado foi encontrado</div>;
  }

  return (
    <>
      <h1 className="text-xl font-bold">Docentes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DocentesCategoria
          docenteCategoria={dadosDocentes.professorPorCategoria}
        />
        <CurriculosDesatualizados
          dadosAtualizaoLattes={dadosDocentes.atualizacaoLattes}
        />
        {/* <DiscentesTitulados dadosDiscentesTitulados={dadosDocentes.discentestitulados} /> */}
        <DataTable producoesDocente={dadosDocentes.listaProfessores} />
        {/* Grafo */}
        {/* MapadeCoautorias */}
        {/* Rede de Colaboração Mini */}
      </div>
    </>
  );
}
