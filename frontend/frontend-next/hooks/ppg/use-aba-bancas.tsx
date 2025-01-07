import { useEffect, useState } from "react";
import { getDadosBancas, getDadosEgressos } from "@/service/ppg/service";

export default function useDadosAbaBancas(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  const [dadosBancas, setDadosBancas] = useState<{
    egressostituladosporano?: any[];
  } | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await getDadosBancas(
          idIes,
          idPpg,
          anoInicial,
          anoFinal,
          nota
        );
        setDadosBancas(response);
      } catch (error) {
        console.error("Error fetching egress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg, anoInicial, anoFinal, nota]);

  return { dadosBancas, isLoading };
}
