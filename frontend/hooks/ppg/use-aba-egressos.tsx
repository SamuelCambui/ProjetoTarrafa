import { useEffect, useState } from "react";
import { obterDadosEgressos } from "@/service/ppg/servicePPG";

export default function useDadosAbaEgressos(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number) {
  const [dadosEgressos, setDadosEgressos] = useState<{
    egressostituladosporano?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await obterDadosEgressos(
          idIes,
          idPpg,
          anoInicial,
          anoFinal,
        );
        setDadosEgressos(response);
      } catch (error) {
        console.error("Error fetching egress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg, anoInicial, anoFinal]);

  return { dadosEgressos, isLoading };
}
