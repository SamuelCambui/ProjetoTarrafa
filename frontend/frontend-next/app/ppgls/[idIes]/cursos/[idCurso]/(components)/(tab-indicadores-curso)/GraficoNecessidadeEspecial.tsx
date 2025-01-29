import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Pie } from "@ant-design/plots";
  import { GraficoProps } from "@/app/ppgls/(components)/types";
  import { LoadingCard } from "../../../../../(components)/LoadingCard";
  
  export const GraficoNecessidadeEspecial = ({
    data,
    isLoading,
  }: GraficoProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
    const config = {
      data: data,
      angleField: "quantidade",
      colorField: "neceespecial",
      label: false,
      tooltip: {
        title: {
          field: "neceespecial",
        },
      },
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Necessidade Especial</CardTitle>
          <CardDescription>
            Porcentagem de alunos com necessidade especial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Pie {...config} />
        </CardContent>
      </Card>
    );
  };
  