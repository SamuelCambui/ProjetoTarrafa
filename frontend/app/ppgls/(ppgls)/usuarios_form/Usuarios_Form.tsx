"use client"

import { useState, useCallback } from "react"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useUsuarios from "@/hooks/form/use-usuarios"
import { Plus, Search } from "lucide-react"
import DataTable from "./_components/table-usuarios"
import DialogExcluirUsuario from "./_components/dialog-excluir-user"
import DialogCriarUsuario from "./_components/dialog-criar-user"
import DialogModificarStatusUsuario from "./_components/dialog-modificar-status-user"
import type { UserForm } from "@/types/user_form"
import DialogEditarUsuario from "./_components/dialog-editar-user"
import { useSearch } from "@/hooks/use-search"



const usuarioAtual = {
  idlattes: "5262545895128956",
  email: "rene.veloso@unimontes.br",
  name: "Dono",
  is_active: true,
  is_coordenador: true,
  is_admin: true,
  link_avatar: "ipsum.com",
}

export default function UserForm() {
  const [dialogoExcluirAberto, setDialogoExcluirAberto] = useState(false)
  const [dialogoCriarAberto, setDialogoCriarAberto] = useState(false)
  const [dialogoModStatusAberto, setDialogoModStatusAberto] = useState(false)
  const [dialogoEditarAberto, setDialogoEditarAberto] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UserForm | null>(null)

  const { listaUsuarios, isLoading, error, refetch } = useUsuarios(usuarioAtual);

  const { dadosFiltrados, termoBusca, setTermoBusca } = useSearch(listaUsuarios, (usuario, termo) =>
    usuario.name.toLowerCase().includes(termo.toLowerCase()),
  
  )

  const handleActionComplete = useCallback(() => {
    refetch()
  }, [refetch])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <div>Não foi possível carregar os usuários.</div>
  }

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold">Usuários</h1>
      <div className="flex space-x-2">
        <div className="relative mb-2 flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Busque por um usuário..."
            className="pl-8"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
        <Button onClick={() => setDialogoCriarAberto(true)}>
          <Plus /> Novo usuário
        </Button>
      </div>
      <DataTable
        dados={dadosFiltrados}
        usuarioAtual={usuarioAtual}
        aoExcluirUsuario={(usuario) => {
          setUsuarioSelecionado(usuario)
          setDialogoExcluirAberto(true)
        }}
        aoModificarStatus={(usuario) => {
          setUsuarioSelecionado(usuario)
          setDialogoModStatusAberto(true)
        }}
        aoEditarUsuario={(usuario) => {
          setUsuarioSelecionado(usuario)
          setDialogoEditarAberto(true)
        }}
      />
      <DialogExcluirUsuario
        usuario={usuarioSelecionado}
        aberto={dialogoExcluirAberto}
        aoFechar={() => {
          setDialogoExcluirAberto(false)
          handleActionComplete()
        }}
      />
      <DialogCriarUsuario
        aberto={dialogoCriarAberto}
        aoFechar={() => {
          setDialogoCriarAberto(false)
          handleActionComplete()
        }}
      />
      <DialogModificarStatusUsuario
        usuario={usuarioSelecionado}
        aberto={dialogoModStatusAberto}
        aoFechar={() => {
          setDialogoModStatusAberto(false)
          handleActionComplete()
        }}
      />
      <DialogEditarUsuario
        usuario={usuarioSelecionado}
        aberto={dialogoEditarAberto}
        aoFechar={() => {
          setDialogoEditarAberto(false)
          handleActionComplete()
        }}
      />
    </div>
  )
}

