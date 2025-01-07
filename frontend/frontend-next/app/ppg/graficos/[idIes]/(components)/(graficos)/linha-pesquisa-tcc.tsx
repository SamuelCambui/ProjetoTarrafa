import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sankey } from "@ant-design/plots";

interface LinhaPesquisaTCCsProps {
  dadosLinhasPesquisa: any; 
}

export const LinhaPesquisaTCCs = ({ dadosLinhasPesquisa }: LinhaPesquisaTCCsProps) => {
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
    data: dadosLinhasPesquisa,
    scale: { color: { range: colors } },
    layout: {
      nodeWidth: 0.01,
      nodeSort: (a: { value: number }, b: { value: number }) => b.value - a.value,
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
        <CardTitle>TCCs por Linha de Pesquisa</CardTitle>
        <CardDescription>
          Fonte: Sucupira
          <br />
          Sumariza a produção do PPG por linha de pesquisa no período indicado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sankey {...config} />
      </CardContent>
    </Card>
  );
};
