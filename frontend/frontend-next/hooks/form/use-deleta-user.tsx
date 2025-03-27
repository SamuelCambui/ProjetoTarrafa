import { useState } from "react";
import { deletarUsuario } from "@/service/usarios_form/service";

export default function useDeletaUsuario() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const excluirUsuario = async (idLattes: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const resposta = await deletarUsuario(idLattes);
      return resposta || { status: "erro", mensagem: "Erro desconhecido ao excluir usuário" };
    } catch (err: any) {
      console.error("Erro ao excluir usuário:", err);
      setError(err.message || "Erro desconhecido");
      return { status: "erro", mensagem: err.message || "Erro desconhecido ao excluir usuário" };
    } finally {
      setIsLoading(false);
    }
  };

  return { excluirUsuario, isLoading, error };
}
