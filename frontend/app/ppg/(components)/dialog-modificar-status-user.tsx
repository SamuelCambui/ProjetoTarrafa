import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { User } from "@/lib/ppg/definitions";
import useAlteraStatusUsuario from "@/hooks/ppg/use-acoes-usuarios";
import { useToast } from "@/hooks/use-toast";

type PropsDialogModificarStatusUsuario = {
  usuario: User | null;
  aberto: boolean;
  aoFechar: () => void;
};

export default function DialogModificarStatusUsuario({
  usuario,
  aberto,
  aoFechar,
}: PropsDialogModificarStatusUsuario) {
  const { modificarStatusUsuario, isLoading, error } = useAlteraStatusUsuario();
  const { toast } = useToast();

  const handleStatusChange = async () => {
    if (!usuario) return;

    const resp = await modificarStatusUsuario(usuario.idIes);

    if (resp.status) {
      toast({
        title: "Status alterado",
        description: `O usuário ${usuario.nome} foi ${
          usuario.isActive ? "desativado" : "ativado"
        } com sucesso.`,
      });
    } else {
      toast({
        title: "Erro",
        description: error || "Erro ao modificar o status do usuário.",
        variant: "destructive",
      });
    }
    aoFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modificar Status do Usuário</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja{" "}
            {usuario?.isActive ? "desativar" : "ativar"} o usuário{" "}
            {usuario?.nome}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={aoFechar} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant={usuario?.isActive ? "destructive" : "default"}
            onClick={handleStatusChange}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                {usuario?.isActive ? "Desativando..." : "Ativando..."}
              </>
            ) : usuario?.isActive ? (
              "Desativar"
            ) : (
              "Ativar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
