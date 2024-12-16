import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Metadata } from "next";
import { DropdownFilter } from "../(components)/filtro-dropdown";

export const metadata: Metadata = {
  title: "Rede de Colaboração",
};

export default function Page() {
  return (
    <>
      <h1>Rede de Colaboração</h1>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <div className="flex gap-4">
          <Input placeholder="Busque por um programa..." className="pl-8" />
          <DropdownFilter />
        </div>
      </div>
    </>
  );
}
