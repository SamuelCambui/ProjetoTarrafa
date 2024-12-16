import { CurriculosDesatualizados } from "./(graficos)/qtd-curriculos-desatualizados-docentes";
import { DocentesCategoria } from "./(graficos)/qtd-docentes-categoria";

export default function TabDocentes()  {
  return (
    <h1>
      Docentes
      <div>
        < DocentesCategoria />
        < CurriculosDesatualizados />
        {/* TabelaProfessores  e produtos*/}
        {/* Grafo */}
        {/* MapadeCoautorias */}
        {/* Rede de Colaboração Mini */}
      </div>
    </h1>
  )
}