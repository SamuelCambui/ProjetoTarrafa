"use client";

import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useListarFormularios } from "@/service/ppgls/formulario/queries";
import { usePathname } from "next/navigation";

interface Formulario {
  nome: string;
  data_preenchimento: string;
}

export const Forms = () => {
  const { data, isLoading } = useListarFormularios();

  const path = usePathname();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  const [selectedYear, setSelectedYear] = useState<string>(years[0].toString());
  const [formularios, setFormularios] = useState<
    { nome: string; data_preenchimento: string }[] | undefined
  >(data?.dados);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    setFormularios(data?.dados);
  }, [data]);

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const yearSearch = e.target.value;
    const filteredForms = data?.dados.filter((formulario: Formulario) => {
      const year = new Date(formulario.data_preenchimento).getFullYear();
      return year.toString().startsWith(yearSearch);
    });

    setFormularios(filteredForms);
    setSelectedYear(yearSearch);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForms = formularios?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = formularios ? Math.ceil(formularios.length / itemsPerPage) : 1;
  const showPagination = formularios && formularios.length > itemsPerPage;

  const nextPage = () => {
    if (formularios && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    .toLocaleDateString("pt-BR");
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="yearSelect" className="text-lg font-medium">
              Escolha um ano:
            </label>
            <select
              id="yearSelect"
              className="p-2 border rounded"
              onChange={handleYearChange}
              value={selectedYear}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-4">
            {currentForms?.map((formulario, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Nome do formulário: {formulario.nome}</CardTitle>
                  <CardDescription>
                    Data de preenchimento: {formatDate(formulario.data_preenchimento)}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button
                    size="lg"
                    onClick={() => {
                      router.push(`${path}/${formulario.nome}/${formulario.data_preenchimento}`);
                    }}
                  >
                    <span>Registros</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {showPagination && (
            <div className="flex justify-between mt-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="disabled:opacity-50"
              >
                Anterior
              </Button>
              <span className="text-lg font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="disabled:opacity-50"
              >
                Próximo
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
