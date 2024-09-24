const listarArtigos = async (ano) => {
  const tbodyElement = document.getElementById("tbody-lista-artigos");
  let html = "";

  const carregamento = document.getElementById("carregamento");
  carregamento.classList.remove("hidden");
  carregamento.classList.add("flex");

  try {
    const response = await fetch(`/ppg/listarartigos/${ano}`);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const listaArtigos = await response.json();
    ("Nenhum artigo encontrado");

    listaArtigos.forEach((artigo) => {
      html += `<tr class="border-b border-b-gray-300">
        <td class="break-words py-3.5 px-3">${artigo["id_dupl"] + 1}</td>
        <td class="break-words py-3.5 px-3 max-w-screen-md">${artigo["nome_producao"]}</td>
        <td class="break-words py-3.5 px-3">${artigo["duplicado"] > 0 ? "Sim" : ""}</td>
        <td class="break-words py-3.5 px-3">
          <ul>`;
          
      artigo["programas"].forEach((ppg) => {
        html += `<li>${ppg.toLowerCase()}</li>`;
      });

      html += `</ul>          
        </td>
      </tr>`;
    });
    tbodyElement.innerHTML = html;
  } catch (error) {
    console.error("Error fetching articles:", error);
    erroElement.classList.remove("hidden");
  } finally {
    carregamento.classList.remove("flex");
    carregamento.classList.add("hidden");
  }
};

const selectAno = document.getElementById("select-ano");
const btnListarArtigos = document.getElementById("btn-listar-artigos");
const anoInicio = 2017;
const anoFim = 2023;

for (let ano = anoInicio; ano <= anoFim; ano++) {
  const option = document.createElement("option");
  option.value = ano;
  option.textContent = ano;
  selectAno.appendChild(option);
}

btnListarArtigos.addEventListener("click", () => {
  const ano = selectAno.value;
  listarArtigos(ano);
});
