import { obtemListaUniversidades } from "@/service/ppg/serviceUsers";
import { useEffect, useState } from "react";

export default function useUniversidades() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listaUniversidades, setListaUniversidades] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversidades = async () => {
      setIsLoading(true);
      setError(null);
      setListaUniversidades([]);

      try {
        const resposta = await obtemListaUniversidades();
        setListaUniversidades(resposta);
      } catch (err: any) {
        console.error("Erro ao obter lista de universidades:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversidades();
  }, []);

  return { listaUniversidades, isLoading, error };
}
