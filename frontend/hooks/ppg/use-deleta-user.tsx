import { useState } from "react";
import { deletarUsuario } from "@/service/ppg/serviceUsers";

export default function useDeletaUsuario() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const excluirUsuario = async (idLattes: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const resposta = await deletarUsuario(idLattes);
      return resposta;
    } catch (err: any) {
      console.error("Erro ao excluir usuário:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return { excluirUsuario, isLoading, error };
}
