"use client"

import { useState } from "react"
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
import useCriarUsuario from "@/hooks/form/use-cria-user"
import { useToast } from "@/hooks/form/use-toast"

type Perfil = "dono" | "administrador" | "usuario comum"


interface RolePermissions {
  is_coordenador: boolean
  is_admin: boolean
}

const perfilPermissions: Record<Perfil, RolePermissions> = {
  dono: { is_coordenador: true, is_admin: true },
  administrador: { is_coordenador: true, is_admin: false },
  "usuario comum": { is_admin: false, is_coordenador: false },
} as const;

const createUserSchema = z.object({
  idLattes: z.string().min(1, "ID Lattes é obrigatório"),
  name: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string()
    .min(1, "CPF é obrigatório"),
  perfil: z.enum(["dono", "administrador", "usuario comum"]).default("usuario comum"),
  curso: z.string().optional(), // Torna o campo 'curso' opcional
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

const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false; // CPF deve ter 11 dígitos e não pode ser repetido (ex: 111.111.111-11)
  }

  let soma = 0, resto;

  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  
  return resto === parseInt(cpf.charAt(10));
};


export default function DialogCriarUsuario({ aberto, aoFechar }: DialogCriarUsuarioProps) {
  const [perfil, setPerfil] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null) // Exibir erros na tela
  const isCursoDisabled = perfil === "dono" || perfil === "administrador";

  const { adicionaUsuario, isLoading } = useCriarUsuario()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  })

  const onSubmit = async (data: CreateUserFormData) => {
    console.log("🟢 onSubmit foi chamado");
    console.log("📌 Dados enviados:", data);
    
    try {
      setErrorMessage(null); // Limpa qualquer erro anterior

      const { is_coordenador, is_admin } = perfilPermissions[data.perfil]

      const userData = {
        idlattes: data.idLattes,
        name: data.name,
        email: data.email,
        perfil: data.perfil,
        is_coordenador,
        is_admin,
        is_active: true,
        cpf: data.cpf,
        curso: data.curso,
      }

      console.log("📌 Dados para criar um novo usuário:", userData);

      const resp = await adicionaUsuario(userData);
      console.log("📌 Resposta do servidor:", resp);

      if (resp.status) {
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso.",
        })
        reset()
        setPerfil("")
        aoFechar()
      } else {
        throw new Error("mensagem" in resp ? resp.mensagem : resp.error || "Erro desconhecido ao criar usuário");
      }
    } catch (error: any) {
      console.error("🔴 Erro ao criar usuário:", error);
      console.error("Detalhes do erro:", error.response || error.message || error)
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    reset()
    setPerfil("")
    setErrorMessage(null);
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

        {/* Exibir erro geral, se houver */}
        {errorMessage && <p className="text-red-500 text-sm font-bold">{errorMessage}</p>}

        <form
            onSubmit={(e) => {
              console.log("📌 Formulário enviado");
              e.preventDefault();

              handleSubmit(async (data) => {
                try {
                  console.log("📌 Dados validados:", data);
                  await onSubmit(data); // Aguarda a submissão do usuário
                } catch (error) {
                  console.error("🚨 Erro inesperado no handleSubmit:", error);
                }
              })(e);

              console.log("📌 Erros no formulário:", errors);
            }}
          >
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-idLattes">ID Lattes</Label>
              <Input id="create-idLattes" {...register("idLattes")} />
              {errors.idLattes && <p className="text-red-500 text-sm">{errors.idLattes.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-nome">Nome</Label>
              <Input id="create-nome" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-email">E-mail</Label>
              <Input id="create-email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-cpf">CPF</Label>
              <Input
                {...register("cpf", {
                  required: "O CPF é obrigatório",
                  onChange: (e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
                    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos numéricos


                    // Aplica a máscara de CPF
                    e.target.value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

                    // Valida o CPF
                    if (value.length === 11 && !validarCPF(value)) {
                      e.target.setCustomValidity("CPF inválido. Verifique os dígitos.");
                      e.target.reportValidity(); // Exibe a mensagem de erro imediatamente
                    } else if (value.length !== 11) {
                      e.target.setCustomValidity("O CPF deve ter exatamente 11 dígitos numéricos.");
                      e.target.reportValidity();
                    } else {
                      e.target.setCustomValidity("");
                      e.target.reportValidity();
                    }
                  },
                })}
                type="text"
                inputMode="numeric"
                maxLength={14} // Inclui pontos e traço na exibição
                value={watch("cpf") ? watch("cpf").replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4") : ""}
              />
              {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-curso">Curso</Label>
              <Input id="create-curso" {...register("curso")}  disabled={isCursoDisabled} />
              {errors.curso && <p className="text-red-500 text-sm">{errors.curso.message}</p>}
            </div>
            

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="create-perfil">Perfil</Label>
              <Select
                value={perfil}
                onValueChange={(value) => {
                  const perfilSelecionado = value as Perfil; 
                  setPerfil(value)
                  setValue("perfil", perfilSelecionado)
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
