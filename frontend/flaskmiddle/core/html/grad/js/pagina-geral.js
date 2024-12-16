import { renderChart, carregaOpcoesAnos } from "./scripts-grad.js";

const charts = {
  graficoSexoAlunos: undefined,
  graficoEgressos: undefined,
  graficoMapaAlunos: undefined,
};

document.addEventListener("DOMContentLoaded", () => {
  carregaOpcoesAnos();
  carregaGraficos();
});

async function carregaGraficos() {
  const request = await axios.get(`/grad/indicadores-gerais/${2014}/${2024}`);
  const dadosGraficos = request.data;
  debugger;
  carregaGraficoSexoAlunos(dadosGraficos["graficoSexoAlunos"]);
}

function carregaGraficoSexoAlunos(dados) {
  if (charts.graficoSexoAlunos) {
    charts.graficoSexoAlunos.destroy();
  }
  renderChart(
    "graficoSexoAlunos",
    {
      type: "doughnut",
      ...dados,
    },
    [],
    {
      plugins: {
        datalabels: {
          display: false,
        },
      },
    },
  );
}
