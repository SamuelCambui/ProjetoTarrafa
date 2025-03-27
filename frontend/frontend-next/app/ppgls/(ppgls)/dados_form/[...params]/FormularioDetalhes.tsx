"use client";
import { usePathname } from "next/navigation";
import { useGetIndicadoresFormulario } from "@/service/ppgls/formulario/queries";
import { GetIndicadoresFormularioParams } from "@/service/ppgls/types";

const FormularioDetalhes = () => {
  const pathname = usePathname();
  const match = pathname.match(/^\/ppgls\/([^/]+)\/([^/]+)\/(.+)$/);

  const nome_formulario = match ? decodeURIComponent(match[2]) : "Desconhecido";
  const dataPreench = match ? decodeURIComponent(match[3]) : "Desconhecida";

  const formParams: GetIndicadoresFormularioParams = {
    nome_formulario: nome_formulario,
    data_preenchimento: dataPreench,
  };

  const { data, isLoading } = useGetIndicadoresFormulario(formParams);

  const formatDateUTC = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0'); // Pega o dia e garante que tenha dois dígitos
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Pega o mês e garante que tenha dois dígitos (lembre-se que o mês é zero-indexado)
    const year = date.getUTCFullYear(); // Pega o ano
  
    return `${day}/${month}/${year}`; // Retorna no formato DD/MM/YYYY
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!data) {
    return <p>Erro ao carregar os dados.</p>;
  }

  return (
    <div className="p-6">
      {/* Tabela Curso */}
      <h2 className="text-xl font-bold mb-2">Curso</h2>
      <table className="border-collapse border border-gray-500 w-full mb-6">
        <thead>
            <tr className="bg-gray-200">
                <th className="border border-gray-500 p-2 text-center align-middle">Nome</th>
                <th className="border border-gray-500 p-2 text-center align-middle">Início</th>
                <th className="border border-gray-500 p-2 text-center align-middle">Término</th>
                <th className="border border-gray-500 p-2 text-center align-middle">Vagas Ofertadas</th>
                <th className="border border-gray-500 p-2 text-center align-middle">Vagas Preenchidas</th>
                <th className="border border-gray-500 p-2 text-center align-middle">Categoria Profissional</th>
                <th className="border border-gray-500 p-2 text-center align-middle">Centro</th>
            </tr>
        </thead>
        <tbody>
            <tr className="border border-gray-500">
                <td className="border border-gray-500 p-2 text-center align-middle">{data.nome_formulario}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{formatDateUTC(data.data_inicio)}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{formatDateUTC(data.data_termino)}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{data.vagas_ofertadas}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{data.vagas_preenchidas}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{data.categoria_profissional.toLowerCase()}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{data.centro}</td>
            </tr>
        </tbody>
      </table>
    <h2 className="text-xl font-bold mb-2">Número atual de Residentes</h2>
    <table className="border-collapse border border-gray-500 w-full mb-6">
        <thead>
            <tr className="bg-gray-200">
                <th className="border border-gray-500 p-2 text-center align-middle">R1</th>
                <th className="border border-gray-500 p-2 text-center align-middle">R2</th>
                <th className="border border-gray-500 p-2 text-center align-middle">R3</th>
            </tr>
        </thead>
        <tbody>
            <tr className="border border-gray-500">
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{data.r1}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{data.r2}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{data.r3}</td>
            </tr>
        </tbody>
    </table>
    {/* Tabela Coordenador */}
    <h2 className="text-xl font-bold mb-2">Coordenador</h2>
      <table className="border-collapse border border-gray-500 w-full mb-6">
        <thead>
            <tr className="bg-gray-200">
                <th className="border border-gray-500 p-2 text-center align-middle">Nome</th>
                <th className="border border-gray-500 p-2 text-center align-middle">Carga Horária</th>
            </tr>
        </thead>
        <tbody>
            <tr className="border border-gray-500">
                <td className="border border-gray-500 p-2 text-center align-middle">{data.coordenador.nome_coordenador}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{data.coordenador.carga_horaria_coordenador}</td>
            </tr>
        </tbody>
      </table>
    {/* Tabela Professores */}
    <h2 className="text-xl font-bold mb-2">Professores</h2>
    <table className="border-collapse border border-gray-500 w-full mb-6">
        <thead>
            <tr className="bg-gray-200">
            <th className="border border-gray-500 p-2 text-center align-middle">Nome</th>
            <th className="border border-gray-500 p-2 text-center align-middle">Vínculo</th>
            <th className="border border-gray-500 p-2 text-center align-middle">Titulação</th>
            <th className="border border-gray-500 p-2 text-center align-middle">Carga Horária Jornada Extendida</th>
            <th className="border border-gray-500 p-2 text-center align-middle">Carga Horária Projeto de Extensão</th>
            <th className="border border-gray-500 p-2 text-center align-middle">Carga Horária Projeto de Pesquisa</th>
            <th className="border border-gray-500 p-2 text-center align-middle">Carga Total</th>
            </tr>
        </thead>
        <tbody>
            {data.professores.map((professor: any, index: number) => (
            <tr key={index} className="border border-gray-500">
                <td className="border border-gray-500 p-2 text-center align-middle">{professor.nome_professor}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{professor.vinculo.toLowerCase()}</td>
                <td className="border border-gray-500 p-2 text-center align-middle capitalize">{professor.titulacao.toLowerCase()}</td>
                <td className="border border-gray-500 p-2 text-center align-middle">{professor.carga_horaria_jornada_extendida}</td>
                <td className="border border-gray-500 p-2 text-center align-middle">{professor.carga_horaria_projeto_extencao}</td>
                <td className="border border-gray-500 p-2 text-center align-middle">{professor.carga_horaria_projeto_pesquisa}</td>
                <td className="border border-gray-500 p-2 text-center align-middle">{professor.carga_horaria_total}</td>
            </tr>
            ))}
        </tbody>
    </table>



      
    </div>
  );
};

export default FormularioDetalhes;
