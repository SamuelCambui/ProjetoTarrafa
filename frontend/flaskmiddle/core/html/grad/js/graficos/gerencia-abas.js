document.addEventListener("DOMContentLoaded", () => {
  carregaOpcoesAnos();
  carregaGraficos("#indicadores");
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
  });

const carregaGraficos = async (idAlvo) => {
  const anoInicio = document.getElementById("ano-inicio").value;
  const anoFim = document.getElementById("ano-fim").value;

  switch (idAlvo) {
    case "#indicadores":
      const { carregaGraficos: carregaGraficosIndicadores } = await import(
        "./aba-indicadores.js"
      );
      carregaGraficosIndicadores(anoInicio, anoFim);
      break;
    case "#disciplinas":
      const { carregaGraficos: carregaGraficosDisciplinas } = await import(
        "./aba-disciplinas.js"
      );
      carregaGraficosDisciplinas(anoInicio, anoFim);
      break;
    case "#egressos":
      break;
    case "#professores":
      break;
  }
};

// Gerencia as abas gerais da página (Indicadores, Disciplinas, Egressos, Professores)
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
      carregaGraficos(idAlvo);
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
      carregaGraficos(idAlvo);
    }
  });
});

// Gerencia as abas da div que contem as médias de disciplinas por período
const abasMediasSeries = document.querySelectorAll(
  '[data-bs-toggle="tabMediasSerie"]',
);
const ulAbasMedias = document.querySelector(
  'ul[data-tabs-toggle="#conteudo-abas-medias-series"]',
);
const classesAtivasAbasMedias = ulAbasMedias
  .getAttribute("data-tabs-active-classes")
  .split(" ");
const classesInativasAbasMedias = ulAbasMedias
  .getAttribute("data-tabs-inactive-classes")
  .split(" ");

abasMediasSeries.forEach((aba, index) => {
  const idAlvo = aba.getAttribute("data-bs-target");
  const painelAlvo = document.querySelector(idAlvo);

  if (index === 0) {
    aba.classList.remove(...classesInativasAbasMedias);
    aba.classList.add(...classesAtivasAbasMedias);
    aba.setAttribute("aria-selected", "true");

    if (painelAlvo) {
      painelAlvo.classList.remove("hidden");
    }
  } else {
    aba.classList.remove(...classesAtivasAbasMedias);
    aba.classList.add(...classesInativasAbasMedias);
    aba.setAttribute("aria-selected", "false");

    if (painelAlvo) {
      painelAlvo.classList.add("hidden");
    }
  }

  aba.addEventListener("click", function () {
    abasMediasSeries.forEach((a) => {
      const idAlvo = a.getAttribute("data-bs-target");
      const painelAlvo = document.querySelector(idAlvo);

      a.classList.remove(...classesAtivasAbasMedias);
      a.classList.add(...classesInativasAbasMedias);
      a.setAttribute("aria-selected", "false");

      if (painelAlvo) {
        painelAlvo.classList.add("hidden");
      }
    });

    aba.classList.remove(...classesInativasAbasMedias);
    aba.classList.add(...classesAtivasAbasMedias);
    aba.setAttribute("aria-selected", "true");

    const idAlvo = aba.getAttribute("data-bs-target");
    const painelAlvo = document.querySelector(idAlvo);
    if (painelAlvo) {
      painelAlvo.classList.remove("hidden");
    }
  });
});

// Gerencia as abas da div que contem as médias de reprovacoes de disciplinas por período
const abasReprovacoesSeries = document.querySelectorAll(
  '[data-bs-toggle="tabReprovacoesSerie"]',
);
const ulAbasReprovacoes = document.querySelector(
  'ul[data-tabs-toggle="#conteudo-abas-reprovacoes-series"]',
);
const classesAtivasAbasReprovacoes = ulAbasReprovacoes
  .getAttribute("data-tabs-active-classes")
  .split(" ");
const classesInativasAbasReprovacoes = ulAbasReprovacoes
  .getAttribute("data-tabs-inactive-classes")
  .split(" ");

abasReprovacoesSeries.forEach((aba, index) => {
  const idAlvo = aba.getAttribute("data-bs-target");
  const painelAlvo = document.querySelector(idAlvo);

  if (index === 0) {
    aba.classList.remove(...classesInativasAbasReprovacoes);
    aba.classList.add(...classesAtivasAbasReprovacoes);
    aba.setAttribute("aria-selected", "true");

    if (painelAlvo) {
      painelAlvo.classList.remove("hidden");
    }
  } else {
    aba.classList.remove(...classesAtivasAbasReprovacoes);
    aba.classList.add(...classesInativasAbasReprovacoes);
    aba.setAttribute("aria-selected", "false");

    if (painelAlvo) {
      painelAlvo.classList.add("hidden");
    }
  }

  aba.addEventListener("click", function () {
    abasReprovacoesSeries.forEach((a) => {
      const idAlvo = a.getAttribute("data-bs-target");
      const painelAlvo = document.querySelector(idAlvo);

      a.classList.remove(...classesAtivasAbasReprovacoes);
      a.classList.add(...classesInativasAbasReprovacoes);
      a.setAttribute("aria-selected", "false");

      if (painelAlvo) {
        painelAlvo.classList.add("hidden");
      }
    });

    aba.classList.remove(...classesInativasAbasReprovacoes);
    aba.classList.add(...classesAtivasAbasReprovacoes);
    aba.setAttribute("aria-selected", "true");

    const idAlvo = aba.getAttribute("data-bs-target");
    const painelAlvo = document.querySelector(idAlvo);
    if (painelAlvo) {
      painelAlvo.classList.remove("hidden");
    }
  });
});

//?Coisas comuns a todas as abas
const boxInfoCurso = document.getElementById("info-Curso");
const btnInfoCurso = document.getElementById("btn-info-Curso");

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

btnInfoCurso.addEventListener("click", () => {
  const estaEscondido = boxInfoCurso.classList.toggle("hidden");
  btnInfoCurso.setAttribute("aria-expanded", !estaEscondido);
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

export const carregaOpcoesAnos = () => {
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
