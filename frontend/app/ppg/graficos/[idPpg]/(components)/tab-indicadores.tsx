import { Loading } from "@/components/loading";
import useDadosAbaIndicadores from "@/hooks/ppg/use-aba-indicadores";
import { EstatisticasaArtigos } from "./(graficos)/indicadores/estatisticas-artigos";
import { IndProdArtigos } from "./(graficos)/indicadores/ind-prod-artigos";
import { IndProdExtSupArtigos } from "./(graficos)/indicadores/ind-prodextsup-artigos";
import { IndAut } from "./(graficos)/indicadores/indaut";
import { IndDis } from "./(graficos)/indicadores/inddis";
import { IndDistOri } from "./(graficos)/indicadores/inddistori";
import { IndOri } from "./(graficos)/indicadores/indori";
import { PartDis } from "./(graficos)/indicadores/part-dis";
import { ProdDiscenteQualis } from "./(graficos)/indicadores/prod-discente-qualis";
import { ProdDocenteQualis } from "./(graficos)/indicadores/prod-docente-qualis";
import MapaBrasil from "./(graficos)/indicadores/mapa-brasil";
import { TempoDefesa } from "./(graficos)/indicadores/tempo-defesa";

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
  );

  const coordenadasCirculo = [
    {
      nome: "Universidade A",
      sigla: "UA",
      status: "Pública Federal",
      municipio: "Cidade X",
      uf: "SP",
      longitude: -46.6333,
      latitude: -23.5505,
      indprod: 0.8,
      id: "1",
    },
    {
      nome: "Universidade B",
      sigla: "UB",
      status: "Pública Estadual",
      municipio: "Cidade Y",
      uf: "RJ",
      longitude: -43.1729,
      latitude: -22.9068,
      indprod: 0.6,
      id: "2",
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (!dadosIndicadores) {
    return <div>Nenhum dado foi encontrado</div>;
  }

  // indcoautoria: Object { data: {…} }​
// popsitionsAvgPpg: Object {  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Indicadores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <IndProdArtigos dadosIndProd={dadosIndicadores.dadosIndprods} />
        <IndProdExtSupArtigos
          dadosIndProdExtSup={dadosIndicadores.indprodartExtratoSuperior}
        />  
        <ProdDocenteQualis
          dadosQualisDocentes={dadosIndicadores.dadosQualis["produtos"]}
        />
        <ProdDiscenteQualis
          dadosQualisDiscentes={dadosIndicadores.contagemQualisDiscentes}
        />
        {/* <TempoDefesa dadosTempoDefesa={dadosIndicadores.tempoConclusao} /> */}
        <EstatisticasaArtigos
          estatisticasArtigos={dadosIndicadores.estatisticaArtigos}
          estatisticasArtigosCorrelatos={
            dadosIndicadores.estatisticaArtigosCorrelatos
          }
        />
        <MapaBrasil
          coordenadasCirculo={coordenadasCirculo}
          maior={1}
          menor={0}
          idPpg="1"
        />
        <PartDis dadosPartDis={dadosIndicadores.partdis.data} />
        {/* <Coautoria dadosCoautoria={dadosIndicadores.indcoautoria} /> */}
        <IndOri dadosIndOri={dadosIndicadores.indori.data} />
        <IndDistOri dadosIndDistOri={dadosIndicadores.inddistori.data} />
        <IndAut dadosIndAut={dadosIndicadores.indaut.data} />
        <IndDis indDis={dadosIndicadores.inddis.data} />
      </div>
    </div>
  );
}
