import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      idlattes: string;
      email: string;
      nome: string;
      is_active: boolean;
      is_superuser: boolean;
      is_admin: boolean;
      id_ies: string;
      nome_ies: string;
      sigla_ies: string;
      link_avatar: string;
      ppglsForms: string
    };
    
  }

  interface SessionForm {
    user: {
      idlattes: string;
      email: string;
      nome: string;
      is_active: boolean;
      is_coordenador: boolean;
      is_admin: boolean;
      link_avatar: string;
    };
  }
}
