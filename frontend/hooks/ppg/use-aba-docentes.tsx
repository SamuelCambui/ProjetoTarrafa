import { obterDadosDocentes } from "@/service/ppg/servicePPG";
import { useEffect, useState } from "react";

export default function useDadosAbaDocentes(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
) {
  const [dadosDocentes, setDadosEgressos] = useState<{
    egressostituladosporano?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await obterDadosDocentes(
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

  return { dadosDocentes, isLoading };
}
