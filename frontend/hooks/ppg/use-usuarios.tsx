"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/lib/ppg/definitions"
import { obtemListaUsuarios } from "@/service/ppg/serviceUsers"

export default function useUsuarios(usuario: User) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listaUsuarios, setListaUsuarios] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setListaUsuarios([])

    try {
      const resposta = await obtemListaUsuarios(usuario)
      setListaUsuarios(resposta)
    } catch (err: any) {
      console.error("Erro ao obter lista de usuários:", err)
      setError(err.message || "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }, [usuario])

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  const refetch = useCallback(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  return { listaUsuarios, isLoading, error, refetch }
}

