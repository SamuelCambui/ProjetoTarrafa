"use client"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { User } from "@/lib/ppg/definitions"
import useDeletaUsuario from "@/hooks/ppg/use-deleta-user"
import { useToast } from "@/hooks/use-toast"

type PropsDialogExcluirUsuario = {
  usuario: User | null
  aberto: boolean
  aoFechar: () => void
}

export default function DialogExcluirUsuario({ usuario, aberto, aoFechar }: PropsDialogExcluirUsuario) {
  const { excluirUsuario, isLoading, error } = useDeletaUsuario()
  const { toast } = useToast()

  const handleExcluir = async () => {
    if (usuario) {
      const resp = await excluirUsuario(usuario.idLattes)
      if (resp.status) {
        toast({
          title: "Usuário excluído",
          description: `O usuário ${usuario.nome} foi excluído com sucesso.`,
        })
        aoFechar()
      } else {
        toast({
          title: "Erro",
          description: error || "Erro ao excluir usuário.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
   
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Usuário</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja excluir o usuário {usuario?.nome}? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={aoFechar} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleExcluir} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

