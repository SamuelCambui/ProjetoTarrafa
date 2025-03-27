import React from "react";
import StatusForm from "./Status_Preench_Form";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return <StatusForm/>;
}
