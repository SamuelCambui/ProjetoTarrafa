import { useEffect, useState } from "react";
import { getDadosEgressos } from "@/service/ppg/service";

export default function useDadosAbaEgressos(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  const [dadosEgressos, setDadosEgressos] = useState<{
    egressostituladosporano?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await getDadosEgressos(
          idIes,
          idPpg,
          anoInicial,
          anoFinal,
          nota
        );
        setDadosEgressos(response);
      } catch (error) {
        console.error("Error fetching egress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg, anoInicial, anoFinal, nota]);

  return { dadosEgressos, isLoading };
}
