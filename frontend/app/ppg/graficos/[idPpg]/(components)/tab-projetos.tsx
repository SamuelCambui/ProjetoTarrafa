import { Loading } from "@/components/loading";
import { ProdLinhasPesquisa } from "./(graficos)/projetos/prod-linhas-pesquisa";
import { ProjDocentes } from "./(graficos)/projetos/projetos-docentes";
import { ProdProjLinhasPesquisa } from "./(graficos)/projetos/prod-projetos-linhas-pesquisa";
import useDadosAbaProjetos from "@/hooks/ppg/use-aba-projetos";

interface TabProjetosProps {
  idIes: string;
  idPpg: string;
  anoInicial: number;
  anoFinal: number;
}

export default function TabProjetos({
  idIes,
  idPpg,
  anoInicial,
  anoFinal,
}: TabProjetosProps) {
  const { dadosProjetos, isLoading } = useDadosAbaProjetos(
    idIes,
    idPpg,
    anoInicial,
    anoFinal,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!dadosProjetos) {
    return <div>Nenhum dado foi encontrado</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">
        Linhas de Pesquisa e Projetos
      </h1>
        <div className="space-y-4">
          <ProdLinhasPesquisa  dadosLinhaPesquisa={dadosProjetos.dadosDeLinhasDePesquisa} />
          <ProdProjLinhasPesquisa dadosProjLinhaPesquisa={dadosProjetos.dadosDeProjetoseLinhasDePesquisa}/>
          <ProjDocentes teste={dadosProjetos.dadosDeProjetos} />
        </div>
    </div>
  );
}
