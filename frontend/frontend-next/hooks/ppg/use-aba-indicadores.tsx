import { useEffect, useState } from "react";
import { getDadosEgressos, getDadosIndicadores } from "@/service/ppg/service";

export default function useDadosAbaIndicadores(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  const [dadosIndicadores, setDadosIndicadores] = useState<{
    indicadores?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await getDadosIndicadores(
          idIes,
          idPpg,
          anoInicial,
          anoFinal,
          nota
        );
        setDadosIndicadores(response);
      } catch (error) {
        console.error("Error fetching egress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg, anoInicial, anoFinal, nota]);

  return { dadosIndicadores, isLoading };
}
