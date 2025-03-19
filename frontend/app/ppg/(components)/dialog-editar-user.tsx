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
import type { User, UserCriacao } from "@/lib/ppg/definitions";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAtualizarUsuario from "@/hooks/ppg/use-edita-user";
import useUniversidades from "@/hooks/ppg/use-universidades";
import { useToast } from "@/hooks/use-toast";

const perfilPermissions = {
  dono: { isSuperuser: true, isAdmin: true },
  administrador: { isSuperuser: false, isAdmin: true },
  "usuario comum": { isSuperuser: false, isAdmin: false },
} as const;

const editUserSchema = z
  .object({
    idLattes: z.string().min(1, "ID Lattes é obrigatório"),
    nome: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    perfil: z.string().min(1, "O perfil é obrigatório"),
    idIES: z.string().min(1, "ID IES é obrigatório"),
    changePassword: z.boolean(),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .optional()
      .or(z.literal("")),
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
  usuario: User | null;
  aberto: boolean;
  aoFechar: () => void;
}

export default function DialogEditarUsuario({
  usuario,
  aberto,
  aoFechar,
}: DialogEditarUsuarioProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { atualizaUsuario, isLoading } = useAtualizarUsuario();
  const { toast } = useToast();
  const {
    listaUniversidades,
    isLoading: loadingUniversidades,
    error: universidadesError,
  } = useUniversidades();

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
      idIES: "",
      changePassword: false,
      password: "",
    },
  });

  useEffect(() => {
    if (usuario) {
      let perfil = "usuario comum";
      if (usuario.isSuperuser) {
        perfil = "dono";
      } else if (usuario.isAdmin) {
        perfil = "administrador";
      }

      reset({
        idLattes: usuario.idLattes || "",
        nome: usuario.nome || "",
        email: usuario.email || "",
        idIES: usuario.idIes || "",
        perfil: perfil,
        changePassword: false,
        password: "",
      });
    }
  }, [usuario, reset]);

  const watchChangePassword = watch("changePassword");

  const onSubmit = async (data: EditUserFormData) => {
    const { isSuperuser, isAdmin } =
      perfilPermissions[data.perfil as keyof typeof perfilPermissions];

    const usuarioAtualizado: UserCriacao = {
      idLattes: data.idLattes,
      nome: data.nome,
      email: data.email,
      idIes: data.idIES,
      isSuperuser,
      isAdmin,
      isActive: true,
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

            <div className="max-w-full">
              <Label htmlFor="idIES">ID IES</Label>
              <Select
                onValueChange={(value) => setValue("idIES", value)}
                defaultValue={usuario?.idIes || ""}
              >
                {" "}
                <SelectTrigger id="idIES">
                  <SelectValue placeholder="Selecione o ID IES" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUniversidades ? (
                    <SelectItem value="loading">Carregando...</SelectItem>
                  ) : universidadesError ? (
                    <SelectItem value="error">
                      Erro ao carregar universidades
                    </SelectItem>
                  ) : (
                    listaUniversidades.map((universidade) => (
                      <SelectItem
                        className="overflow-hidden"
                        key={universidade.idIes}
                        value={universidade.idIes}
                      >
                        {universidade.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.idIES && (
                <p className="text-red-500 text-sm">{errors.idIES.message}</p>
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
