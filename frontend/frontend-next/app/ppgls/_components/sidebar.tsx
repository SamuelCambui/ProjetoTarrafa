"use client";
import {
  Book,
  Building,
  ChevronDown,
  ChevronsUpDown,
  Home,
  LogOut,
  FileText,
  File, 
  Users,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

import { logout } from "@/app/login_ppgls_formularios/actions";
import { Loading } from "@/components/loading";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";


export function AppSidebar({ loggedUser }: { loggedUser?: Session["user"] }) {
  const { isMobile } = useSidebar();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const items = [
    {
      title: "Geral",
      url: `/ppgls`,
      icon: Home,
    },
    {
      title: "Cursos",
      url: `/ppgls/cursos`,
      icon: Book,
    },
    {
      title: "Departamentos",
      url: `/ppgls/departamentos`,
      icon: Building,
    },
  ];

  const formSubItems = [
    {
      title: "Dados",
      url: `/ppgls/dados_form`,
      icon: File,
    },
    {
      title: "Usuários",
      url: `/ppgls/usuarios_form`,
      icon: Users,
    },
    {
      title: "Status de Preenchimento",
      url: `/ppgls/status_preenchimento`,
      icon: CheckCircle,
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          {/* Dropdown "Sistema Tarrafa" */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Sistema Tarrafa
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <Link href="/ppg">Stricto Sensu</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/grad">Graduação</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/ppgls">Lato Sensu e Stricto Sensu</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {/* Itens principais */}
          {items.map(({ title, url, icon: Icon }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton asChild>
                <Link href={url}>
                  <Icon />
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Formulário (Menu expansível) */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setIsFormOpen(!isFormOpen)}>
              <FileText />
              <span>Formulário</span>
              <ChevronDown className={`ml-auto transition-transform ${isFormOpen ? "rotate-180" : ""}`} />
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Subitens de Formulário */}
          {isFormOpen &&
            formSubItems.map(({ title, url, icon: Icon }) => (
              <SidebarMenuItem key={title} className="pl-6">
                <SidebarMenuButton asChild>
                  <Link href={url}>
                    <Icon />
                    <span>{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent />

      {/* Footer com Avatar e Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-full">
                    {loggedUser ? (
                      <Image src={loggedUser.link_avatar ?? ""} alt="AV" fill />
                    ) : (
                      <Loading />
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {loggedUser?.nome ?? "Usuário"}
                    </span>
                    <span className="truncate text-xs">
                      {loggedUser?.email ?? "E-mail"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-full">
                      <Image src={loggedUser?.link_avatar ?? ""} alt="AV" fill />
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                      {loggedUser?.nome ?? "Usuário"}
                      </span>
                      <span className="truncate text-xs">
                      {loggedUser?.email ?? "E-mail"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
