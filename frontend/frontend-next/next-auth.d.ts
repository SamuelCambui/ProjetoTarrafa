import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id_lattes: string;
      email: string;
      nome: string;
      is_active: boolean;
      is_superuser: boolean;
      is_admin: boolean;
      id_ies: string;
      nome_ies: string;
      sigla_ies: string;
      link_avatar: string;
    };
  }
}
