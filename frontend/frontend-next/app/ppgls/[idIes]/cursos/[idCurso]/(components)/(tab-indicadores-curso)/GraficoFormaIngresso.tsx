import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Pie } from "@ant-design/plots";
  import { LoadingCard } from "../../../../../(components)/LoadingCard";
  import { GraficoProps } from "@/app/ppgls/(components)/types";
  
  export const GraficoFormaIngresso = ({ data, isLoading }: GraficoProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
  
    const configTodos = {
      data: data,
      angleField: "quantidade",
      colorField: "descricao",
      label: false,
      legend: false,
      tooltip: {
        title: {
          field: "descricao",
        },
        items: [],
      },
    };
  
    const alunosPorCota = [true, false].map((cotista) => ({
      categoria: cotista ? "Cotista" : "Ampla Concorrência",
      quantidade: data
        .filter(({ cota }: any) => cota === cotista)
        .reduce((acc: any, { quantidade }: any) => acc + quantidade, 0),
    }));
  
    const configCotas = {
      data: alunosPorCota,
      angleField: "quantidade",
      colorField: "categoria",
      label: {
        text: "categoria",
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
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Forma de Ingresso</CardTitle>
            <CardDescription>
              Porcentagem de ingressantes por cada modalidade de ingresso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Pie {...configTodos} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cotistas x Ampla Concorrência</CardTitle>
            <CardDescription>
              Porcentagem de ingressantes por cotas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Pie {...configCotas} />
          </CardContent>
        </Card>
      </div>
    );
  };
  