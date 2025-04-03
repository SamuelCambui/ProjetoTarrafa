import React from "react";
import { Dashboard } from "./Dashboard";
import { auth } from "@/auth";

export default async function page() {
  const session = await auth();
  return <Dashboard idIes={session?.user.id_ies!} />;
}
