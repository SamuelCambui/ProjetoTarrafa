"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useCriarUsuario from "@/hooks/ppg/use-cria-user"
import useUniversidades from "@/hooks/ppg/use-universidades"
import { useToast } from "@/hooks/use-toast"

type Perfil = "dono" | "administrador" | "usuario comum"

interface RolePermissions {
  isSuperuser: boolean
  isAdmin: boolean
}

const perfilPermissions: Record<Perfil, RolePermissions> = {
  dono: { isSuperuser: true, isAdmin: true },
  administrador: { isSuperuser: false, isAdmin: true },
  "usuario comum": { isSuperuser: false, isAdmin: false },
}

const createUserSchema = z.object({
  idLattes: z.string().min(1, "ID Lattes é obrigatório"),
  nome: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  perfil: z.string().min(1, "Tipo do perfil é obrigatório"),
  idIes: z.string().min(1, "ID IES é obrigatório"),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

interface DialogCriarUsuarioProps {
  aberto: boolean
  aoFechar: () => void
}

const opcoesPerfil = [
  { value: "dono", label: "Dono" },
  { value: "administrador", label: "Administrador" },
  { value: "usuario comum", label: "Usuário comum" },
]

export default function DialogCriarUsuario({ aberto, aoFechar }: DialogCriarUsuarioProps) {
  const [perfil, setPerfil] = useState<string>("")
  const [idIes, setIdIes] = useState<string>("")

  const { adicionaUsuario, isLoading } = useCriarUsuario()
  const { toast } = useToast()
  const { listaUniversidades, isLoading: loadingUniversidades, error: universidadesError } = useUniversidades()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  })

  useEffect(() => {
    if (listaUniversidades.length > 0 && !idIes) {
      setIdIes(listaUniversidades[0].id)
      setValue("idIes", listaUniversidades[0].id)
    }
  }, [listaUniversidades, idIes, setValue])

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      const { isSuperuser, isAdmin } = perfilPermissions[data.perfil as Perfil]

      const userData = {
        idLattes: data.idLattes,
        nome: data.nome,
        email: data.email,
        idIes: data.idIes,
        perfil: data.perfil as Perfil,
        isSuperuser,
        isAdmin,
        isActive: true,
      }

      const resp = await adicionaUsuario(userData)
      console.log(resp)
      if (resp.status) {
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso.",
        })
        reset()
        setPerfil("")
        setIdIes("")
        aoFechar()
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    reset()
    setPerfil("")
    setIdIes("")
    aoFechar()
  }

  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo usuário. A senha padrão será o ID Lattes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-idLattes">ID Lattes</Label>
              <Input id="create-idLattes" {...register("idLattes")} />
              {errors.idLattes && <p className="text-red-500 text-sm">{errors.idLattes.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-nome">Nome</Label>
              <Input id="create-nome" {...register("nome")} />
              {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-email">E-mail</Label>
              <Input id="create-email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-perfil">Perfil</Label>
              <Select
                value={perfil}
                onValueChange={(value) => {
                  setPerfil(value)
                  setValue("perfil", value)
                }}
              >
                <SelectTrigger id="create-perfil">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  {opcoesPerfil.map((opcao) => (
                    <SelectItem key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.perfil && <p className="text-red-500 text-sm">{errors.perfil.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-idIes">ID IES</Label>
              <Select
                value={idIes}
                onValueChange={(value) => {
                  setIdIes(value)
                  setValue("idIes", value)
                }}
              >
                <SelectTrigger id="create-idIes">
                  <SelectValue placeholder="Selecione o ID IES" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUniversidades ? (
                    <SelectItem value="carregando">Carregando...</SelectItem>
                  ) : universidadesError ? (
                    <SelectItem value="erro">Erro ao carregar universidades</SelectItem>
                  ) : (
                    listaUniversidades.map((universidade) => (
                      <SelectItem key={universidade.idIes} value={universidade.idIes}>
                        {universidade.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.idIes && <p className="text-red-500 text-sm">{errors.idIes.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

