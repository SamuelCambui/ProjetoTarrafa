import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { setCookie } from "nookies";

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const response = await fetch("http://localhost:8002", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then<{ usuario: Session["user"]; erro: boolean }>(async (res) => await res.json())
      .catch(() => {
        return { erro: true }; // Adiciona erro padrão para falha na comunicação
      });

    if (!response || response.erro) {
      return null; // Retorna null se a resposta for inválida ou erro
    }

    return response.usuario; // Retorna o usuário caso a autenticação seja bem-sucedida
  } catch (error) {
    throw error; // Lança erro caso algo falhe na execução
  }
}

export async function login_form({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const response = await fetch("http://localhost:8003", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then<{ usuario: Session["user"]; erro: boolean }>(async (res) => await res.json())
      .catch(() => {
        return { erro: true }; // Adiciona erro padrão para falha na comunicação
      });

    if (!response || response.erro) {
      return null; // Retorna null se a resposta for inválida ou erro
    }

    return response.usuario; // Retorna o usuário caso a autenticação seja bem-sucedida
  } catch (error) {
    throw error; // Lança erro caso algo falhe na execução
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  pages: {
    signIn: "/login", // Página de login
    signOut: "/login", // Página de logout
  },
  session: {
    strategy: "jwt", // Estratégia de sessão baseada em JWT
    maxAge: 15 * 24 * 60 * 60, // Tempo máximo de duração da sessão (15 dias)
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        fromPpglsForms: { label: "PPGLS Forms", type: "boolean" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(), // Validação do email
            password: z.string().min(1), // Validação da senha
            fromPpglsForms: z.string(), // Validação do checkbox
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password, fromPpglsForms} = parsedCredentials.data;

        const user = await (fromPpglsForms === "true" 
          ? login_form({ username: email, password }) 
          : login({ username: email, password }));

        if (user) {
          return { ...user, ppglsForms: parsedCredentials.data.fromPpglsForms };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // async redirect({ url, baseUrl}) {
    //   console.log("URL recebida no redirect:", url);
    //   console.log("URL base:", baseUrl);
      
    //   const urlObj = new URL(url, baseUrl);

    //   const token = urlObj.searchParams.get("token");
    
    //   console.log("Token recebido no redirect:", token);

    //   if (token === "true") {
    //     return "/login_ppgls_formularios";
    //   }
    //   return "/login"; 
    // },
    // Esta função é chamada sempre que o usuário tenta acessar uma página
    async authorized({ auth, request: { nextUrl } }) {
      const isLogged = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnPPGLSFormLogin = nextUrl.pathname.startsWith("/login_ppgls");
      const isOnPPGLSForm = nextUrl.pathname.startsWith("/ppgls_forms");
      const isOnRoot = nextUrl.pathname === "/";
      const loggedUser = auth?.user;

      // Lida com todos casos possíveis para quando o usuário tem acesso aos Formularios do PPGLS
      if (isLogged && loggedUser?.ppglsForms === "true") {
        if (isOnPPGLSFormLogin) {
          return Response.redirect(new URL("/ppgls_forms", nextUrl));
        }
        if (isOnRoot) {
          return Response.redirect(new URL("/ppgls_forms", nextUrl));
        }
        if (isOnLogin) {
          return Response.redirect(new URL("/ppgls_forms", nextUrl));
        }
        // Não deixa o usuário acessar nenhum outro módulo que não seja o de Formulários do PPGLS
        if (!isOnPPGLSForm) {
          return false;
        }
        return true;
      }

      // Se o usuário não está logado e está na página de login do PPGLS Forms
      if (!isLogged && isOnPPGLSFormLogin) {
        return true;
      }

      // Se o usuário esta acessando a tela de login ou a tela inicial
      if (isOnLogin || isOnRoot) {
        // Se o usuário está logado e tenta acessar a página de login, redireciona para a página inicial
        if (isLogged) return Response.redirect(new URL("/ppgls", nextUrl));

        // Se o usuário não está logado e tenta acessar uma página qualquer, redireciona para a página de login
        return false;
      }

      // Se o usuário tenta acessar o módulo de Formulários do PPGLS estando em qualquer outra rota, nao deixa ele acessar
      if (isOnPPGLSForm) {
        return false;
      }

      // Se o usuário não está logado e estiver em qualquer outra rota protegida, redireciona para a página de login
      if (!isLogged && !isOnLogin) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      // Se o usuário está logado e tenta acessar uma página qualquer, permite o acesso
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any; // Adiciona o usuário à sessão
      return session;
    },
  },
});

