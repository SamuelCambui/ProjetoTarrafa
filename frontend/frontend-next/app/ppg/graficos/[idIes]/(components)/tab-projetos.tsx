import { Loading } from "@/components/loading";
import { ProdLinhasPesquisa } from "./(graficos)/prod-linhas-pesquisa";
import { ProjDocentes } from "./(graficos)/projetos-docentes";
import { ProdProjLinhasPesquisa } from "./(graficos)/prod-projetos-linhas-pesquisa";
import useDadosAbaProjetos from "@/hooks/ppg/use-aba-projetos";

interface TabProjetosProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
  nota: string;
}

export default function TabProjetos({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
  nota,
}: TabProjetosProps) {
  const { dadosProjetos, isLoading } = useDadosAbaProjetos(
    idIes,
    idPpg,
    anoInicial,
    anoFinal,
    nota
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!dadosProjetos) {
    return <div>Nenhum dado foi encontrado</div>;
  }

  return (
    <h1>
      Linhas de Pesquisa e Projetos
      <ProdLinhasPesquisa  dadosLinhaPesquisa={dadosProjetos.dadosdelinhasdepesquisa} />
      <ProdProjLinhasPesquisa dadosProjLinhaPesquisa={dadosProjetos.dadosdeprojetoselinhasdepesquisa}/>
      <ProjDocentes teste={dadosProjetos.dadosdeprojetos} />
    </h1>
  );
}
