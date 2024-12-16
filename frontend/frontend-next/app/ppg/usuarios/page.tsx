import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DataTable from "../(components)/table-usuarios";

export default function Page() {
  const mockCurrentUser = {
    idlattes: "000001",
    is_admin: true,
    is_superuser: true,
  };

  const usuarios = [
    {
      idlattes: "123456",
      full_name: "Carlos Silva",
      email: "carlos.silva@example.com",
      perfil: "Professor",
      is_active: true,
      logado: true,
    },
    {
      idlattes: "789012",
      full_name: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      perfil: "Pesquisadora",
      is_active: false,
      logado: false,
    },
    {
      idlattes: "345678",
      full_name: "João Santos",
      email: null,
      perfil: "Coordenador",
      is_active: true,
      logado: true,
    },
  ];

  return (
    <>
      <h1 className="">Usuários</h1>
      
      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Busque por um docente..." className="pl-8" />
      </div>
      
      <DataTable data={usuarios} currentUser={mockCurrentUser} />
    </>
  );
}
