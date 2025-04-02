import React from "react";
import UserForm from "./Usuarios_Form";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return <UserForm/>;
}
