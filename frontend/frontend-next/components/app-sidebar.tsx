"use client"

import {
  Award,
  BookOpen,
  Bot,
  LayoutDashboard,
  Library,
  Logs,
  MessageSquare,
  Settings,
  Settings2,
  SquareTerminal,
  Users2,
  Waypoints
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSuperUser } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


const user = {
  name: "Gabrielle Zuba ",
  email: "gabszuba@unimontes.br",
  avatar: "/avatars/shadcn.jpg",
}


const data = {
  navMain: [
    // {
    //   title: "Playground",
    //   url: "#",
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "History",
    //       url: "#",
    //     },
    //     {
    //       title: "Starred",
    //       url: "#",
    //     },
    //     {
    //       title: "Settings",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Programas",
      url: "/ppg",
      icon: LayoutDashboard,
    },
    {
      title: "Rede de Colaboração",
      url: "/ppg/rede-colaboracao",
      icon: Waypoints,
    },
    {
      title: "Ranking de Docentes",
      url: "/ppg/ranking-docentes",  
      icon: Award,
    },
    {
      title: "Artigos de Docentes",
      url: "/ppg/artigos-docentes",  
      icon: Library,
    },
    {
      title: "Usuários",
      url: "/ppg/usuarios",  
      icon: Users2,
    },
  ],
  admin: [
    {
      name: "Setup",
      url: "#",
      icon: Settings,
    },
    {
      name: "Logs",
      url: "#",
      icon: Logs,
    },
    {
      name: "Pop-ups",
      url: "#",
      icon: MessageSquare,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSuperUser itemsUser={data.admin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
