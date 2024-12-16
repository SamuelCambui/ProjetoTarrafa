import trie from "./utils/trie.js";
import { ordenaTabela } from "./utils/ordenaTabela.js";
// import { filtrarResultadosPesquisa, renderizarItensPesquisa } from "./utils/autocomplete.js";
// TODO: Limpar pesquisa toda vez que entra na página; Ajustar a busca específica

const btnPesquisarDocente = document.getElementById("btn-pesquisar-docente");
const selecionarIes = document.getElementById("select-docentes-ies");

console.log(selecionarIes)

const criarOpcaoSIES = (ies) => {
  ies.forEach((iesItem) => {
    const opcao = document.createElement('option');
    opcao.text = iesItem;
    opcao.value = iesItem;
    selecionarIes.appendChild(opcao);
  });
}

(() => {
  let ies = new Set()

  Object.values(listaRanking).forEach(dado => {
    trie.inserirPalavra(dado.nome.toLowerCase());
    ies.add(dado.ies.toLowerCase())
  });

  criarOpcaoSIES(ies)
})()

const filtrarDocentes = (ies, nomes) => {
  // Check if ies is "Todas as universidades..." and nomes is defined
  if (ies === "Todas as universidades..." && nomes && nomes.length > 0) {
    return Object.values(listaRanking).filter(docente =>
      nomes.includes(docente['nome'].toLowerCase())
    );
  }

  // Check if ies is not "Todas as universidades..." and nomes is not defined
  if (ies !== "Todas as universidades..." && !nomes) {
    return Object.values(listaRanking).filter(docente =>
      docente['ies'].toLowerCase() === ies.toLowerCase() // Added .toLowerCase() for consistent case comparison
    );
  }

  // Check if ies is not "Todas as universidades..." and nomes is defined
  if (ies !== "Todas as universidades..." && nomes && nomes.length > 0) {
    return Object.values(listaRanking).filter(docente =>
      nomes.includes(docente['nome'].toLowerCase()) &&
      docente['ies'].toLowerCase() === ies.toLowerCase() // Added .toLowerCase() for consistent case comparison
    );
  }

  // Default case: return all docentes
  return Object.values(listaRanking);
}

const exibirTabelaResultadosAtualizados = (dados) => {
  const table = document.getElementById("tabela-docentes");
  table.innerHTML = "";

  let html = `
  <table id="tabela-docentes" class="w-full table-auto">
  <thead>
    <tr class="border-y-2 border-y-gray-300">
      <th class="font-semibold text-left py-3.5 px-3 cursor-pointer" scope="col" data-sort="id">
        #
        <button class="px-1"><span> &#9650; </span></button>
      </th>
      <th class="font-semibold text-left py-3.5 px-3 cursor-pointer" scope="col" data-sort="docente">
        Docente
        <button class="px-1"><span> </span></button>
      </th>
      <th class="font-semibold text-left py-3.5 px-3 cursor-pointer" scope="col" data-sort="artigos">
        Art. Periódicos
        <button class="px-1"><span> </span></button>
      </th>
      <th class="font-semibold text-left py-3.5 px-3" scope="col" data-sort="eventos">
        Art. Eventos
        <button class="px-1"><span> </span></button>
      </th>
      <th class="font-semibold text-left py-3.5 px-3" scope="col" data-sort="livros">
        Livros
        <button class="px-1"><span> </span></button>
      </th>
      <th class="font-semibold text-left py-3.5 px-3" scope="col" data-sort="capitulos">
        Cap. Livros
        <button class="px-1"><span> </span></button>
      </th>
    </tr>
  </thead>
        <tbody id="tbody-lista-profs">`;

  dados.forEach((prof, index) => {
    html += `
      <tr class="border-b border-b-gray-300" onclick="">
        <td class="py-3.5 px-3">
          ${index + 1}
        </td>
        <td class="py-3.5 px-3">
        <div class="flex items-center gap-4">
          <div>
            <img class="w-11 h-11 rounded-full"
              id="avatar-usuario"
              src="${prof.avatar}"
              decoding="async"
              loading="lazy" />
          </div>
                    <div >
          <span class="capitalize font-medium"> ${prof.nome.toLowerCase()}</span>
          <br>Tipo de vínculo com ${prof.sigla_ies_vinculo}:
            ${prof.vinculo_ies}
          <br>Nome da IES de Origem:
          <span class="capitalize font-medium"> ${prof.ies.toLowerCase()}</span>
                    </div>

          </div>
        </td>
        <td class="text-zinc-700 py-3.5 px-3">
          ${prof.produtos['ARTIGO-PUBLICADO'] || 0}
        </td>
        <td class="text-zinc-700 py-3.5 px-3">
          ${prof.produtos['TRABALHO-EM-EVENTOS'] || 0}
        </td>
        <td class="text-zinc-700 py-3.5 px-3">
          ${prof.produtos['LIVROS-PUBLICADOS-OU-ORGANIZADOS'] || 0}
        </td>
        <td class="text-zinc-700 py-3.5 px-3">
          ${prof.produtos['CAPITULOS-DE-LIVROS-PUBLICADOS'] || 0}
        </td>
      </tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>
  </div>`;

  table.innerHTML = html;
  ordenaTabela();

};

// * Busca
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

    itemResultado.addEventListener("click", () => {
      inputBusca.value = nome
      resultadosBusca.style.display = "none";
    });

    resultadosBusca.appendChild(itemResultado);
  });

  resultadosBusca.style.display = nomes.length ? "block" : "none";

};

let nomesFiltrados = [];
const buscarNome = () => {
  const nome = inputBusca.value.trim().toLowerCase();

  if (nome.length > 0) {
    buttonLimparBusca.style.display = "block";
    nomesFiltrados = trie.autocomplete(nome);
    mostrarResultados(nomesFiltrados);
    return;
  }
  resultadosBusca.style.display = "none";
  buttonLimparBusca.style.display = "none";
};

inputBusca.addEventListener("input", buscarNome);

//* Btn limpar busca
const buttonLimparBusca = document.getElementById("btn-limpar");
buttonLimparBusca.addEventListener("click", () => {
  inputBusca.value = "";
  buttonLimparBusca.style.display = "none";
  resultadosBusca.style.display = "none";
  nomesFiltrados = [];
});

//* Btn busca docente
btnPesquisarDocente.addEventListener("click", () => {
  const dadosFiltrados = filtrarDocentes(selecionarIes.value, nomesFiltrados);
  exibirTabelaResultadosAtualizados(dadosFiltrados);
  resultadosBusca.style.display = "none";
});

ordenaTabela();
