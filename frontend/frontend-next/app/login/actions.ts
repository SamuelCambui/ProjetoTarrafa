"use server";
import { cookies } from "next/headers";
import { createSession, decrypt, deleteSession } from "@/lib/session";
import { User } from "@/types/user";
import { redirect } from "next/navigation";

export async function login(user: User) {
  await createSession(user);
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function getCurrentUser() {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);
  return session;
}
