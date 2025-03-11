import { auth } from "@/auth";
import { Graficos } from "./_components/Graficos";

export default async function Home() {
  const session = await auth();
  return <Graficos idIes={session?.user.id_ies!} />;
}
