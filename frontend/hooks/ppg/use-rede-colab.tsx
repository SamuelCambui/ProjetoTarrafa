import { useState, useEffect } from "react";
import { obterRedeColaboracao } from "@/service/ppg/serviceHome";
import { RedeColaboracaoData } from "@/lib/ppg/definitions";

type useRedeColabResultado<T> = {
  dadosColaboracao: T | null; // The data you're fetching, it could be null initially
  isLoading: boolean; // Whether the data is still being loaded
  error: any; // To store any error that might happen during the fetch
};

export default function useRedeColab(
  idIes: string,
  produto: string,
  fonte: string,
  aresta: string,
  anoInicio: number,
  anoFim: number
): useRedeColabResultado<RedeColaboracaoData> {
  const [dadosColaboracao, setData] = useState<RedeColaboracaoData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!idIes) {
      console.warn("idIes é obrigatório para buscar a rede de colaboração.");
      return;
    }

    const fetchRedeColaboracao = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resposta = await obterRedeColaboracao(
          idIes,
          produto,
          fonte,
          aresta,
          anoInicio,
          anoFim
        );

        const redeColaboracao: RedeColaboracaoData = {
          grafoCoautores: resposta?.grafoCoautores[0] || null, 
          forca: resposta?.grafoCoautores[1] || 0, 
        };

        setData(redeColaboracao);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRedeColaboracao();
  }, [idIes, produto, fonte, aresta, anoInicio, anoFim]);

  return { dadosColaboracao, isLoading, error };
}
