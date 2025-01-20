import { Artigo, Programa } from "@/lib/ppg/definitions";
import { obterArtigosDocentes } from "@/service/ppg/serviceHome";
import { useEffect, useState } from "react";

export default function useArtigosDocentes(idIes: string, anoSelecionado: number) {
  const [artigos, setArtigos] = useState<Artigo[] | undefined>(); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await obterArtigosDocentes(idIes, anoSelecionado);
        const listaArtigos: Artigo[] = response.listaArtigos || [];
        setArtigos(listaArtigos);
      } catch (err) {
        console.error("Erro ao buscar os artigos:", err);
        setError(err instanceof Error ? err : new Error("Erro desconhecido")); 
        setArtigos(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    if (idIes) {
      fetchData();
    } else {
      console.warn("idIes é obrigatório para buscar artigos.");
    }
  }, [idIes, anoSelecionado]);

  return { artigos, isLoading, error }; // Retorno inclui `error`
}
