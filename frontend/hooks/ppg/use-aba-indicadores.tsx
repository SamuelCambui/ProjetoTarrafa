import { useEffect, useState } from "react";
import { obterDadosIndicadores } from "@/service/ppg/servicePPG";

export default function useDadosAbaIndicadores(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
) {
  const [dadosIndicadores, setDadosIndicadores] = useState<{
    indicadores?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await obterDadosIndicadores(
          idIes,
          idPpg,
          anoInicial,
          anoFinal,
        );
        setDadosIndicadores(response);
      } catch (error) {
        console.error("Error fetching egress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg, anoInicial, anoFinal]);

  return { dadosIndicadores, isLoading };
}
