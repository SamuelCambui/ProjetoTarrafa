import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artigos de Docentes",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}