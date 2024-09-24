let anoInicio = 2017;
let anoFim = 2023;

const inicializaGraficos = async (idAlvo) => {
  switch (idAlvo) {
    case "#indicadores":
      const { graficosIndicadores } = await import("./indicadores.js");
      graficosIndicadores(anoInicio, anoFim);
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
    case "#egressos":
      const { graficosEgressos } = await import("./egressos.js");
      await graficosEgressos().gerarGraficos(anoInicio, anoFim);
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
  anoInicio = Number(document.getElementById("ano-inicio").value);
  anoFim = Number(document.getElementById("ano-fim").value);

  if (anoInicio > anoFim) {
    alert("O ano de inicio deve ser menor que o ano final"); 
    return;
  }

  document.getElementById("ano-inicio").value = anoInicio;
  document.getElementById("ano-fim").value = anoFim;

  const abaAtiva = document.querySelector('[aria-selected="true"]');
  if (abaAtiva) {
    const idAlvo = abaAtiva.getAttribute("data-bs-target");
    inicializaGraficos(idAlvo);
  }
});

document.querySelectorAll(".drop-btn").forEach((botao) => {
  botao.addEventListener("click", (e) => {
    e.stopPropagation();

    const targetId = e.currentTarget.getAttribute("data-target");
    const dropdown = document.getElementById(targetId);

    document.querySelectorAll(".dropdown").forEach((d) => {
      if (d !== dropdown) {
        d.classList.add("hidden");
      }
    });

    dropdown.classList.toggle("hidden");
  });
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".drop-btn") && !e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.add("hidden");
    });
  }
});


