import {
  CHART_COLORS,
  renderChart,
  carregaGraficoMapaBrasil,
} from "./scripts-grad.js";

const charts = {
  graficoSexoAlunos: undefined,
  graficoEgressos: undefined,
  graficoMapaAlunos: undefined,
};

document.addEventListener("DOMContentLoaded", () => {
  carregaOpcoesAnos();
  inicializaGraficos();
});

document
  .getElementById("btn-filtrar-periodo")
  .addEventListener("click", async () => {
    let anoInicio = document.getElementById("ano-inicio").value;
    let anoFim = document.getElementById("ano-fim").value;
    anoInicio = Number(anoInicio);
    anoFim = Number(anoFim);

    if (anoInicio > anoFim) {
      anoInicio = anoFim;
    }

    document.getElementById("ano-inicio").value = anoInicio;
    await carregaGraficos(anoInicio, anoFim);
  });

const inicializaGraficos = async () => {
  const anoInicio = document.getElementById("ano-inicio").value;
  const anoFim = document.getElementById("ano-fim").value;

  await carregaGraficos(anoInicio, anoFim);
};

const carregaGraficos = async (anoInicial, anoFinal) => {
  const request = await axios.get(
    `/grad/indicadores-gerais/${anoInicial}/${anoFinal}`,
  );
  const dadosGraficos = request.data;
  carregaGraficoSexoAlunos(dadosGraficos["graficoSexoAlunos"]);
  carregaGraficoEgressos(dadosGraficos["graficoEgressos"]);
  carregaGraficoMapaBrasil(dadosGraficos["municipios"]);
};

const carregaGraficoSexoAlunos = (dados) => {
  if (charts.graficoSexoAlunos) {
    charts.graficoSexoAlunos.destroy();
  }
  charts.graficoSexoAlunos = renderChart(
    "graficoSexoAlunos",
    {
      type: "doughnut",
      ...dados,
    },
    [{ backgroundColor: [CHART_COLORS.pink, CHART_COLORS.blue] }],
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

const carregaGraficoEgressos = (dados) => {
  if (charts.graficoEgressos) {
    charts.graficoEgressos.destroy();
  }
  charts.graficoEgressos = renderChart(
    "graficoEgressos",
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

const carregaOpcoesAnos = () => {
  const elementSelectAnoInicial = document.getElementById("ano-inicio");
  const elementSelectAnoFinal = document.getElementById("ano-fim");
  const anoAtual = new Date().getFullYear();
  for (let ano = anoAtual - 10; ano <= anoAtual; ano++) {
    let optionInicial = document.createElement("option");
    if (ano == anoAtual - 10) {
      optionInicial.selected = true;
    }
    optionInicial.innerHTML = ano.toString();
    optionInicial.value = ano.toString();
    elementSelectAnoInicial.appendChild(optionInicial);

    let optionFinal = document.createElement("option");
    optionFinal.innerHTML = ano.toString();
    if (ano == anoAtual) {
      optionFinal.selected = true;
    }
    optionFinal.value = ano.toString();
    elementSelectAnoFinal.appendChild(optionFinal);
  }
};
