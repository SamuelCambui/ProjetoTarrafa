"use client";
import { AppSidebar } from "@/app/ppgls/(components)/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { PPGLSContextProvider } from "./PPGLSContext";

export const Layout = ({ children }: PropsWithChildren) => {
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
