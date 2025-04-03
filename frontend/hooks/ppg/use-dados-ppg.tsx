import { obterInfoPPG } from "@/service/ppg/servicePPG";
import { useEffect, useState } from "react";

export default function useDadosPPG(idIes: string, idPpg: string) {
  const [dadosPpg, setDadosPpg] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response: any = await obterInfoPPG(idIes, idPpg);
        setDadosPpg(response);
      } catch (error) {
        console.error("Error fetching PPG data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes, idPpg]);

  return { dadosPpg, isLoading };
}
