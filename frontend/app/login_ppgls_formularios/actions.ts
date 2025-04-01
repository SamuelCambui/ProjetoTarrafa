"use server";
import { auth, signIn, signOut } from "@/auth";
import { AuthError, Session } from "next-auth";
import { redirect } from "next/navigation";

export async function authorize(
  prevState: string | undefined,
  formData: FormData
) {
  let hasError = false;
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      fromPpglsForms: true,
      redirect: false,
    });
    return;
  } catch (error) {
    if (error instanceof AuthError) {
      hasError = true;
      switch (error.type) {
        case "CredentialsSignin":
          return "Usuário e/ou Senha Incorretos";
        default:
          return "Erro ao tentar fazer login";
      }
    }
  } finally {
    if (!hasError) {
      redirect("/ppgls_forms");
    }
  }
}

export async function logout() {
  const token = "true";
  console.log("---------------------Token retornado--------------------------");
  console.log(token);


  await signOut({ redirect: false });

  // redirect(`/login_ppgls_formularios`);
  redirect(`/login_ppgls_formularios`);
}
