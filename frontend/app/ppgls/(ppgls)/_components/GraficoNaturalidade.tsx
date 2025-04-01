import { LoadingCard } from "@/app/ppgls/_components/LoadingCard";
import { MapaAlunos } from "@/app/ppgls/_components/MapaAlunos";
import { GraficoProps } from "@/app/ppgls/_components/types";
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
