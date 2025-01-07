import useDadosAbaEgressos from "@/hooks/ppg/use-aba-egressos";
import { EgressoComMudanca } from "./(graficos)/egressos-mudanca";
import { CurriculosDesatualizadosEgressos } from "./(graficos)/qtd-curriculos-desatualizados-egressos";
import { EgressosTituladosPorAno } from "./(graficos)/qtd-egressos-ano";
import { Loading } from "@/components/loading";
import DataTable from "@/app/ppg/(components)/table-egressos";

interface TabEgressosProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
  nota: string;
}

export default function TabEgressos({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
  nota,
}: TabEgressosProps) {
  const { dadosEgressos, isLoading } = useDadosAbaEgressos(
    idIes,
    idPpg,
    anoInicial,
    anoFinal,
    nota
  );

    if (isLoading) {
      return <Loading />;
    }
  
    if (!dadosEgressos) {
      return <div>Nenhum dado foi encontrado</div>;
    }

    console.log("dadosEgressos: ", dadosEgressos);

  return (
    <div>
      <h1>Egressos</h1>
      <p>Fonte: Lattes e Sucupira</p>
      <div>
        <EgressoComMudanca informacoesEgressos={dadosEgressos.dadosEgressos}/>
        <EgressosTituladosPorAno
          egressosTituladosPorAno={dadosEgressos?.egressosTituladosPorAno || []}
        />
        <CurriculosDesatualizadosEgressos
          tempoAtualizacaoEgressos={
            dadosEgressos?.tempoAtualizacaoLattesEgressos || []
          }
        />
          <DataTable informacoesEgressos={dadosEgressos.dadosEgressos} producoesEgressos={dadosEgressos.egressosTituladosPorAno} />
      </div>
    </div>
  );
}
