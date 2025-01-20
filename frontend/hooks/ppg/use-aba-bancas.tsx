import { useEffect, useState } from "react";
import { obterDadosBancas } from "@/service/ppg/servicePPG";

export default function useDadosAbaBancas(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
) {
  const [dadosBancas, setDadosBancas] = useState<{
    egressostituladosporano?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await obterDadosBancas(
          idIes,
          idPpg,
          anoInicial,
          anoFinal,
        );
        setDadosBancas(response);
      } catch (error) {
        console.error("Error fetching egress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg, anoInicial, anoFinal]);

  return { dadosBancas, isLoading };
}
