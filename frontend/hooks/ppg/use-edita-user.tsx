import { useState } from "react"
import { atualizarUsuario } from "@/service/ppg/serviceUsers"
import type { UserCriacao } from "@/lib/ppg/definitions"

export default function useAtualizarUsuario() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const atualizaUsuario = async (usuario: UserCriacao, novaSenha?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const resposta = await atualizarUsuario(usuario, novaSenha)
      return resposta
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err)
      setError(err.message || "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  return { atualizaUsuario, isLoading, error }
}

