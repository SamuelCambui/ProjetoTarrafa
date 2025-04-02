import React from "react";
import { CursosList } from "./CursosList";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return <CursosList idIes={session?.user.id_ies!} />;
}
