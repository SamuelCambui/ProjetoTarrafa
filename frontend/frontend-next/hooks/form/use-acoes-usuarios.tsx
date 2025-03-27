import { useState } from "react";
import { alternarStatusUsuario } from "@/service/usarios_form/service";

export default function useAlteraStatusUsuario() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modificarStatusUsuario = async (idLattes: string) => {
    setIsLoading(true);
    setError(null);

    try {
        const resposta = await alternarStatusUsuario(idLattes);
        return resposta || { status: false }; // Garante que sempre retorna um objeto
      } catch (err) {
        console.error("Erro ao modificar status do usuário:", err);
        setError("Ocorreu um erro ao alterar o status do usuário. Tente novamente.");
        return { status: false }; // Retorna um objeto padrão em caso de erro
      } finally {
        setIsLoading(false);
    }
  };

  return { modificarStatusUsuario, isLoading, error };
}
