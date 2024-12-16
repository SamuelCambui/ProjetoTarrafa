import { ProdLinhasPesquisa } from "./(graficos)/prod-linhas-pesquisa";
import { ProdProjLinhasPesquisa } from "./(graficos)/prod-proj-linhas-pesquisa";
import { ProjDocentesPPG } from "./(graficos)/proj-docentes-ppg";

export default function TabProjetos()  {
  return (
    <h1>
      Linhas de Pesquisa e Projetos

      <ProdLinhasPesquisa />
      <ProdProjLinhasPesquisa />
      <ProjDocentesPPG />
    </h1>
  )
}