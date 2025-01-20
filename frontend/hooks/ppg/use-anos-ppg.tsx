import { DadosHome } from "@/lib/ppg/definitions"; // Assuming this is the type for your API response
// import { getDadosHome } from "@/service/ppg/servicePPG";
import { useEffect, useState } from "react";

export default function useAnosPPG(idIes: string) {
  const [data, setData] = useState<DadosHome | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response : any = await getAnosPpg(idIes); 
        setData(response.dadoshome);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idIes]);

  return { data, isLoading };
}
