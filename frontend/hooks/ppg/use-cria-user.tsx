import { useState } from "react";
import { criarUsuario } from "@/service/ppg/serviceUsers";
import { User, UserCriacao } from "@/lib/ppg/definitions";

export default function useCriarUsuario() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adicionaUsuario = async (usuario: UserCriacao) => {
    setIsLoading(true);
    setError(null);
    setMensagem(null);

    try {
      const resposta = await criarUsuario(usuario);
      console.log(resposta)
      setMensagem("Usuário adicionado com sucesso!");
      return resposta;
    } catch (err: any) {
      console.error("Erro ao adicionar usuário:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return { adicionaUsuario, isLoading, mensagem, error };
}
