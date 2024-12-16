import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sankey } from "@ant-design/plots";

export const LinhaPesquisaTCCs= () => {
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

  const data = [
    { source: "首次打开", target: "首页 UV", value: 160 },
    { source: "结果页", target: "首页 UV", value: 40 },
    { source: "验证页", target: "首页 UV", value: 10 },
    { source: "我的", target: "首页 UV", value: 10 },
    { source: "朋友", target: "首页 UV", value: 8 },
    { source: "其他来源", target: "首页 UV", value: 27 },
    { source: "首页 UV", target: "理财", value: 30 },
    { source: "首页 UV", target: "扫一扫", value: 40 },
    { source: "首页 UV", target: "服务", value: 35 },
    { source: "首页 UV", target: "蚂蚁森林", value: 25 },
    { source: "首页 UV", target: "跳失", value: 10 },
    { source: "首页 UV", target: "借呗", value: 30 },
    { source: "首页 UV", target: "花呗", value: 40 },
    { source: "首页 UV", target: "其他流向", value: 45 },
  ];

  const config = {
    data,
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
        <CardTitle>  TCCs por Linha de Pesquisa  </CardTitle>
        <CardDescription>
        Fonte: Sucupira
        Sumariza a produção do PPG por linha de pesquisa no período indicado         </CardDescription>
      </CardHeader>
      <CardContent>
        return <Sankey {...config} />;
      </CardContent>
    </Card> 
  );
};
