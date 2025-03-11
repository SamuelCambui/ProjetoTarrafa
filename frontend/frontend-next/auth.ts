import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

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
      .then<{ usuario: Session["user"]; erro: boolean }>(
        async (res) => await res.json()
      )
      .catch(() => {
        return null;
      });

    if (!response || response.erro) {
      return null;
    }

    return response.usuario;
  } catch (error) {
    throw error;
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
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(), // Validação do email
            password: z.string().min(1), // Validação da senha
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await login({
          username: email,
          password,
        });

        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl; // Redirecionamento após login/logout
    },
    // Esta função é chamada sempre que o usuário tenta acessar uma página
    async authorized({ auth, request: { nextUrl } }) {
      const isLogged = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnRoot = nextUrl.pathname === "/";

      if (isOnLogin || isOnRoot) {
        if (isLogged) return Response.redirect(new URL("/grad", nextUrl));
        return false;
      }
      if (!isLogged && !isOnLogin) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
    async jwt({ token, trigger, user }) {
      user && (token.user = user); // Adiciona o usuário ao token JWT
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any; // Adiciona o usuário à sessão
      return session;
    },
  },
});
