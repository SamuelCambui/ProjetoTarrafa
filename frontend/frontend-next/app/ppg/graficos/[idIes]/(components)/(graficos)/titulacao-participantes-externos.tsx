import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mapearFormatoGrafico } from "@/lib/utils";
import { Pie } from "@ant-design/plots";

interface LevantamentoExternos {
  areaTitulacao: Record<string, number>;
  grauAcademico: Record<string, number>;
  paisOrigem: Record<string, number>;
  paisTitulacao: Record<string, number>;
}

export const TitulacaoPaticipantesExternos = ({
  areaTitulacao,
  grauAcademico,
  paisOrigem,
  paisTitulacao,
}: LevantamentoExternos) => {

  const configGrafico1 = {
    data: mapearFormatoGrafico(areaTitulacao),
    angleField: "quantidade",
    colorField: "tipo",
    label: {
      text: "quantidade",
      position: "outside",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  const configGrafico2 = {
    data: mapearFormatoGrafico(grauAcademico),
    angleField: "quantidade",
    colorField: "tipo",
    label: {
      text: "quantidade",
      position: "outside",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  const configGrafico3 = {
    data: mapearFormatoGrafico(paisOrigem),
    angleField: "quantidade",
    colorField: "tipo",
    label: {
      text: "quantidade",
      position: "outside",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  const configGrafico4 = {
    data: mapearFormatoGrafico(paisTitulacao),
    angleField: "quantidade",
    colorField: "tipo",
    label: {
      text: "quantidade",
      position: "outside",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Titulação dos participantes externos</CardTitle>
        <CardDescription>
          Este gráfico apresenta a quantidade de produtos do PPG vinculados aos
          TCCs defendidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle>Área de Titulação</CardTitle>
        <Pie {...configGrafico1} />
        <CardTitle>Grau Acadêmico</CardTitle>
        <Pie {...configGrafico2} />
        <CardTitle>País de Origem</CardTitle>
        <Pie {...configGrafico3} />
        <CardTitle>País de Titulação</CardTitle>
        <Pie {...configGrafico4} />
      </CardContent>
    </Card>
  );
};
