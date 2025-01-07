import { useEffect, useState } from "react";
import { getDadosDocentes } from "@/service/ppg/service";

export default function useDadosAbaDocentes(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  const [dadosDocentes, setDadosEgressos] = useState<{
    egressostituladosporano?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await getDadosDocentes(
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

  return { dadosDocentes, isLoading };
}
