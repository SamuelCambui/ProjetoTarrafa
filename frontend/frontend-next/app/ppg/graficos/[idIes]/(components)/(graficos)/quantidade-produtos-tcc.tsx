import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const QuantidadeProdutosTCCs = ({ tccsComProducoes, medias }) => {
  const transformarDados = (dados: Record<string, Record<string, number>>) => {
    const resultado = [];
    for (const ano in dados) {
      const valores = dados[ano];
      for (const [produto, quantidade] of Object.entries(valores)) {
        if (produto === "Periódicos" || quantidade === 0) continue;
        resultado.push({
          ano,
          quantidade: parseFloat(quantidade.toFixed(2)),
          produto,
        });
      }
    }
    return resultado;
  };

  const dadosTCCs = transformarDados(tccsComProducoes);
  const dadosMedias = transformarDados(medias);

  const dadosFormatados = [...dadosTCCs, ...dadosMedias];

  const config = {
    data: dadosFormatados,
    xField: "ano",
    yField: "quantidade",
    colorField: "produto",
    label: {
      text: (d: { quantidade: number }) => `${d.quantidade}`,
      textBaseline: "bottom",
    },
    group: true,
    style: {
      inset: 5,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Quantidade de Produtos por TCC </CardTitle>
        <CardDescription>
          Quantidade de TCCs geradores dos produtos em cada ano. Comparado com
          médias dos PPGs de mesma nota
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
