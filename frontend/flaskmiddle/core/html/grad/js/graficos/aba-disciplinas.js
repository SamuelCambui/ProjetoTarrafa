import { renderChart, CHART_COLORS } from "../scripts-grad.js";

const charts = {};

export const carregaGraficos = async (anoInicial, anoFinal) => {
  const idCurso = document.getElementById("id-curso").value;
  const request = await axios.get(
    `/grad/aba-disciplinas/${idCurso}/${anoInicial}/${anoFinal}`,
  );
  debugger;
  const dadosGraficos = request.data;
  try {
    carregaSelectDisciplinas(dadosGraficos["disciplinas"]);
  } catch (error) {
    console.error('Erro ao carregar disciplinas')
  }
  for (const graficoNome in dadosGraficos) {
    if (graficoNome.toLowerCase().includes("media")) {
      try {
        carregaGraficoMediasSerie(dadosGraficos[graficoNome], graficoNome);
      } catch (error) {
        document.getElementById(graficoNome).innerHTML =
          "Erro ao Carregar Gráfico";
      }
    } else if (graficoNome.toLowerCase().includes("reprovacao")) {
      try {
        carregaGraficoReprovacaoSerie(dadosGraficos[graficoNome], graficoNome);
      } catch (error) {
        const errorElement = document.createElement("div");
        errorElement.classList.add(["text-red-500"]);
        document.getElementById(graficoNome).append(errorElement);
      }
    }
  }
};

const carregaSelectDisciplinas = (dados) => {
  const select = document.getElementById("disciplina-select");
  for (let i = 0; i < dados.length; i++) {
    const option = document.createElement("option");
    option.value = dados[i]["cod_disc"];
    option.innerHTML = dados[i]["disciplina"];
    select.appendChild(option);
  }
};

const carregaGraficoMediasSerie = (dados, nome) => {
  if (charts[nome]) {
    charts[nome].destroy();
  }
  charts[nome] = renderChart(
    nome,
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
          max: 100,
        },
        x: {
          ticks: {
            maxRotation: 50,   // Define a rotação máxima dos labels
            minRotation: 50
          }
        },
      },
      plugins: {
        datalabels: {
          display: false,
        },
      },
    },
    {},
  );
};

const carregaGraficoReprovacaoSerie = (dados, nome) => {
  if (charts[nome]) {
    charts[nome].destroy();
  }
  charts[nome] = renderChart(
    nome,
    {
      type: "bar",
      ...dados,
    },
    [{ backgroundColor: CHART_COLORS.red }],
    {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,        // Exibir o título
            text: 'Quantidade de Alunos',   // Texto do título do eixo Y
            font: {
              size: 16,           // Tamanho da fonte do label
              weight: 'bold'      // Negrito para o título
            }
          }
        },
        x: {
          ticks: {
            maxRotation: 50,   // Define a rotação máxima dos labels
            minRotation: 50
          }
        }
      },
      plugins: {
        datalabels: {
          display: false,
        },
      },
    },
    {},
  );
};
