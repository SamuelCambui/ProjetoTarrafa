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
    <Card className="col-span-2 gap-8">
      <CardHeader>
        <CardTitle>Titulação dos participantes externos</CardTitle>
        <CardDescription>
          Este gráfico apresenta a quantidade de produtos do PPG vinculados aos
          TCCs defendidos
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 grid-cols-1">
        <div className="col-span-2">
          <CardTitle>Área de Titulação</CardTitle>
          <Pie {...configGrafico1} />
        </div>
        <div>
          <CardTitle>Grau Acadêmico</CardTitle>
          <Pie {...configGrafico2} />
        </div>
        <div>
          <CardTitle>País de Origem</CardTitle>
          <Pie {...configGrafico3} />
        </div>
        <div>
          <CardTitle>País de Titulação</CardTitle>
          <Pie {...configGrafico4} />
        </div>
      </CardContent>
    </Card>
  );
};
