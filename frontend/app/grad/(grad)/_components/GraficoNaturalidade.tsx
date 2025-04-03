import { LoadingCard } from "@/app/grad/_components/LoadingCard";
import { MapaAlunos } from "@/app/grad/_components/MapaAlunos";
import { GraficoProps } from "@/app/grad/_components/types";
import { Grafico } from "../../_components/Grafico";

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
