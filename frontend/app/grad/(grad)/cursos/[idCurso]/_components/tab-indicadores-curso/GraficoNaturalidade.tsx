import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapaAlunos } from "../../../../../_components/MapaAlunos";
import { GraficoProps } from "@/app/grad/_components/types";
import { LoadingCard } from "../../../../../_components/LoadingCard";

export const GraficoNaturalidade = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Naturalidade</CardTitle>
        <CardDescription>Mapa de naturalidade dos alunos.</CardDescription>
      </CardHeader>
      <CardContent>
        <MapaAlunos dados={data} />
      </CardContent>
    </Card>
  );
};
