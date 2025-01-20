"use client";
import { AppSidebar } from "@/app/grad/(components)/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { GradContextProvider } from "./GradContext";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <GradContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </GradContextProvider>
  );
};

export default Layout;
