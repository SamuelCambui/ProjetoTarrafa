import {
  Book,
  Building,
  ChevronDown,
  ChevronsUpDown,
  Home,
  LogOut,
  FileText,
} from "lucide-react";

import { logout } from "@/app/login/actions";
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
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";


export function AppSidebar() {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();

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
    {
      title: "Formulário",
      url: `/ppgls/formulario`,
      icon: FileText,
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
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
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
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
                    {session?.user ? (
                      <Image
                        src={session.user.link_avatar ?? ""}
                        alt="AV"
                        fill
                      />
                    ) : (
                      <Loading />
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.nome ?? "Usuário"}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email ?? "E-mail"}
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
                      <Image
                        src={session?.user?.link_avatar ?? ""}
                        alt="AV"
                        fill
                      />
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.nome ?? "Usuário"}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user?.email ?? "E-mail"}
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
