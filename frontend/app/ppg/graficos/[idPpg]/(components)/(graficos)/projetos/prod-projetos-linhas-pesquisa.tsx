import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sankey } from "@ant-design/plots";

export const ProdProjLinhasPesquisa= ( {dadosProjLinhaPesquisa} ) => {
  const colors = [
    "#5B8FF9",
    "#61DDAA",
    "#65789B",
    "#F6BD16",
    "#7262fd",
    "#78D3F8",
    "#9661BC",
    "#F6903D",
    "#008685",
    "#F08BB4",
  ];

  const config = {
    data: dadosProjLinhaPesquisa.links,
    scale: { color: { range: colors } },
    layout: {
      nodeWidth: 0.01,
      nodeSort: (a: { value: number }, b: { value: number }) =>
        b.value - a.value,
    },
    linkColorField: (d: { source: { key: any } }) => d.source.key,
    style: {
      labelFontSize: 13,
      linkFillOpacity: 0.4,
      nodeStrokeWidth: 0,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Produção dos Projetos por Linha de Pesquisa </CardTitle>
        <CardDescription>
          Fonte: Sucupira  <br /> Relaciona projetos às linhas de pesquisa pelas
          produções geradas{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sankey {...config} />
      </CardContent>
    </Card> 
  );
};
