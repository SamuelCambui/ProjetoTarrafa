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
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useFormState } from "react-dom";
import { authorize } from "./actions";

const Login = () => {
  const [state, action, isSubmitting] = useFormState(authorize, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="flex min-h-screen justify-center items-center"
      action={action}
    >
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sistema Tarrafa(PPGLS Formulários)</CardTitle>
          <CardDescription>Versão Pro</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div>
            <Label htmlFor="email">Usuário</Label>
            <Input placeholder="E-Mail" id="email" name="email" />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="*********"
                name="password"
              />
              <div className="flex flex-col">
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
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Entrar
          </Button>
          <div className="text-red-500 text-sm">{state && state}</div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Login;
