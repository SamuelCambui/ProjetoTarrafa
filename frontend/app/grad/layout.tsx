import { AppSidebar } from "@/app/grad/_components/sidebar";
import { auth } from "@/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  return (
    <SidebarProvider>
      <AppSidebar loggedUser={session?.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
