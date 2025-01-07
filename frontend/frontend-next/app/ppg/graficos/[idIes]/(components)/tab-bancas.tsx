"use client";

import { ProdVinculadosTCCs } from "./(graficos)/prod-vinculados-tccs";
import { ArtigosViculadosTCCs } from "./(graficos)/artigos-vinculados-tcc";
import { QuantidadeProdutosTCCs } from "./(graficos)/quantidade-produtos-tcc";
import { QuantidadeLivrosTCCs } from "./(graficos)/quantidade-livros-tccs";
import { LinhaPesquisaTCCs } from "./(graficos)/linha-pesquisa-tcc";
import { TitulacaoPaticipantesExternos } from "./(graficos)/titulacao-participantes-externos";
import CardsEstatisticas from "./cards-estatisticas";
import useDadosAbaBancas from "@/hooks/ppg/use-aba-bancas";
import { Loading } from "@/components/loading";
import { PPGsPaticipantesExternos } from "./(graficos)/participantes-externos";

interface TabBancasProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
  nota: string;
}

export default function TabBancas({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
  nota,
}: TabBancasProps) {
  const { dadosBancas, isLoading } = useDadosAbaBancas(
    idIes,
    idPpg,
    anoInicial,
    anoFinal,
    nota
  );

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
      tccs_com_qualis,
      tccs_com_producoes,
      tccs_com_livros,
    } = {},
    dadosDeTccsPorLinhasDePesquisa,
    levantamentoExternosEmBancas,
  } = dadosBancas;

  return (
    <div className="tab-bancas">
      <h1>Bancas</h1>
      <CardsEstatisticas
        quantidadeBancas={levantamentoExternosEmBancas.quantidade_bancas}
        quantidadeExternos={levantamentoExternosEmBancas.quantidade_externos}
        quantidadeInternos={levantamentoExternosEmBancas.quantidade_internos}
      />
      <ProdVinculadosTCCs produtos={produtos} />
      <ArtigosViculadosTCCs tccsComQualis={tccs_com_qualis} />
      <QuantidadeProdutosTCCs
        tccsComProducoes={tccs_com_producoes}
        medias={medias}
      />
      <QuantidadeLivrosTCCs tccsComLivros={tccs_com_livros} />
      <LinhaPesquisaTCCs
        dadosLinhasPesquisa={dadosDeTccsPorLinhasDePesquisa.links}
      />
      <PPGsPaticipantesExternos
        tipoParticipacao={levantamentoExternosEmBancas.tipo_participacao_ppg}
      />
      <TitulacaoPaticipantesExternos
        areaTitulacao={levantamentoExternosEmBancas.area_titulacao}
        grauAcademico={levantamentoExternosEmBancas.grau_academico}
        paisOrigem={levantamentoExternosEmBancas.pais_origem}
        paisTitulacao={levantamentoExternosEmBancas.pais_titulacao}
      />
    </div>
  );
}
