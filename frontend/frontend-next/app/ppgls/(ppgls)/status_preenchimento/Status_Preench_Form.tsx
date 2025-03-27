"use client";

import { useState, useEffect } from "react";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Usando o componente de Select, caso você tenha no seu código
import useListarStatusPreenchimentoFormulario from "@/hooks/form/use_status_form";
import { Plus, Search } from "lucide-react";
import DataTable from "./_components/table-status-usuarios";
import type { UserStatus } from "@/types/user_status";

const usuarioAtual = {
  idlattes: "5262545895128956",
  email: "rene.veloso@unimontes.br",
  name: "Dolor",
  is_active: true,
  is_coordenador: true,
  is_admin: true,
  link_avatar: "ipsum.com",
};

export default function StatusForm() {
  // Estado para armazenar os dados da API
  const [listaUsuariosStatus, setListaUsuariosStatus] = useState<UserStatus[]>([]);
  const [termoBusca, setTermoBusca] = useState(""); // Estado para o input de busca
  const [dialogoCriarAberto, setDialogoCriarAberto] = useState(false); // Estado do modal
  const [ano, setAno] = useState<number | string>(""); // Estado para o ano selecionado
  const [isLoading, setIsLoading] = useState(false); // Estado para controle de loading
  const [error, setError] = useState<string | null>(null); // Estado para erros

  // Pegando a função do hook
  const { listarStatusPreenchimentoFormulario } = useListarStatusPreenchimentoFormulario(
    usuarioAtual.is_coordenador,
    Number(ano)
  );

  // Gerar os últimos 5 anos
  const getUltimos5Anos = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // Função para buscar os dados ao clicar em "Pesquisar"
  const handlePesquisar = async () => {
    if (!ano) {
      alert("Selecione um ano para pesquisar");
      return;
    }

    setIsLoading(true);
    try {
      const data = await listarStatusPreenchimentoFormulario(usuarioAtual.is_coordenador, Number(ano));
      if (Array.isArray(data)) {
        setListaUsuariosStatus(data);
        setError(null); // Limpa qualquer erro anterior
      } else {
        setError("Dados inesperados");
      }
    } catch (err) {
      setError("Erro ao buscar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold">Status de Preenchimento dos Formulários</h1>

      <div className="flex space-x-2 mb-4">
        {/* Card para selecionar o ano e pesquisar */}
        <div className="relative mb-2 flex-1">
          <Select onValueChange={setAno}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {/* Gerando os últimos 5 anos dinamicamente */}
              {getUltimos5Anos().map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão para buscar */}
        <Button onClick={handlePesquisar}>
          <Search className="mr-2" />
          Pesquisar
        </Button>
      </div>

      {/* Exibição de loading */}
      {isLoading && <Loading />}

      {/* Exibição de erro */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Tabela com os dados */}
      <DataTable listaUsuariosStatus={listaUsuariosStatus} />
    </div>
  );
}
