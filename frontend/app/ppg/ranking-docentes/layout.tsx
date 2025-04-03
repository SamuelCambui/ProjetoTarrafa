import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking de Docentes",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}