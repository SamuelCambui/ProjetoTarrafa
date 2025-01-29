"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { autenticarUsuario } from "@/service/usuarios/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "./actions";
import { useVariablesStore } from "@/store/variablesStore";

const formSchema = z.object({
  email: z
    .string()
    .email("E-Mail inválido.")
    .min(1, "O campo e-mail é obrigatório"),
  password: z.string().min(1, "O campo senha é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setVariablesStore = useVariablesStore((state) => state.setVariables);

  const onSubmit = async (data: FormSchema) => {
    const response = await autenticarUsuario(data.email, data.password);
    if (response instanceof Error || response.usuario === undefined) {
      console.error("Erro ao tentar fazer login");
      return;
    }
    if (response.erro) {
      setError("root", { message: "Usuário ou senha inválidos" });
      return;
    }
    await login(response.usuario);
    setVariablesStore(
      response.usuario.idIes!,
      response.usuario.idIes!,
      response.usuario.nomeIes!
    );
    router.replace(`/ppgls/${response.usuario.idIes}`);
  };

  return (
    <form
      className="flex min-h-screen justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sistema Tarrafa</CardTitle>
          <CardDescription>Versão Pro</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div>
            <Label htmlFor="email">Usuário</Label>
            <Input placeholder="E-Mail" id="email" {...register("email")} />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="*********"
                {...register("password")}
              />
              <Button
                variant="link"
                size="icon"
                type="button"
                className="absolute right-1 top-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.password && (
              <div className="text-red-500 text-sm">
                {errors.password.message}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Entrar
          </Button>
          {errors.root?.message && (
            <div className="text-red-500 text-sm">{errors.root.message}</div>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default Login;
