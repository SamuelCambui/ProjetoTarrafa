"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type DrawerInfoPpgProps = {
  isOpen: boolean;
  onClose: () => void;
  infoPpg: {
    nome: string;
    siglas: string;
    nota: string;
    email: string;
    info: string;
    url: string;
  };
};

export default function DrawerInfoPpg({
  isOpen,
  onClose,
  infoPpg,
}: DrawerInfoPpgProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {`${infoPpg?.nome || "Informações do PPG"} | ${infoPpg?.siglas || ""}`}
          </DrawerTitle>
          <DrawerDescription>
            <>
              <strong>Nota {infoPpg?.nota || "N/A"}</strong>
              <br />
              Email: {infoPpg?.email || "Email não disponível"}
              <br />
              {infoPpg?.info || "Informações não disponíveis."}
            </>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="link">
            <a
              href={infoPpg?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {infoPpg?.url || "Site não disponível"}
            </a>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
