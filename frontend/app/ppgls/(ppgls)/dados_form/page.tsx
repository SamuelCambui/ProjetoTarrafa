import React from "react";
import {Forms} from "./Dados_form";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return <Forms/>;
}
