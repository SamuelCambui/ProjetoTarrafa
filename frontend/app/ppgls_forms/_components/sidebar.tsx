"use client";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/login_ppgls_formularios/actions";
import { Avatar } from "@/components/ui/avatar";
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";
import Image from "next/image";
import { Session } from "next-auth";

export function AppSidebar({ loggedUser }: { loggedUser?: Session["user"] }) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarFooter className="flex flex-col mt-auto px-4 py-1.5 pb-4 text-left text-sm"> {/* Adicionei pb-4 para um espaçamento inferior */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-full">
            {loggedUser ? (
              <Image src={loggedUser.link_avatar ?? ""} alt="AV" fill />
            ) : (
              <div className="h-full w-full bg-gray-300" />
            )}
          </Avatar>
          <div className="text-left text-sm leading-tight">
            {/* Nome em uma linha */}
            <span className="truncate font-semibold block">{loggedUser?.nome ?? "Usuário"}</span>
            {/* Email em outra linha */}
            <span className="truncate text-xs block">{loggedUser?.email ?? "E-mail"}</span>
          </div>
        </div>
        {/* Logout */}
        <div className="flex items-center mt-2">
          <button onClick={() => handleLogout()} className="text-sm text-gray-700 flex items-center gap-2">
            <LogOut />
            Log out
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
