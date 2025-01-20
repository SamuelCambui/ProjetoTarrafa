import { useState, useEffect } from "react";
import { obterRedeColaboracao } from "@/service/ppg/serviceHome"; 
import { GrafoCoautores } from "@/lib/ppg/definitions";

type useRedeColabResultado<T> = {
  dadosColaboracao: T | undefined;
  isLoading: boolean;
  error: any;
};

export default function useRedeColab(
  idIes: string, 
  produto: string, 
  fonte: string, 
  aresta: string, 
  anoInicio: number, 
  anoFim: number
): useRedeColabResultado<GrafoCoautores[]> {
  const [dadosColaboracao, setData] = useState<GrafoCoautores[] | undefined>(undefined);
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
        const resposta = await obterRedeColaboracao(idIes, produto, fonte, aresta, anoInicio, anoFim);
        const redeColaboracao: GrafoCoautores[] = resposta?.grafoCoautores || [];
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
