import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col gap-2 items-center justify-center">
      <h1 className="text-xl">Essa página não existe.</h1>
      <Link href="/">
        <Button variant="outline" size="lg">
          Voltar
        </Button>
      </Link>
    </div>
  );
}
