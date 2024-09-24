import trie from "./utils/trie.js";
import {
  filtrarResultadosPesquisa,
  renderizarItensPesquisa,
} from "./utils/autocomplete.js";

const inputPrograma = document.getElementById("input-busca-programa");
const resultadosProgramas = document.getElementById("resultados-programas");
const buttonLimparBusca = document.getElementById("btn-limpar-programa");
const buttonProcurarPrograma = document.getElementById("btn-pesquisar-programa");

// Insere os nomes dos programas no trie
listaProg.forEach((programa) => {
  const nomePrograma = programa.nome.toLowerCase();
  trie.inserirPalavra(nomePrograma);
});

// Exibe a lista de programas
const exibirListaProgramas = (listaNomes) => {
  const containerProgramas = document.getElementById("row-programas");
  containerProgramas.innerHTML = "";

  listaNomes.forEach((programa) => {
    const divPrograma = document.createElement("div");
    divPrograma.className =
      "flex flex-col rounded-xl border border-t-8 border-zinc-200 border-t-indigo-400 bg-white/70 px-8 py-6 shadow-shape backdrop-blur-xl";

    const spanArea = document.createElement("span");
    spanArea.className = "text-sm font-bold text-amber-700";
    spanArea.textContent = programa.area;

    const h2Nome = document.createElement("h2");
    h2Nome.className = "text-lg font-bold text-indigo-500";
    h2Nome.textContent = programa.nome;

    const pNota = document.createElement("p");
    pNota.className = "pt-2 text-zinc-700";
    pNota.textContent = `Nota: ${programa.nota}`;

    const linkGraficos = document.createElement("a");
    linkGraficos.href = `/ppg/ppgs/${programa.id}`;
    linkGraficos.className =
      "mt-1 self-end inline-block rounded-lg border border-indigo-500 px-6 py-3 text-sm font-bold text-indigo-500 hover:bg-indigo-500 hover:text-zinc-50 text-center";
    linkGraficos.textContent = "Gráficos";

    const divConteudo = document.createElement("div");
    divConteudo.className = "flex-grow";
    divConteudo.appendChild(spanArea);
    divConteudo.appendChild(h2Nome);
    divConteudo.appendChild(pNota);

    divPrograma.appendChild(divConteudo);
    divPrograma.appendChild(linkGraficos);
    containerProgramas.appendChild(divPrograma);
  });
};


// Eventos
inputPrograma.addEventListener("input", () => {
  if (inputPrograma.value.length > 0) {
    buttonLimparBusca.style.display = "block";
    const nomes = filtrarResultadosPesquisa(inputPrograma, trie);
    renderizarItensPesquisa(nomes, resultadosProgramas, inputPrograma);
  } else {
    buttonLimparBusca.style.display = "none";
    resultadosProgramas.classList.add("hidden");
  }
});

inputPrograma.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const nomes = filtrarResultadosPesquisa(inputPrograma, trie); 
    const programasFiltrados = Object.values(listaProg).filter((programa) =>
      nomes.some((nome) => nome.toLowerCase() === programa.nome.toLowerCase()),
    );
    exibirListaProgramas(programasFiltrados);
    resultadosProgramas.classList.add("hidden");
  }
});

document.addEventListener("click", (e) => {
  if (e.target !== inputPrograma) {
    resultadosProgramas.classList.add("hidden");
  }
});

buttonLimparBusca.addEventListener("click", () => {
  inputPrograma.value = "";
  buttonLimparBusca.style.display = "none";
  resultadosProgramas.classList.add("hidden");
  exibirListaProgramas(listaProg);
});

buttonProcurarPrograma.addEventListener("click", () => {
const nomes = filtrarResultadosPesquisa(inputPrograma, trie); 
const programasFiltrados = Object.values(listaProg).filter((programa) =>
  nomes.some((nome) => nome.toLowerCase() === programa.nome.toLowerCase()),
);
exibirListaProgramas(programasFiltrados);
resultadosProgramas.classList.add("hidden");
})
