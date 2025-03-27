import { useState } from "react";
import { obterStatusFormulario } from "@/service/usarios_form/service";

export default function useListarStatusPreenchimentoFormulario(is_coordenador: boolean, ano: number){

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarStatusPreenchimentoFormulario = async (is_coordenador: boolean, ano: number) => {

        setIsLoading(true);
        setError(null);

        try {
            const resposta = await obterStatusFormulario(is_coordenador, ano);
            return resposta || { status: false }; // Garante que sempre retorna um objeto
          } catch (err) {
            console.error("Erro ao obter status do usuário:", err);
            setError("Ocorreu um erro ao alterar o status do usuário. Tente novamente.");
            return { status: false }; // Retorna um objeto padrão em caso de erro
          } finally {
            setIsLoading(false);
        }
    };
    return { listarStatusPreenchimentoFormulario, isLoading, error };
}



  