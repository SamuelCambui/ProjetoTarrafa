const inicializaGraficos = async (idAlvo) => {
  const anoInicio = 2017;
  const anoFim = 2023;

  switch (idAlvo) {
    case "#indicadores":
      const { graficosIndicadores } = await import("./indicadores.js");
      graficosIndicadores();
      break;
    case "#docentes":
      const { graficosDocentes } = await import("./docentes.js");
      await graficosDocentes().gerarGraficos(anoInicio, anoFim);
      break;
    case "#projetos":
      const { graficosProjetos } = await import("./projetos.js");
      await graficosProjetos().gerarGraficos(anoInicio, anoFim);
      break;
    case "#bancas-e-tccs":
      const { graficosBancasTCCs } = await import("./bancasTccs.js");
      await graficosBancasTCCs().gerarGraficos(anoInicio, anoFim);
      break;
    case "#engressos":
      const { graficosEgressos } = await import("./engressos.js");
      // graficosEgressos();
      break;
  }
};

const abas = document.querySelectorAll('[data-bs-toggle="tab"]');
const ul = document.querySelector('ul[data-tabs-toggle="#conteudo-abas"]');
const classesAtivas = ul.getAttribute("data-tabs-active-classes").split(" ");
const classesInativas = ul
  .getAttribute("data-tabs-inactive-classes")
  .split(" ");

abas.forEach((aba, index) => {
  const idAlvo = aba.getAttribute("data-bs-target");
  const painelAlvo = document.querySelector(idAlvo);

  if (index === 0) {
    aba.classList.remove(...classesInativas);
    aba.classList.add(...classesAtivas);
    aba.setAttribute("aria-selected", "true");

    if (painelAlvo) {
      painelAlvo.classList.remove("hidden");
      inicializaGraficos(idAlvo);
    }
  } else {
    aba.classList.remove(...classesAtivas);
    aba.classList.add(...classesInativas);
    aba.setAttribute("aria-selected", "false");

    if (painelAlvo) {
      painelAlvo.classList.add("hidden");
    }
  }

  aba.addEventListener("click", function () {
    abas.forEach((a) => {
      const idAlvo = a.getAttribute("data-bs-target");
      const painelAlvo = document.querySelector(idAlvo);

      a.classList.remove(...classesAtivas);
      a.classList.add(...classesInativas);
      a.setAttribute("aria-selected", "false");

      if (painelAlvo) {
        painelAlvo.classList.add("hidden");
      }
    });

    aba.classList.remove(...classesInativas);
    aba.classList.add(...classesAtivas);
    aba.setAttribute("aria-selected", "true");

    const idAlvo = aba.getAttribute("data-bs-target");
    const painelAlvo = document.querySelector(idAlvo);
    if (painelAlvo) {
      painelAlvo.classList.remove("hidden");
      inicializaGraficos(idAlvo);
    }
  });
});

//?Coisas comuns a todas as abas
const boxInfoPPG = document.getElementById("info-PPG");
const btnInfoPPG = document.getElementById("btn-info-PPG");

const btnDropFiltrar = document.getElementById("btn-drop-filtrar");
const containerFiltroPeriodo = document.getElementById(
  "container-filtro-periodo",
);

document.addEventListener("click", (e) => {
  if (
    !btnDropFiltrar.contains(e.target) &&
    !containerFiltroPeriodo.contains(e.target)
  ) {
    const estaEscondido = containerFiltroPeriodo.classList.add("hidden");
    btnDropFiltrar.setAttribute("aria-expanded", !estaEscondido);
  }
});

btnInfoPPG.addEventListener("click", () => {
  const estaEscondido = boxInfoPPG.classList.toggle("hidden");
  btnInfoPPG.setAttribute("aria-expanded", !estaEscondido);
});

btnDropFiltrar.addEventListener("click", () => {
  const estaEscondido = containerFiltroPeriodo.classList.toggle("hidden");
  btnDropFiltrar.setAttribute("aria-expanded", !estaEscondido);
});

document.getElementById("btn-filtrar-periodo").addEventListener("click", () => {
  let anoInicio = document.getElementById("ano-inicio").value;
  let anoFim = document.getElementById("ano-fim").value;

  anoInicio = Number(anoInicio);
  anoFim = Number(anoFim);

  if (anoInicio > anoFim) {
    anoInicio = anoFim;
  }

  document.getElementById("ano-inicio").value = anoInicio;
});
