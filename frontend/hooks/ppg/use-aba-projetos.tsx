import { useEffect, useState } from "react";
import { obterDadosProjetos } from "@/service/ppg/servicePPG";

export default function useDadosAbaProjetos(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
) {
  const [dadosProjetos, setDadosProjetos] = useState<{
    projetos?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await obterDadosProjetos(
          idIes,
          idPpg,
          anoInicial,
          anoFinal,
        );
        setDadosProjetos(response);
      } catch (error) {
        console.error("Error fetching egress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg, anoInicial, anoFinal]);

  return { dadosProjetos, isLoading };
}
