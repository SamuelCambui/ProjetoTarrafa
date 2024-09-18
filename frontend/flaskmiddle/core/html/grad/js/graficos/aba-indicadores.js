import {
  CHART_COLORS,
  renderChart,
  carregaGraficoMapaBrasil,
} from "../scripts-grad.js";

const charts = {
  graficoAlunosSexo: undefined,
  graficoNecessidadeEspecial: undefined,
  graficoNotaMedia: undefined,
  graficoFormaIngresso: undefined,
};

export const carregaGraficos = async (anoInicial, anoFinal) => {
  const idCurso = document.getElementById("id-curso").value;
  const request = await axios.get(
    `/grad/aba-indicadores/${idCurso}/${anoInicial}/${anoFinal}`,
  );
  const dadosGraficos = request.data;
  carregaGraficoSexoAlunos(dadosGraficos["graficoAlunosSexo"]);
  carregaGraficoNecessidadeEspecial(
    dadosGraficos["graficoNecessidadeEspecial"],
  );
  carregaGraficoFormaIngresso(dadosGraficos["graficoFormaIngresso"]);
  carregaGraficoNotaMedia(dadosGraficos["graficoNotaMedia"]);
  carregaGraficoMapaBrasil(dadosGraficos["municipios"]);
};

const carregaGraficoSexoAlunos = (dados) => {
  if (charts.graficoAlunosSexo) {
    charts.graficoAlunosSexo.destroy();
  }
  charts.graficoAlunosSexo = renderChart(
    "graficoAlunosSexo",
    {
      type: "bar",
      ...dados,
    },
    [
      { backgroundColor: CHART_COLORS.blue },
      { backgroundColor: CHART_COLORS.pink },
    ],
    {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,        // Exibir o título
            text: 'Alunos',   // Texto do título do eixo Y
            font: {
              size: 14,           // Tamanho da fonte do label
              weight: 'bold'      // Negrito para o título
            }
          }
        },
        x: {
          stacked: true,
        },
      },

      plugins: {
        datalabels: {
          display: false,
        },
      },
    },
  );
};

const carregaGraficoNecessidadeEspecial = (dados) => {
  if (charts.graficoNecessidadeEspecial) {
    charts.graficoNecessidadeEspecial.destroy();
  }
  charts.graficoNecessidadeEspecial = renderChart(
    "graficoNecessidadeEspecial",
    {
      type: "doughnut",
      ...dados,
    },
    [],
    {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          display: false,
        },
      },
    },
  );
};

const carregaGraficoFormaIngresso = (dados) => {
  if (charts.graficoFormaIngresso) {
    charts.graficoFormaIngresso.destroy();
  }
  charts.graficoFormaIngresso = renderChart(
    "graficoFormaIngresso",
    {
      type: "doughnut",
      ...dados,
    },
    [],
    {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          limits: {
            x: { min: "original", max: "original" }, // Limita o zoom para o eixo X
            y: { min: "original", max: "original" }, // Limita o zoom para o eixo Y
          },
          pan: {
            enabled: true, // Ativa o "pan" (arrastar)
            mode: "xy", // Permite pan tanto em X quanto em Y
            threshold: 10, // Definir um limite de pan
          },
          zoom: {
            wheel: {
              enabled: true, // Permite zoom com a roda do mouse
            },
            pinch: {
              enabled: true, // Permite zoom por gesto de pinça (em dispositivos móveis)
            },
            mode: "xy", // Define zoom para ambos os eixos
          },
        },
        legend: {
          display: true,
          position: "left",
        },
        datalabels: {
          display: false,
        },
      },
    },
  );
};

const carregaGraficoNotaMedia = (dados) => {
  if (charts.graficoNotaMedia) {
    charts.graficoNotaMedia.destroy();
  }
  charts.graficoNotaMedia = renderChart(
    "graficoNotaMedia",
    {
      type: "bar",
      ...dados,
    },
    [{ backgroundColor: CHART_COLORS.blue }],
    {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          max: 100,
          beginAtZero: true,
        },
      },
      plugins: {
        datalabels: {
          display: false,
        },
      },
    },
  );
};
