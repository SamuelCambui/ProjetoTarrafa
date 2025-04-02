import { useState } from "react"
import { criarUsuario } from "@/service/usarios_form/service"
import type { UserForm } from "@/types/user_form"


export default function useCriarUsuario() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adicionaUsuario = async (usuario: UserForm) => {
    setIsLoading(true);
    setError(null);
    setMensagem(null);

    if (usuario.cpf) {
      usuario.cpf = usuario.cpf.replace(/\D/g, ""); // Remove tudo que não for número
    }
  

    console.log("Dados para criar um usuário formatado:");
    console.log(usuario);



    try {
      const resposta = await criarUsuario(usuario);
      console.log("Resposta da API:", resposta);
      
      setMensagem("Usuário adicionado com sucesso!");
      return resposta || { status: false }; // Garante que sempre retorne um objeto válido
    } catch (err: any) {
      console.error("Erro ao adicionar usuário:", err);
      setError(err.message || "Erro desconhecido");

      return { status: false, error: err.message || "Erro desconhecido" }; // Retorno seguro em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  return { adicionaUsuario, isLoading, mensagem, error };
}
