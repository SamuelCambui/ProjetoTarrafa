import { useState } from "react";
import { alterarStatusUsuario } from "@/service/ppg/serviceUsers";

export default function useAlteraStatusUsuario() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modificarStatusUsuario = async (idIes: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const resposta = await alterarStatusUsuario(idIes);
      return resposta;
    } catch (err) {
      console.error("Erro ao modificar status do usuário:", err);
      setError(
        "Ocorreu um erro ao alterar o status do usuário. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { modificarStatusUsuario, isLoading, error };
}
