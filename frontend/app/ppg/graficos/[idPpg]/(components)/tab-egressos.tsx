import DataTable from "@/app/ppg/graficos/[idPpg]/(components)/(graficos)/egressos/table-egressos";
import { Loading } from "@/components/loading";
import useDadosAbaEgressos from "@/hooks/ppg/use-aba-egressos";
import { EgressoComMudanca } from "./(graficos)/egressos/egressos-mudanca";
import { CurriculosDesatualizadosEgressos } from "./(graficos)/egressos/qtd-curriculos-desatualizados-egressos";
import { EgressosTituladosPorAno } from "./(graficos)/egressos/qtd-egressos-ano";
import { DadosEgressos } from "@/lib/ppg/definitions";

interface TabEgressosProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
}

export default function TabEgressos({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
}: TabEgressosProps) {
  const { dadosEgressos, isLoading } = useDadosAbaEgressos(
    idIes,
    idPpg,
    anoInicial,
    anoFinal
  ) as { dadosEgressos?: DadosEgressos; isLoading: boolean };

  if (isLoading) {
    return <Loading />;
  }

  if (!dadosEgressos) {
    return <div>Nenhum dado foi encontrado</div>;
  }

  return (
    <>
      <h1 className="text-xl font-bold">Egressos</h1>
      <p className="text-sm mb-2">Fonte: Lattes e Sucupira</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EgressoComMudanca informacoesEgressos={dadosEgressos.dadosEgressos} />
        <EgressosTituladosPorAno
          egressosTituladosPorAno={dadosEgressos?.egressosTituladosPorAno || []}
        />
        <CurriculosDesatualizadosEgressos
          tempoAtualizacaoEgressos={
            dadosEgressos?.tempoAtualizacaoLattesEgressos || []
          }
        />
        <DataTable
          tempoAtualizacao={dadosEgressos.tempoAtualizacaoLattesEgressos}
          informacoesEgressos={dadosEgressos.dadosEgressos}
          producoesEgressos={dadosEgressos.producoesEgressos}
        />
      </div>
    </>
  );
}
