"use client"

import { useState, useEffect, useCallback } from "react"
import type { UserForm } from "@/types/user_form"
import { obtemListaUsuarios } from "@/service/usarios_form/service"


export default function useUsuarios(usuario: UserForm) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listaUsuarios, setListaUsuarios] = useState<UserForm[]>([]);
    const [error, setError] = useState<string | null>(null);
  
    const fetchUsuarios = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      setListaUsuarios([]);
  
      try {
        const resposta = await obtemListaUsuarios(usuario.is_admin); 
        console.log("Usuario retornado da chamada::::::::::::::::::::::::");
        console.log(resposta);
        setListaUsuarios(resposta);
      } catch (err: any) {
        console.error("Erro ao obter lista de usuários:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    }, [usuario.is_admin]);
    
    useEffect(() => {
      fetchUsuarios();
    }, [fetchUsuarios]);
  
    const refetch = useCallback(() => {
      fetchUsuarios();
    }, [fetchUsuarios]);
  
    return { listaUsuarios, isLoading, error, refetch };
  }
  

