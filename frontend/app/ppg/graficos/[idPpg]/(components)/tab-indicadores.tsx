import { Loading } from "@/components/loading";
import useDadosAbaIndicadores from "@/hooks/ppg/use-aba-indicadores";
import { Coautoria } from "./(graficos)/coautoria";
import { DiscentesTitulados } from "./(graficos)/discentes-titulados";
import { EstatisticasaArtigos } from "./(graficos)/indicadores/estatisticas-artigos";
import { IndProdArtigos } from "./(graficos)/indicadores/ind-prod-artigos";
import { IndProdExtSupArtigos } from "./(graficos)/indicadores/ind-prodextsup-artigos";
import { IndAut } from "./(graficos)/indicadores/indaut";
import { IndDis } from "./(graficos)/indicadores/inddis";
import { IndDistOri } from "./(graficos)/indicadores/inddistori";
import { IndOri } from "./(graficos)/indicadores/indori";
import MapaBrasil from "./(graficos)/indicadores/mapa-brasil";
import { PartDis } from "./(graficos)/indicadores/part-dis";
import { ProdDocenteQualis } from "./(graficos)/indicadores/prod-docente-qualis";
import { TempoDefesa } from "./(graficos)/indicadores/tempo-defesa";

interface DadosIndicadores {
  dadosIndprods: {
  };
  indprodartExtratoSuperior: {
    total: number;
    categorias: string[]; // Categories for superior article production
  };
  dadosQualis: {
    produtos: {
      qualis: { nome: string; qualis: string; }[]; // List of products with Qualis info
    };
  };
  tempoConclusao: {
    media: number;
    max: number; // Time stats related to completion
  };
  discentesTitulados: {
    total: number;
    porAno: { ano: number; quantidade: number }[]; // Students graduated per year
  };
  popsitionsAvgPpg: {
    indprods: { lat: number; long: number }; // Coordinates for production
    maior_indprod: { lat: number; long: number }; // Coordinates for highest production
    menor_indprod: { lat: number; long: number }; // Coordinates for lowest production
  };
  estatisticaArtigos: {
    totalArtigos: number;
    artigosPorAno: { ano: number; quantidade: number }[]; // Articles by year
  };
  estatisticaArtigosCorrelatos: {
    totalArtigos: number;
    correlatos: string[]; // Related articles or topics
  };
  partdis: {
    data: { nome: string; valor: number }[]; // Distribution data
  };
  indcoautoria: {
    data: { autor: string; qtd: number }[]; // Co-authorship data
  };
  indori: {
    data: { nome: string; indice: number }[]; // Indicator data by origin
  };
  inddistori: {
    data: { nome: string; indice: number }[]; // Indicator data for distribution origin
  };
  indaut: {
    data: { autor: string; qtd: number }[]; // Authorship data
  };
  inddis: {
    data: { nome: string; qtd: number }[]; // Distribution data
  };
}

interface TabIndicadoresProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
}

export default function TabIndicadores({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
}: TabIndicadoresProps) {
  const { dadosIndicadores, isLoading } = useDadosAbaIndicadores(
    idIes,
    idPpg,
    anoInicial,
    anoFinal,
  ) as { dadosIndicadores?: DadosIndicadores; isLoading: boolean };

  if (isLoading) {
    return <Loading />;
  }

  if (!dadosIndicadores) {
    return <div>Nenhum dado foi encontrado</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Indicadores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <IndProdArtigos dadosIndProd={dadosIndicadores.dadosIndprods} />
        <IndProdExtSupArtigos
          dadosIndProdExtSup={dadosIndicadores.indprodartExtratoSuperior}
        />
        <ProdDocenteQualis
          dadosQualisDocentes={dadosIndicadores.dadosQualis.produtos}
        />
        <TempoDefesa dadosTempoDefesa={dadosIndicadores.tempoConclusao} />
        <DiscentesTitulados
          dadosDiscentesTitulados={dadosIndicadores.discentesTitulados}
        />
        <MapaBrasil
          coordenadasCirculo={dadosIndicadores.popsitionsAvgPpg.indprods}
          maior={dadosIndicadores.popsitionsAvgPpg.maior_indprod}
          menor={dadosIndicadores.popsitionsAvgPpg.menor_indprod}
          idPpg={idPpg}
        />
        <EstatisticasaArtigos
          estatisticasArtigos={dadosIndicadores.estatisticaArtigos}
          estatisticasArtigosCorrelatos={
            dadosIndicadores.estatisticaArtigosCorrelatos
          }
        />
        <PartDis dadosPartDis={dadosIndicadores.partdis.data} />
        <Coautoria dadosCoautoria={dadosIndicadores.indcoautoria.data} />
        <IndOri dadosIndOri={dadosIndicadores.indori.data} />
        <IndDistOri dadosIndDistOri={dadosIndicadores.inddistori.data} />
        <IndAut dadosIndAut={dadosIndicadores.indaut.data} />
        <IndDis indDis={dadosIndicadores.inddis.data} />
      </div>
    </div>
  );
}
