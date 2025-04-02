import React from "react";
import FormularioDetalhes from "./FormularioDetalhes";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return <FormularioDetalhes/>;
}
