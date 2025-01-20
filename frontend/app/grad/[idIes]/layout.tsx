"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useVariablesStore } from "@/store/variablesStore";
import { Separator } from "@radix-ui/react-separator";
import { useParams, usePathname } from "next/navigation";
import React, { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren) => {
  const { idIes } = useParams();
  const currentRoute = usePathname();
  const variables = useVariablesStore((state) => state.variables);
  let routes = currentRoute.split("/");
  const lastRoute = routes[routes.length - 1];
  routes = routes.slice(2, routes.length - 1);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {routes.slice(0, routes.length).map((text, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink className="capitalize">
                      {variables[idIes as string][text]?.toLocaleLowerCase() ??
                        text}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </React.Fragment>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {variables[idIes as string][lastRoute]
                    ? variables[idIes as string][lastRoute].toLocaleLowerCase()
                    : lastRoute}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="bg-muted/50 flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
