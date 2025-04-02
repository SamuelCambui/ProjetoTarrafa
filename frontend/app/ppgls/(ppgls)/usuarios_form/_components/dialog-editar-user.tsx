"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { UserForm } from "@/types/user_form";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import atualizarUsuario from "@/hooks/form/use-edita-user";

import { useToast } from "@/hooks/form/use-toast";

const perfilPermissions = {
  dono: { is_coordenador: true, is_admin: true },
  administrador: { is_coordenador: true, is_admin: false },
  "usuario comum": { is_admin: false, is_coordenador: false },
} as const;

const editUserSchema = z
  .object({
    idLattes: z.string().min(1, "ID Lattes é obrigatório"),
    nome: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    cpf: z.string()
        .min(1, "CPF é obrigatório"),
    perfil: z.string().min(1, "O perfil é obrigatório"),
    changePassword: z.boolean(),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .optional()
      .or(z.literal("")),
    curso: z.string().min(1, "O curso é obrigatório"),
  })
  .refine(
    (data) => {
      if (data.changePassword && !data.password?.trim()) {
        return false;
      }
      return true;
    },
    {
      message:
        "A senha é obrigatória quando a opção de alterar senha está marcada",
      path: ["password"],
    }
  );

type EditUserFormData = z.infer<typeof editUserSchema>;

interface DialogEditarUsuarioProps {
  usuario: UserForm | null;
  aberto: boolean;
  aoFechar: () => void;
}

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

export default function DialogEditarUsuario({
  usuario,
  aberto,
  aoFechar,
}: DialogEditarUsuarioProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { atualizaUsuario, isLoading } = atualizarUsuario();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      idLattes: "",
      nome: "",
      email: "",
      perfil: "usuario comum",
      changePassword: false,
      password: "",
      curso: "",
    },
  });

  useEffect(() => {
    if (usuario) {
      let perfil = "usuario comum";
      if (usuario.is_coordenador) {
        perfil = "administrador";
      } else if (usuario.is_admin) {
        perfil = "dono";
      }

      reset({
        idLattes: usuario.idlattes || "",
        nome: usuario.name || "",
        email: usuario.email || "",
        cpf: usuario.cpf || "",
        perfil: perfil,
        changePassword: false,
        password: "",
        curso: usuario.curso || "",
      });
    }
  }, [usuario, reset]);

  const watchChangePassword = watch("changePassword");

  const onSubmit = async (data: EditUserFormData) => {

    const { is_coordenador, is_admin } =
      perfilPermissions[data.perfil as keyof typeof perfilPermissions];


    const usuarioAtualizado: UserForm = {
      idlattes: data.idLattes,
      name: data.nome,
      email: data.email,
      is_coordenador,
      is_admin,
      is_active: true,
      cpf: data.cpf,
      curso: data.curso,
    };

    const novaSenha = data.changePassword ? data.password : undefined;
    const resp = await atualizaUsuario(usuarioAtualizado, novaSenha);

    if (resp.status) {
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso.",
      });
      aoFechar();
      reset();
    } else {
      console.error("Erro ao atualizar usuário");
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    reset();
    aoFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias nos dados do usuário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="idLattes">ID Lattes</Label>
              <Input
                disabled
                id="idLattes"
                {...register("idLattes")}
                placeholder="ID Lattes"
              />
              {errors.idLattes && (
                <p className="text-red-500 text-sm">
                  {errors.idLattes.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                {...register("nome")}
                placeholder="Nome completo"
              />
              {errors.nome && (
                <p className="text-red-500 text-sm">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="E-mail"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
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

            <div>
              <Label htmlFor="curso">Curso</Label>
              <Input
                id="curso"
                {...register("curso")}
                placeholder="Curso"
              />
              {errors.curso && (
                <p className="text-red-500 text-sm">{errors.curso.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="perfil">Perfil</Label>
              <Select
                onValueChange={(value) => setValue("perfil", value)}
                value={watch("perfil")}
              >
                <SelectTrigger id="perfil">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(perfilPermissions).map((perfil) => (
                    <SelectItem key={perfil} value={perfil}>
                      {perfil.charAt(0).toUpperCase() + perfil.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.perfil && (
                <p className="text-red-500 text-sm">{errors.perfil.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="changePassword"
                checked={watchChangePassword}
                onCheckedChange={(checked) =>
                  setValue("changePassword", checked)
                }
              />
              <Label htmlFor="changePassword">Alterar senha</Label>
            </div>

            {watchChangePassword && (
              <div>
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: watchChangePassword })}
                    placeholder="Nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
