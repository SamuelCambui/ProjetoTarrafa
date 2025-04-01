import { auth } from "@/auth";
import { FormPPGLS } from "./Formulario";
import { redirect } from "next/navigation"; // Para redirecionar caso a origem não seja a esperada
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar";

export default async function FormularioPage() {
  const session = await auth();

  //Se session.user.ppglsForms for indefinido, nulo, falso ou diferente de "true" redirecione para login_ppgls_formularios
  if (!session?.user?.ppglsForms || session.user.ppglsForms !== "true") {
    redirect("login_ppgls_formularios");
  }

  return (
      <SidebarProvider>
        <AppSidebar loggedUser={session?.user} />
        <SidebarInset>{<FormPPGLS />}</SidebarInset>
      </SidebarProvider>
    );
}