import trie from "./utils/trie.js";
import { ordenaTabela } from "./utils/ordenaTabela.js";
import { filtrarResultadosPesquisa, renderizarItensPesquisa } from "./utils/autocomplete.js";

const inputDocente = document.querySelector("#input-busca-docente");
const resultadosDocentes = document.querySelector("#resultados-busca");
const btnPesquisarDocente = document.querySelector("#btn-pesquisar-docente");
const selecionarIes = document.querySelector("#select-docentes-ies");
const buttonLimparBusca = document.querySelector("#btn-limpar");

// Cria opções para o select de IES
const criarOpcaoSIES = (ies) => {
  ies.forEach((iesItem) => {
    const opcao = document.createElement("option");
    opcao.text = iesItem;
    opcao.value = iesItem;
    selecionarIes.appendChild(opcao);
  });
};

// Inicializa a lista de IES e insere nomes no trie
(() => {
  let ies = new Set();
  Object.values(listaRanking).forEach((dado) => {
    trie.inserirPalavra(dado.nome.toLowerCase());
    ies.add(dado.ies.toLowerCase());
  });

  criarOpcaoSIES(ies);
})();

// Filtra docentes com base na seleção de IES e nomes buscados
const filtrarDocentes = (ies, nomes) => {
  if (ies === "Todas as universidades..." && nomes) {
    return Object.values(listaRanking).filter((docente) =>
      nomes.includes(docente.nome.toLowerCase())
    );
  }

  if (ies !== "Todas as universidades..." && !nomes) {
    return Object.values(listaRanking).filter(
      (docente) => docente.ies.toLowerCase() === ies
    );
  }

  if (ies !== "Todas as universidades..." && nomes) {
    return Object.values(listaRanking).filter(
      (docente) =>
        nomes.includes(docente.nome.toLowerCase()) &&
        docente.ies.toLowerCase() === ies
    );
  }

  return Object.values(listaRanking);
};

// Exibe a tabela atualizada com os resultados filtrados
const exibirTabelaResultadosAtualizados = (dados) => {
  const table = document.getElementById("tabela-docentes");
  table.innerHTML = "";

  let html = `
      <table class="table-auto w-full text-black table-hover text-sm">
      <thead>
        <tr class="border-y-2 border-y-gray-300">
          <th class="cursor-pointer px-3 py-3.5 text-left font-semibold desc" data-sort="index">
            #
            <button class="px-1"><span> &#x25b4; </span></button> 
          </th>
          <th class="cursor-pointer px-3 py-3.5 text-left font-semibold" data-sort="nome">
            Docente
            <button class="px-1"><span> </span></button>
          </th>
          <th class="cursor-pointer px-3 py-3.5 text-left font-semibold" data-sort="artigos">
            # Art. Periódicos
            <button class="px-1"><span> </span></button>
          </th>
          <th class="cursor-pointer px-3 py-3.5 text-left font-semibold" data-sort="eventos">
            # Art. Eventos
            <button class="px-1"><span> </span></button>
          </th>
          <th class="cursor-pointer px-3 py-3.5 text-left font-semibold" data-sort="livros">
            # Livros
            <button class="px-1"><span> </span></button>
          </th>
          <th class="cursor-pointer px-3 py-3.5 text-left font-semibold" data-sort="capitulos">
            # Cap. Livros
            <button class="px-1"><span> </span></button>
          </th>
        </tr>
      </thead>
      <tbody id="tbody-lista-profs">`;

  dados.forEach((prof, index) => {
    html += `
      <tr class="border-b border-gray-300 hover:bg-gray-100 cursor-pointer">
        <td class="px-3 py-3.5 text-zinc-700">${index + 1}</td>
        <td class="px-3 py-3.5 text-zinc-700">
          <div class="flex items-center gap-4">
            <img class="h-10 w-10 rounded-full" src="${prof.avatar}" alt="${prof.nome}" decoding="async" loading="lazy" />
            <div>
              <span class="font-medium capitalize">${prof.nome.toLowerCase()}</span>
              <br />
              Tipo de vínculo com ${prof.sigla_ies_vinculo}: ${prof.vinculo_ies}
              <br />
              <span class="font-medium capitalize"> Nome da IES de Origem:${prof.ies.toLowerCase()}</span>
            </div>
          </div>
        </td>
        <td class="px-3 py-3.5 text-zinc-700">${prof.produtos["ARTIGO-PUBLICADO"] || 0}</td>
        <td class="px-3 py-3.5 text-zinc-700">${prof.produtos["TRABALHO-EM-EVENTOS"] || 0}</td>
        <td class="px-3 py-3.5 text-zinc-700">${prof.produtos["LIVROS-PUBLICADOS-OU-ORGANIZADOS"] || 0}</td>
        <td class="px-3 py-3.5 text-zinc-700">${prof.produtos["CAPITULOS-DE-LIVROS-PUBLICADOS"] || 0}</td>
      </tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>`;

  table.innerHTML = html;
  ordenaTabela();
};

// Eventos
inputDocente.addEventListener("input", () => {
  if (inputDocente.value.length > 0) {
    buttonLimparBusca.classList.remove("hidden");
    const nomes = filtrarResultadosPesquisa(inputDocente, trie);
    renderizarItensPesquisa(nomes, resultadosDocentes, inputDocente);
  } else {
    buttonLimparBusca.classList.add("hidden");
    resultadosDocentes.classList.add("hidden");
  }
});

document.addEventListener("click", (e) => {
  if (e.target !== inputDocente) {
    resultadosDocentes.classList.add("hidden");
  }
});

btnPesquisarDocente.addEventListener("click", () => {
  const nomes = filtrarResultadosPesquisa(inputDocente, trie);
  const listaDocentesFiltrada = filtrarDocentes(selecionarIes.value, nomes);
  exibirTabelaResultadosAtualizados(listaDocentesFiltrada);
});

buttonLimparBusca.addEventListener("click", () => {
  inputDocente.value = "";
  buttonLimparBusca.classList.add("hidden");
  const listaDocentesFiltrada = filtrarDocentes(selecionarIes.value);
  exibirTabelaResultadosAtualizados(listaDocentesFiltrada);
  debugger
});

// Inicializa a tabela
ordenaTabela();
