import { auth } from "@/auth";
import { Graficos } from "./_components/Graficos";
import { redirect } from "next/navigation"; // Para redirecionar caso a origem não seja a esperada

export default async function Home() {
  const session = await auth();
  // Se o usuário tiver `ppglsForms` como "true", redireciona para outra página
  if (session?.user?.ppglsForms === "true") {
    redirect("/lppgls_forms"); // Redireciona para a página desejada
  }
  return <Graficos idIes={session?.user.id_ies!} />;
}


