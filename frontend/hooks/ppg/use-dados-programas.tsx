import { Programa } from "@/lib/ppg/definitions";
import { obterProgramas } from "@/service/ppg/serviceHome";
import { useEffect, useState } from "react";

export default function useDadosProgramas(idIes: string) {
  const [programas, setProgramas] = useState<Programa[] | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resposta = await obterProgramas(idIes);
        const listaProgramas: Programa[] = resposta?.listaProgramas || [];
        setProgramas(listaProgramas);
      } catch (error) {
        console.error("Erro ao buscar os programas:", error);
        setProgramas(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    if (idIes) {
      fetchData();
    } else {
      console.warn("idIes é obrigatório para buscar programas.");
    }
  }, [idIes]);

  return { programas, isLoading }; 
}
