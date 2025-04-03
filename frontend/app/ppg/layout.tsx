"use client";
<<<<<<< HEAD
=======

>>>>>>> origin/yagodev
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
<<<<<<< HEAD
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  const route = usePathname();
=======
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren, nome : string) => {
  const route = usePathname();
  const segments = route.split("/").filter(Boolean); 
>>>>>>> origin/yagodev

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
<<<<<<< HEAD
                {route.split("/").map((text, index) => (
                  <>
                    <BreadcrumbItem key={index} className="hidden md:block">
                      <BreadcrumbLink href="#">{text}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                ))}
                {/* <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
=======
                {segments.map((segment, index) => {
                  const isLast = index === segments.length - 1;
                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{segment}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={`/${segments.slice(0, index + 1).join("/")}`}>
                            {segment}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
>>>>>>> origin/yagodev
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
<<<<<<< HEAD
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
=======

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </div>
            <Toaster />
>>>>>>> origin/yagodev
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
