import { LoadingCard } from "@/app/ppgls/(components)/LoadingCard";
import { MapaAlunos } from "@/app/ppgls/(components)/MapaAlunos";
import { GraficoProps } from "@/app/ppgls/(components)/types";
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
