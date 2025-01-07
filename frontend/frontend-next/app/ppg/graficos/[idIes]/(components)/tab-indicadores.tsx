import React, { useState } from "react";
import { Coautoria } from "./(graficos)/coautoria";
import { IndProdArtigos } from "./(graficos)/ind-prod-artigos";
import { IndProdExtSupArtigos } from "./(graficos)/ind-prodextsup-artigos";
import { IndAut } from "./(graficos)/indaut";
import { IndDis } from "./(graficos)/inddis";
import { IndDistOri } from "./(graficos)/inddistori";
import { IndOri } from "./(graficos)/indori";
import { PartDis } from "./(graficos)/part-dis";
import { ProdDiscenteQualis } from "./(graficos)/prod-discente-qualis";
import { ProdDocenteQualis } from "./(graficos)/prod-docente-qualis";
import { QtdDiscentesTitulados } from "./(graficos)/qtd-discente-titulados";
import { TempoDefesa } from "./(graficos)/tempo-defesa";
// import { useAbaIndicadoresPpg } from "@/hooks/ppg/use-aba-indicadores";

export default function TabIndicadores() {

  // const [periodo, setPeriodo] = useState({
  //   anoInicial: new Date().getFullYear() - 10,
  //   anoFinal: new Date().getFullYear(),
  // });

  // const { data, isLoading } = useAbaIndicadoresPpg({
  //   idPpg: idPpg,
  //   idIes: idIes,
  //   anoInicial: periodo.anoInicial,
  //   anoFinal: periodo.anoFinal,
  // });

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div>
      <h1>Indicadores</h1>
      <div>
        <IndProdArtigos />
        <IndProdExtSupArtigos />
        <ProdDocenteQualis />
        <ProdDiscenteQualis />
        {/* Additional Components */}
        <TempoDefesa />
        <PartDis />
        <Coautoria />
        <IndOri />
        <QtdDiscentesTitulados />
        <IndDistOri />
        <IndAut />
        <IndDis />
      </div>
    </div>
  );
}
