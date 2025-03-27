import { useState } from "react"
import { atualizarUsuario } from "@/service/usarios_form/service";
import type { UserForm } from "@/types/user_form"

export default function useAtualizarUsuario() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const atualizaUsuario = async (usuario: UserForm, novaSenha?: string) => {
    setIsLoading(true);
    setError(null);

    if (usuario.cpf) {
      usuario.cpf = usuario.cpf.replace(/\D/g, ""); // Remove tudo que não for número
    }
  
    try {
      const resposta = await atualizarUsuario(usuario, novaSenha);
      return resposta; // Sucesso
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      setError(err.message || "Erro desconhecido");
  
      return { status: false, error: err.message || "Erro desconhecido" }; // Retorna um objeto válido
    } finally {
      setIsLoading(false);
    }
  };

  return { atualizaUsuario, isLoading, error }
}
