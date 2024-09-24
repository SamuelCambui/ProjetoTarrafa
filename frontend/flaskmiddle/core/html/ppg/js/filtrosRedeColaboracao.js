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