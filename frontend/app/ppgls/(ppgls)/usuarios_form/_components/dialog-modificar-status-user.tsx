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
import type { UserForm } from "@/types/user_form"
import useAlteraStatusUsuario from "@/hooks/form/use-acoes-usuarios";
import { useToast } from "@/hooks/form/use-toast";
  
type PropsDialogModificarStatusUsuario = {
  usuario: UserForm | null;
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
  
    const resp = await modificarStatusUsuario(usuario.idlattes);
  
    if (resp.status) {
      toast({
        title: "Status alterado",
        description: `O usuário ${usuario.name} foi ${
          usuario.is_active ? "desativado" : "ativado"
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
            {usuario?.is_active ? "desativar" : "ativar"} o usuário{" "}
            {usuario?.name}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={aoFechar} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant={usuario?.is_active ? "destructive" : "default"}
            onClick={handleStatusChange}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                {usuario?.is_active ? "Desativando..." : "Ativando..."}
              </>
            ) : usuario?.is_active ? (
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
  