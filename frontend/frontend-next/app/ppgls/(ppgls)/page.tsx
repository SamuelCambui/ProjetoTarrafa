import { auth } from "@/auth";
import { Graficos } from "./_components/Graficos";
import { redirect } from "next/navigation"; // Para redirecionar caso a origem não seja a esperada

export default async function Home() {
  const session = await auth();

  //Se session.user.ppglsForms === "true", o usuário é redirecionado para /ppgls_forms
  if (session?.user?.ppglsForms === "true") {
    redirect("/login_ppgls_formularios"); 
  }
  return <Graficos idIes={session?.user.id_ies!} />;
}


