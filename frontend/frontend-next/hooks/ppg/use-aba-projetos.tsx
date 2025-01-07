import { useEffect, useState } from "react";
import { getDadosEgressos, getDadosIndicadores, getDadosProjetos } from "@/service/ppg/service";

export default function useDadosAbaProjetos(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  const [dadosProjetos, setDadosProjetos] = useState<{
    projetos?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await getDadosProjetos(
          idIes,
          idPpg,
          anoInicial,
          anoFinal,
          nota
        );
        setDadosProjetos(response);
      } catch (error) {
        console.error("Error fetching egress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg, anoInicial, anoFinal, nota]);

  return { dadosProjetos, isLoading };
}
