"use client";
import { AppSidebar } from "@/app/ppgls/_components/sidebar";
import { usePathname } from "next/navigation"; // Adicione esta linha
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { PPGLSContextProvider } from "./PPGLSContext";

export const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  // Se a página for dentro de "/ppgls/formulario", não aplica o layout
  if (pathname.startsWith("/ppgls/formulario")) {
    return <>{children}</>;
  }
  return (
    <PPGLSContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </PPGLSContextProvider>
  );
};

export default Layout;
