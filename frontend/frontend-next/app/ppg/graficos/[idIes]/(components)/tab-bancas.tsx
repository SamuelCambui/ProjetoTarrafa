import { ProdVinculadosTCCs } from "./(graficos)/prod-vinculados-tccs";
import { ArtigosViculadosTCCs } from "./(graficos)/artigos-vinculados-tcc";
import { QuantidadeProdutosTCCs } from "./(graficos)/quantidade-produtos-tcc";
import { QuantidadeLivrosTCCs } from "./(graficos)/quantidade-livros-tccs";
import { LinhaPesquisaTCCs } from "./(graficos)/linha-pesquisa-tcc";
import { TitulacaoPaticipantesExternos } from "./(graficos)/titulacao-participantes-externos";
import { PPGsPaticipantesExternos } from "./(graficos)/participantes-externos";
import CardsEstatisticas from "./cards-estatisticas";

export default function TabBancas() {
  return (
    <>
      <h1>Bancas</h1>
      <CardsEstatisticas />
      <ProdVinculadosTCCs />
      <ArtigosViculadosTCCs />
      <QuantidadeProdutosTCCs />
      <QuantidadeLivrosTCCs />
      <LinhaPesquisaTCCs />
      <PPGsPaticipantesExternos />
      <TitulacaoPaticipantesExternos />
    </>
  );
}
