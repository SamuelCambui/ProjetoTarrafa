import { auth } from "@/auth";
import { FormPPGLS } from "./Formulario";
import { redirect } from "next/navigation"; // Para redirecionar caso a origem não seja a esperada
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar";

export default async function FormularioPage() {
  const session = await auth();

  // Verifica se o usuário tem acesso ao PPGLS Forms
  if (!session?.user?.ppglsForms || session.user.ppglsForms !== "true") {
    redirect("/login_ppgls_formularios"); // Redireciona para login se não tiver permissão
  }

  // return <FormPPGLS />; // Renderiza o formulário se a verificação passar


  return (
      <SidebarProvider>
        <AppSidebar loggedUser={session?.user} />
        <SidebarInset>{<FormPPGLS />}</SidebarInset>
      </SidebarProvider>
    );
}