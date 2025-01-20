import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mapearFormatoGrafico } from "@/lib/utils";

interface QuantidadeLivrosTCCsProps {
  tccsComLivros: Record<string, number>; 
}

export const QuantidadeLivrosTCCs = ({ tccsComLivros }: QuantidadeLivrosTCCsProps) => {
  const config = {
    data: mapearFormatoGrafico(tccsComLivros, "ano", "quantidade"),
    xField: "ano",
    yField: "quantidade",
    label: {
      text: (d: { quantidade: number; }) => `${d.quantidade}`,
      textBaseline: 'bottom',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantidade de Livros por TCC</CardTitle>
        <CardDescription>
          Quantidade de TCCs geradores de livros e capítulos de livros em cada ano
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
