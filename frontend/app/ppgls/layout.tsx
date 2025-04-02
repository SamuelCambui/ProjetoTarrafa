import { AppSidebar } from "@/app/ppgls/_components/sidebar";
import { auth } from "@/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "PPGLS",
};

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  return (
    <SidebarProvider>
      <AppSidebar loggedUser={session?.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
  
}

