const ajustarBarraProgresso = async (total, nomeTarefa, elem, idIes, tipo) => {
  document.getElementById(`${tipo}-total`).textContent = total;

  let width = 0;
  let sucessos;
  let erros;

  try {
    while (width < 100) {
      const taskResponses = await axios.get(
        `/tasks/consultar_progresso/${nomeTarefa}/${idIes}`,
      );

      sucessos = parseInt(taskResponses.data.sucessos);
      erros = parseInt(taskResponses.data.erros);

      if (sucessos == -1) return;
      // debugger
      width = Math.floor(((sucessos + erros) * 100) / total);
      $("#" + elem).css({ width: parseFloat(width).toFixed(2) + "%" });
      $("#" + elem).attr("aria-valuenow", "" + parseFloat(width).toFixed(2));
      document.getElementById(elem).textContent =
        parseFloat(width).toFixed(2) + "%";

      $(`#${tipo}-sucessos`).text(sucessos);
      $(`#${tipo}-erros`).text(erros);
      $(`#${tipo}-pendentes`).text(total - (sucessos + erros));
    }
  } catch (error) {
    console.error("Erro na requisição para barra de progresso:", error);
    // GeraToast('Erro ao tentar carregar rede de colaboração');
  }
};

async function processarCurriculos() {
  $(`#bt-processar-curriculos`).attr("disabled", true);
  try {
    $("#pcl-total").text(0);
    $("#pcl-sucessos").text(0);
    $("#pcl-erros").text(0);
    $("#pcl-pendentes").text(0);

    var idIes;

    const cbSelecionaTodas = document.getElementById("cb_seleciona_todas");

    if (cbSelecionaTodas.checked) {
      idIes = "em_lote";
    } else {
      // Get the select element
      const idIesElement = document.getElementById("idIes");
      // Get the selected option's value
      const selectedOption = idIesElement.options[idIesElement.selectedIndex];
      idIes = selectedOption.value;
    }

    const response = await axios.get(`/tasks/processar_curriculos/${idIes}`);
    // let listaIds = response.data;
    const total = response.data.quantidade;

    var elem = document.getElementById("progresso-processar");
    await ajustarBarraProgresso(
      total,
      "processar_curriculos",
      "progresso-processar",
      idIes,
      "pcl",
    );
  } catch (error) {
    console.error("Erro na requisão de processar curriculos:", error);
    // GeraToast('Erro ao tentar carregar rede de colaboração');
  }
  $(`#bt-processar-curriculos`).attr("disabled", false);
}

async function baixarCurriculos() {
  $(`#bt-baixar-curriculos`).attr("disabled", true);
  try {
    $("#ccl-total").text(0);
    $("#ccl-sucessos").text(0);
    $("#ccl-erros").text(0);
    $("#ccl-pendentes").text(0);

    var idIes;

    if ($("#cb_seleciona_todas").is(":checked")) idIes = "em_lote";
    else idIes = $("#idIes").find(":selected").val();

    const response = await axios.get(`/tasks/baixar_curriculos/${idIes}`);
    const total = response.data.quantidade;

    var elem = document.getElementById("progresso-coletar");
    await ajustarBarraProgresso(
      total,
      "baixar_curriculos",
      "progresso-coletar",
      idIes,
      "ccl",
    );
  } catch (error) {
    console.error("Erro na requisão de baixar curriculos:", error);
    // GeraToast('Erro ao tentar carregar rede de colaboração');
  }
  $(`#bt-baixar-curriculos`).attr("disabled", false);
}

function geraCombinacoesAnos(inicial, final) {
  let combinacoes = [];
  for (let ano1 = inicial; ano1 <= final; ano1++) {
    for (let ano2 = ano1 + 1; ano2 <= final; ano2++) {
      combinacoes.push([ano1, ano2]);
    }
  }
  return combinacoes;
}


// const geraCombinacoesAnos = (inicial, final) => {
//   const combinacoes = [];
  
//   // Generate combinations using a nested loop
//   for (let ano1 = inicial; ano1 <= final; ano1++) {
//     for (let ano2 = ano1 + 1; ano2 <= final; ano2++) {
//       combinacoes.push([ano1, ano2]);
//     }
//   }
  
//   return combinacoes;
// };


async function restaurarCache(tag, endpoint) {
  $(`#btn-restaurar-cache-${tag}`).attr("disabled", true);
  try {
    $(`#rcache-${tag}`).text(0);

    var idIes;

    if ($("#cb_seleciona_todas").is(":checked")) idIes = "em_lote";
    else idIes = $("#idIes").find(":selected").val();

    var response = await axios.get(`/tasks/limpar_cache/${idIes}`);
    // let listaIds = response.data;
    const total = response.data.quantidade;
    if (total === 0) console.log("Cache da IES nao apagado.");

    if (total !== -1) {
      $(`#rcache-${tag}`).text(`Aguardando...`);

      const paresAnos = geraCombinacoesAnos(2017, 2022);
      const fracaoProcessada = 100 / paresAnos.length;
      var progresso = 0;

      response = await axios.get(`/tasks/lista_programas/${idIes}`);

      const lista_ppgs = response.data.programas;

      $("#titulo-card-restaurar-cache").text(
        `Restaurando cache de ${lista_ppgs.length} PPGs`,
      );
      debugger;
      for (let i = 0; i < paresAnos.length; i++) {
        const [ano1, ano2] = paresAnos[i];
        $(`#rcache-${tag}`).text(`Carregado ${ano1}-${ano2}`);
        try {
          for (let p = 0; p < lista_ppgs.length; p++) {
            $(`#id-ppg-${tag}`).text(lista_ppgs[p].id);
            await axios.get(
              `/ppg/graficos/${endpoint}/${ano1}/${ano2}/${lista_ppgs[p].id}`,
            );
            progresso += fracaoProcessada / lista_ppgs.length;
            $(`#progresso-restaurar-cache-${tag}`).css({
              width: parseFloat(progresso).toFixed(2) + "%",
            });
            $(`#progresso-restaurar-cache-${tag}`).attr(
              "aria-valuenow",
              "" + parseFloat(progresso).toFixed(2),
            );
            document.getElementById(
              `progresso-restaurar-cache-${tag}`,
            ).textContent = parseFloat(progresso).toFixed(2) + "%";
          }
        } catch (error) {
          console.log(error);
        }
      }
      $(`#rcache-${tag}`).text(`Carregado`);
      $("#titulo-card-restaurar-cache").text(`Restaurar cache`);
    }
  } catch (error) {
    console.error("Erro na requisão de restaurar cache:", error);
    $(`#rcache-${tag}`).text(`Erro`);
    // GeraToast('Erro ao tentar carregar rede de colaboração');
  }

  $(`#btn-restaurar-cache-${tag}`).attr("disabled", false);
}
