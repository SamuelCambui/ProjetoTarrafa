// import { filtrarPorConexoes } from "./scriptshome.js";
import trie from "./utils/trie.js";
import { grafoColaboracao as criaGrafoColab } from "./grafoColaboracao.js"
const grafoColaboracao = criaGrafoColab()

/////////////
// ! Filtros:
// !  - Busca
// !  - Aba Filtros
// !  - PPGs
/////////////
const btnFiltrosColab = document.getElementById(
  "btn-dropdown-filtros-colaboracao"
);

const containerFiltrosColab = document.getElementById("filtros-colaboracao");

btnFiltrosColab.addEventListener("click", (e) => {
  e.stopPropagation();
  if (containerFiltrosColab.classList.contains("hidden")) {
    containerFiltrosColab.classList.replace("hidden", "grid");
  } else {
    containerFiltrosColab.classList.replace("grid", "hidden");
  }
});

//* Busca
const procurarNo = (e) => {
  const svg = grafoColaboracao.getSvg();
  const dados = grafoColaboracao.getDictDados();
  const links = svg.selectAll("line");
  const node = svg.selectAll("circle");

  let pesquisadorProcurado = e.target.textContent.toLowerCase().trim();

  if (!pesquisadorProcurado) {
    node.style("stroke", "white").style("stroke-width", "1");
  }
  else {
    const selectNode = node.filter((d) => d.id.toLowerCase().trim() === pesquisadorProcurado);
    node.style('opacity', 0.1);
    links.style('opacity', 0);

    selectNode.style("opacity", "1");

    const text = svg.selectAll(".text");
    text.style("opacity", "0")

    console.log(selectNode)
    const nodeId = selectNode.data()[0].id;

    links.style('stroke', function (link_d) {
      return link_d.source.id === nodeId || link_d.target.id === nodeId ? '#d97706' : '#ffffff';
    }).style('stroke-width', function (link_d) {
      return link_d.source.id === nodeId || link_d.target.id === nodeId ? 2 : 0;
    });


    text.style("opacity", function (label_d) {
      return label_d.id === nodeId ? 1 : 0.0
    });

    const linksObj = dados.links.map(d => ({ ...d }));

    // Encontre os nós conectados a este nó
    const connectedNodes = new Set();
    connectedNodes.add(nodeId);
    linksObj.forEach(link_d => {
      if (link_d.source === nodeId) {
        connectedNodes.add(link_d.target);
      } else if (link_d.target === nodeId) {
        connectedNodes.add(link_d.source);
      }
    });

    connectedNodes.forEach(id => {
      let e = document.getElementById(id);
      d3.select(e).style('opacity', 1);
      let t = document.getElementById(`text_${id}`)
      d3.select(t).style('opacity', 1);
    });

    links.style('opacity', 1);
  }
}


const inputBusca = document.getElementById("input-busca-docente");
const resultadosBusca = document.getElementById("resultados-busca");

const mostrarResultados = (nomes) => {
  resultadosBusca.innerHTML = "";

  nomes.forEach((nome) => {
    const itemResultado = document.createElement("div");
    itemResultado.classList.add(
      "cursor-pointer",
      "hover:bg-gray-300",
      "text-zinc-700",
      "px-8",
      "py-2"
    );
    itemResultado.textContent = nome;

    itemResultado.addEventListener("click", (e) => {
      inputBusca.value = nome;
      resultadosBusca.style.display = "none";
      procurarNo(e);
    });

    resultadosBusca.appendChild(itemResultado);
  });

  resultadosBusca.style.display = nomes.length ? "block" : "none";
};

const buscarNome = () => {
  const nome = inputBusca.value.trim().toLowerCase();

  if (nome.length > 0) {
    buttonLimparBusca.style.display = "block";
    const nomesFiltrados = trie.autocomplete(nome);
    mostrarResultados(nomesFiltrados);
    return;
  }
  resultadosBusca.style.display = "none";
  buttonLimparBusca.style.display = "none";
};

inputBusca.addEventListener("input", buscarNome);

document.addEventListener("click", (e) => {
  if (!inputBusca.contains(e.target) && !resultadosBusca.contains(e.target)) {
    resultadosBusca.style.display = "none";
  }
  if (
    !btnFiltrosColab.contains(e.target) &&
    !containerFiltrosColab.contains(e.target)
  ) {
    containerFiltrosColab.classList.add("hidden");
    containerFiltrosColab.classList.remove("grid");
  }
});

const buttonLimparBusca = document.getElementById("btn-limpar");
buttonLimparBusca.addEventListener("click", () => {
  inputBusca.value = "";
  buttonLimparBusca.style.display = "none";
});

//Filtros adicionais
//TODO: logica de criação do slider 
// ? se mudar de produto/data/fonte entao constroi um novo slider/faz uma nova requisição (constroi um novo grafo)
// ? caso contrário apenas faz um update do grafo

// * Slider
const mapeiaPorConexoes = () => {
  const numDeConexoes = {};

  dados.nodes.forEach((node) => (numDeConexoes[node.id] = 0));

  dados.links.forEach(function (link) {
    if (link.source !== link.target) {
      numDeConexoes[link.source] = (numDeConexoes[link.source] || 0) + 1;
      numDeConexoes[link.target] = (numDeConexoes[link.target] || 0) + 1;
    }
  });

  return numDeConexoes;
};

const criarSliderConexoes = (numDeConexoes) => {
  let valores = Object.values(numDeConexoes);
  let menorValor = Math.min(...valores);
  let maiorValor = Math.max(...valores);

  let sliderParams = {
    id: "valorSlider",
    min: menorValor,
    max: maiorValor,
    value: menorValor,
  };

  let slider = document.createElement("input");
  slider.type = "range";
  slider.id = sliderParams.id;
  slider.min = sliderParams.min;
  slider.max = sliderParams.max;
  slider.value = sliderParams.value;
  slider.classList.add("slider");
  filtroPorConexoes.classList.add("ativo");

  let valorAtual = document.createElement("p");
  valorAtual.id = "valorAtual";

  filtroPorConexoes.appendChild(slider);
  filtroPorConexoes.appendChild(valorAtual);

  slider.addEventListener("input", () => {
    valorAtual.textContent = `Conexões: ${slider.value}`;
    return parseInt(slider.value);
  });
};

//* Aba filtros
document
  .getElementById("btn-aplicar-filtros")
  .addEventListener("click", async () => {
    const produto = document.getElementById("select-type-product").value;
    const fonte = document.querySelector(
      'input[name="fonteRadioOptions"]:checked'
    ).value;
    const tipo = document.querySelector(
      'input[name="tipoRadioOptions"]:checked'
    ).value;
    const anoInicial = document.getElementById("ano-inicio").value;
    const anoFinal = document.getElementById("ano-fim").value;

    //num de conexoes 
    //TODO: validação nos anos

    //Nova requisição
    grafoColaboracao.constroiGrafo(fonte, tipo, anoInicial, anoFinal, produto);
    containerFiltrosColab.classList.replace("grid", "hidden");
  });


// * Carregar página
const ready = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  const anoInicial = 2017;
  const anoFinal = 2023;

  grafoColaboracao.constroiGrafo("sucupira", "docentes", anoInicial, anoFinal);
});