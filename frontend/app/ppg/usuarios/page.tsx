"use client"

import { useState, useCallback } from "react"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useUsuarios from "@/hooks/ppg/use-usuarios"
import { Plus, Search } from "lucide-react"
import DataTable from "../(components)/table-usuarios"
import DialogExcluirUsuario from "../(components)/dialog-excluir-user"
import DialogCriarUsuario from "../(components)/dialog-criar-user"
import DialogModificarStatusUsuario from "../(components)/dialog-modificar-status-user"
import type { User } from "@/lib/ppg/definitions"
import DialogEditarUsuario from "../(components)/dialog-editar-user"
import { useSearch } from "@/hooks/use-search"

const usuarioAtual = {
  email: "rene.veloso@unimontes.br",
  idIes: "3727",
  idLattes: "5262545895128956",
  isActive: false,
  isAdmin: true,
  isSuperuser: true,
  linkAvatar: "ipsum.com",
  nome: "Dolor",
  nomeIes: "Adipisicing Mollit Ullamco Pariatur Ut",
  siglaIes: "TEMP",
}

export default function Page() {
  const [dialogoExcluirAberto, setDialogoExcluirAberto] = useState(false)
  const [dialogoCriarAberto, setDialogoCriarAberto] = useState(false)
  const [dialogoModStatusAberto, setDialogoModStatusAberto] = useState(false)
  const [dialogoEditarAberto, setDialogoEditarAberto] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<User | null>(null)

  const { listaUsuarios, isLoading, error, refetch } = useUsuarios(usuarioAtual)

  const { dadosFiltrados, termoBusca, setTermoBusca } = useSearch(listaUsuarios, (usuario, termo) =>
    usuario.nome.toLowerCase().includes(termo.toLowerCase()),
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

