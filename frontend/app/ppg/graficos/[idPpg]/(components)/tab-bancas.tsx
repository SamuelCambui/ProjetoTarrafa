"use client";

import { Loading } from "@/components/loading";
import useDadosAbaBancas from "@/hooks/ppg/use-aba-bancas";
import { DadosBancas } from "@/lib/ppg/definitions";
import { ArtigosViculadosTCCs } from "./(graficos)/bancas/artigos-vinculados-tcc";
import { CardsEstatisticas } from "./(graficos)/bancas/cards-estatisticas";
import { LinhaPesquisaTCCs } from "./(graficos)/bancas/linha-pesquisa-tcc";
import { PPGsPaticipantesExternos } from "./(graficos)/bancas/participantes-externos";
import { ProdVinculadosTCCs } from "./(graficos)/bancas/prod-vinculados-tccs";
import { QuantidadeLivrosTCCs } from "./(graficos)/bancas/quantidade-livros-tccs";
import { QuantidadeProdutosTCCs } from "./(graficos)/bancas/quantidade-produtos-tcc";
import { TitulacaoPaticipantesExternos } from "./(graficos)/bancas/titulacao-participantes-externos";

interface TabBancasProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
}

export default function TabBancas({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
}: TabBancasProps) {
  const { dadosBancas, isLoading } = useDadosAbaBancas(
    idIes,
    idPpg,
    anoInicial,
    anoFinal
  ) as { dadosBancas?: DadosBancas; isLoading: boolean };

  if (isLoading) {
    return <Loading />;
  }

  if (!dadosBancas) {
    return <div>Nenhum dado foi encontrado</div>;
  }

  const {
    dadosDeProdutosPorTcc: {
      medias,
      produtos,
      tccs_com_qualis: TccComQualis,
      tccs_com_producoes: TccComProd,
      tccs_com_livros: TccComLivros,
    },
    dadosDeTccsPorLinhasDePesquisa,
    levantamentoExternosEmBancas,
  } = dadosBancas;

  return (
    <div className="tab-bancas">
      <h1 className="text-xl font-bold mb-2">Bancas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CardsEstatisticas
          quantidadeBancas={levantamentoExternosEmBancas.quantidade_bancas}
          quantidadeExternos={levantamentoExternosEmBancas.quantidade_externos}
          quantidadeInternos={levantamentoExternosEmBancas.quantidade_internos}
        />
        <ProdVinculadosTCCs produtos={produtos} />
        <ArtigosViculadosTCCs tccsComQualis={TccComQualis} />
        <QuantidadeProdutosTCCs
          tccsComProducoes={TccComProd}
          medias={medias}
        />
        <QuantidadeLivrosTCCs tccsComLivros={TccComLivros} />
        <PPGsPaticipantesExternos
          tipoParticipacao={levantamentoExternosEmBancas.tipo_participacao_ppg}
        />
        <LinhaPesquisaTCCs
          dadosLinhasPesquisa={dadosDeTccsPorLinhasDePesquisa
          }
        />
        <TitulacaoPaticipantesExternos
          areaTitulacao={levantamentoExternosEmBancas.area_titulacao}
          grauAcademico={levantamentoExternosEmBancas.grau_academico}
          paisOrigem={levantamentoExternosEmBancas.pais_origem}
          paisTitulacao={levantamentoExternosEmBancas.pais_titulacao}
        />
      </div>
    </div>
  );
}
