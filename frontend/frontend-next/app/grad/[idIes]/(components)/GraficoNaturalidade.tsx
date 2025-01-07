import { LoadingCard } from "@/app/grad/(components)/LoadingCard";
import { MapaAlunos } from "@/app/grad/(components)/MapaAlunos";
import { GraficoProps } from "@/app/grad/(components)/types";
import { Grafico } from "../../(components)/Grafico";

export const GraficoNaturalidade = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }
  return (
    <Grafico titulo="Naturalidade" descricao="Mapa de naturalidade dos alunos.">
      <MapaAlunos dados={data} />
    </Grafico>
  );
};
