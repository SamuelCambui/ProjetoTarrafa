import { useState, useEffect } from "react";
import { Docente } from "@/lib/ppg/definitions";
import { obterRankingDocentes } from "@/service/ppg/serviceHome";

type UseRankingDocentesResult<T> = {
  docentes: T | undefined;
  isLoading: boolean;
  error: any;
};

export default function useRankingDocentes(
  idIes: string
): UseRankingDocentesResult<Record<string, Docente>> {
  const [docentes, setData] = useState<Record<string, Docente> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!idIes) {
      console.warn("idIes é obrigatório para buscar os docentes.");
      return;
    }

    const fetchRanking = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resultado = await obterRankingDocentes(idIes);
        const rankingDocentes: Record<string, Docente> = resultado?.rankingDocentes || {};
        setData(rankingDocentes);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [idIes]);

  return { docentes, isLoading, error };
}
