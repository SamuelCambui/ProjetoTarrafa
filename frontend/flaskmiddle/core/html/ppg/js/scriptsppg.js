import trie from "./utils/trie.js";


$("#bt_altera_simulacoes").click(function (event) {
  let checkboxes = document.getElementsByName("chkdocentes");
  let selectedCboxes = Array.prototype.slice
    .call(checkboxes)
    .filter((ch) => ch.checked == false);

  let blacklist = selectedCboxes.map((ch) => ch.value);
  buscaSimulacaoQualisPPG("chartsimulacaoqualisproductions");
  fetch_simulacao_indprods_ppg("chartsimulacaoindprodsproductions");
});

$(document).ready(function () {
  fetchSliderGeral();
  document
    .getElementById("btn-drop-opcoes")
    .addEventListener("click", function () {
      const menu = document.getElementById("dropdown-menu");
      menu.classList.add("dropdown-aberto");
      menu.classList.remove("hidden");
      this.toggleAttribute("aria-expanded", "true");
    });

  document.addEventListener("click", function (event) {
    const btnDrop = document.getElementById("btn-drop-opcoes");
    const menu = document.getElementById("dropdown-menu");

    if (!btnDrop.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.remove("dropdown-aberto");
      menu.classList.add("hidden");
      btnDrop.setAttribute("aria-expanded", "false");
    }
  });
});

let anoInicio = 0;
let anoFim = 0;

let listProfs;
let idPpg;

function fetchSliderGeral() {
  axios
    .get(`/ppg/anos`)
    .then((response) => {
      let rangeYears = response.data.anos;
      // id_ppg = response.data.id_ppg;
      // nota_ppg = response.data.nota_ppg;
      if (rangeYears[0] < 2013)
        rangeYears = Array.from(
          {
            length: rangeYears[rangeYears.length - 1] - 2013 + 1,
          },
          (value, index) => 2013 + index,
        );
      new rSlider({
        target: "#slider-ppg-geral",
        values: rangeYears,
        range: true,
        tooltip: false,
        set: [rangeYears[0], rangeYears[rangeYears.length - 1]],

      });
      anoInicio = 2017;
      anoFim = 2023;

      if (anoInicio > anoFim) anoInicio = anoFim;

      fetchCharts();

      //$('#collapseSlider').collapse('hide');
    })
    .catch((error) => {
      console.error("Erro ao tentar definir período avaliativo: ", error);
      location.href = "/ppg/home";
    })
    .finally(() => { });
}

function fetchCharts() {
  // ****************************************************
  // TAB indicadores-tab
  // ****************************************************
  //let artigos_ppgs_correlatos;
  const element_indicadores = `#status-carregamento-indicadores-tab`;
  // run_waitMe(element_indicadores, 'outro', '', true);
  axios
    .get(`/ppg/graficos/indicadores-tab/${anoInicio}/${anoFim}`)
    .then((response) => {
      const idPpg = response.data.id_ppg;
      const nota_ppg = response.data.nota_ppg;
      fetch_qualis_ppg("chartqualisproductions", response.data.dadosqualis);
      fetch_qualis_discente_ppg(
        "chartqualisdiscenteproductions",
        response.data.dadosqualisdiscente,
      );
      fetch_artigos_discentes_ppg(
        "chartpercentqualisdiscente",
        response.data.dadosartigosdiscente,
      );
      //fetch_artigos_discentes_ppgs_correlatos(response.data.dadosartigosdiscentes_correlatos)
      fetch_indprods_ppg(
        "chartindprodsproductions",
        response.data.dadosindprods,
      );
      fetch_indprods_extsups_ppg(
        "chartindprodextsupsproductions",
        response.data.dadosextsup,
      );
      fetchPositionIndProd(
        "chartpositionindprods",
        response.data.dadosposition,
        idPpg,
        nota_ppg,
      );
      fetchTimesConclusions("carttempodefesa", response.data.dadostempodefesa);
      fetchStudentsGraduated(
        "chartstudentsgraduated",
        response.data.dadosestudantestitulados,
      );
      fetchPartDiss(
        "chartpartdis",
        response.data.dadosavgpartdis,
        response.data.dadospartdis,
        nota_ppg,
      );
      fetchIndCoautorias(
        "chartindcoautoria",
        response.data.dadosavgindcoautoria,
        response.data.dadosindcoautoria,
        nota_ppg,
      );
      fetchIndOris(
        "chartindori",
        response.data.dadosavgindori,
        response.data.dadosindori,
        nota_ppg,
      );
      fetchIndDistOris(
        "chartinddistori",
        response.data.dadosavginddistori,
        response.data.dadosinddistori,
        nota_ppg,
      );
      fetchIndAuts(
        "chartindaut",
        response.data.dadosavgindaut,
        response.data.dadosindaut,
        nota_ppg,
      );
      fetchIndDiss(
        "chartinddis",
        response.data.dadosavginddis,
        response.data.dadosinddis,
        nota_ppg,
      );
      $("#sigla_ies").text(sigla_ies);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados de indicadores-tab: ", error);
    })
    .finally(() => { });

  axios
    .get(`/ppg/graficos/indicadores-tab-correlatos/${anoInicio}/${anoFim}`)
    .then((response) => {
      fetch_artigos_discentes_ppgs_correlatos(
        response.data.dadosartigosdiscentes_correlatos,
      );
    })
    .catch((error) => {
      console.error("Erro ao buscar dados de artigos correlatos: ", error);
    })
    .finally(() => { });

  // ****************************************************
  // TAB docentes-tab
  // ****************************************************
  (async () => {
    try {
      const response = await axios.get(
        `/ppg/graficos/docentes-tab/${anoInicio}/${anoFim}`,
      );
      const {
        id_ppg: idPpg,
        listadocentes: listaDocentes,
        links: dados,
        lattes,
        categorias,
      } = response.data;

      mostrarListaProfessores(listaDocentes, idPpg);

      exibirGrafoCoautoriasDocentes(dados);
      exibirGraficoLattesDesatualizado("chartlattesupdate", lattes);
      exibirGraficoProfessorPorCategoria(
        "chartprofessorsbycategory",
        categorias,
      );

      //Funções de clique no professor (info, produções)
      window.fetchGraph = fetchGraph;
      window.fetchProfessorProducts_2 = fetchProfessorProducts_2;
    } catch (error) {
      console.error("Erro ao buscar dados de docentes: ", error);
    } finally {
    }
  })();

  // axios.get(`/ppg/graficos/docentes-tab/${anoInicio}/${anoFim}`)
  // 	.then(response => {
  // 		console.log(response)
  // 		idPpg = response.data.id_ppg;
  // 		listProfs = response.data.listadocentes

  // 		//Tabela
  // 		mostrarListaProfessores(listProfs, idPpg);

  // 		//Gráficos
  // 		fetchLinksGraph(response.data.links);
  // 		exibirGraficoLattesDesatualizado('chartlattesupdate', response.data.lattes);
  // 		exibirGraficoProfessorPorCategoria('chartprofessorsbycategory', response.data.categorias);
  // 		window.fetchGraph = fetchGraph;
  // 		window.fetchProfessorProducts_2 = fetchProfessorProducts_2;
  // 	})
  // 	.catch(error => {
  // 		console.error('Erro ao buscar dados de docentes-tab: ', error);
  // 	})
  // 	.finally(() => {
  // 		//$('#status-carregamento-docentes-tab').hide();
  // 	});

  // ****************************************************
  // TAB projetos-tab (linhas de pesquisa e projetos)
  // ****************************************************
  axios
    .get(`/ppg/graficos/projetos-tab/${anoInicio}/${anoFim}`)
    .then((response) => {
      exibirGraficoProducaoPorLinhaPesquisa(response.data.producaolinhas);
      exibirGraficoProjetosPorLinhaPesquisa(response.data.projetoslinhas);
      fetchDadosProjetosLattes(response.data.projetoslattes);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados de projetos-tab: ", error);
    })
    .finally(() => { });

  // ****************************************************
  // TAB bancas-tab
  // ****************************************************
  const element_bancas = `#status-carregamento-bancas-tab`;
  // run_waitMe(element_bancas, 'outro', '', true);
  axios
    .get(`/ppg/graficos/bancas-tab/${anoInicio}/${anoFim}`)
    .then((response) => {
      fetchTCCsResearchLinesData(response.data.tccproducao);
      fetchTCCsProductionsData("charttccsproductions", response.data.produtos);
      fetchTCCsProductionsTiposData(
        "charttccsproductions-tipos",
        response.data.produtos,
      );
      fetchTCCsArtigosData("chartartigostccs", response.data.produtos);
      fetchTCCsLivrosData("chartlivrostccs", response.data.produtos);
      atualizarDadosBancas(response.data.bancasexternos);
      exibirParticipantesExternos(response.data.bancasexternos);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados de bancas-tab: ", error);
    })
    .finally(() => { });

  // axios.get(`/ppg/graficos/egressos-tab/${year1}/${year2}`)
  // .then(response => {

  // })
  // .catch(error => {
  // 	console.error('Erro ao buscar dados de indicadores-tab: ', error);
  // });

  // ****************************************************
  // TAB simulacao-tab
  // ****************************************************
  //fetch_simulacao_qualis_ppg('chartsimulacaoqualisproductions');
  //fetch_simulacao_indprods_ppg('chartsimulacaoindprodsproductions');

  // axios.get(`/ppg/graficos/${year1}/${year2}`)
  //   .then(response => {
  //     fetch_qualis_ppg('chartqualisproductions', response.data.dataqualis);
  //     fetch_indprods_ppg('chartindprodsproductions', response.data.dataqindprods);
  //     fetch_indprods_extsups_ppg('chartindprodextsupsproductions', response.data.dataextsup);
  //   })
  //   .catch(error => {
  //     console.error('Error fetching professors by category: ', error);
  //   });

  // // Armazena no storage para facilitar o acesso no HTML
  // window.sessionStorage.setItem('year1', year1);
  // window.sessionStorage.setItem('year2', year2);

  // fetch_qualis_ppg('chartqualisproductions');
  // fetch_indprods_ppg('chartindprodsproductions');
  // fetch_indprods_extsups_ppg('chartindprodextsupsproductions');
  // fetchPositionIndProd();
  // fetchTimesConclusions('carttempodefesa');
  // fetchStudentsGraduated('chartstudentsgraduated');
  // fetchPartDiss('chartpartdis');
  // fetchIndCoautorias('chartindcoautoria');
  // fetchIndOris('chartindori');
  // fetchIndDistOris('chartinddistori');
  // fetchIndAuts('chartindaut');
  // fetchIndDiss('chartinddis');
  // fetch_qualis_discente_ppg('chartqualisdiscenteproductions')

  // getListProfessors();

  // exibirGraficoProfessorPorCategoria('chartprofessorsbycategory');
  // //fetchListQualisProductions('chartqualisproductions', 'chartindprodsproductions', [], []);
  // fetch_simulacao_qualis_ppg('chartsimulacaoqualisproductions');
  // fetch_simulacao_indprods_ppg('chartsimulacaoindprodsproductions');
  // exibirGraficoLattesDesatualizado('chartlattesupdate');
  // //fetchPositionIndProdSlider();
  // fetchProjectsData();
  // fetchResearchLinesData();
  // fetchProjectsResearchLinesData();
  // fetchTCCsResearchLinesData();
  // fetch_bancas_externos_ppg();
  // //fetchLinksGraph();
  // window.fetchGraph = fetchGraph
  // window.fetchProfessorProducts_2 = fetchProfessorProducts_2
}

function fetch_qualis_ppg(idCanvasQualis, dados) {
  try {
    const listQualisProductions = dados.produtos;
    const listArtigos = dados.artigos;
    renderChartQualis_(idCanvasQualis, listQualisProductions, listArtigos);
  } catch { }
}

function fetch_qualis_discente_ppg(idCanvasQualis, dados) {
  try {
    const listQualisProductions = dados.produtos;
    renderChartQualis_discente(idCanvasQualis, listQualisProductions);
  } catch { }
}

function fetch_artigos_discentes_ppg(idCanvasQualis, dados) {
  try {
    const estatisticas = dados;

    $("#qualis-percent-indicador1-desc").text(
      `${((estatisticas["DiscentesA4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador1").css(
      "width",
      `${((estatisticas["DiscentesA4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador1").attr(
      "aria-valuenow",
      ((estatisticas["DiscentesA4+"] * 100) / estatisticas["total"]).toFixed(1),
    );
    $("#qualis-percent-indicador1 span").text(
      `${((estatisticas["DiscentesA4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    $("#qualis-percent-indicador2-desc").text(
      `${((estatisticas["DiscentesB4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador2").css(
      "width",
      `${((estatisticas["DiscentesB4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador2 span").text(
      `${((estatisticas["DiscentesB4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    $("#qualis-percent-indicador3-desc").text(
      `${((estatisticas["EgressosA4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador3").css(
      "width",
      `${((estatisticas["EgressosA4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador3 span").text(
      `${((estatisticas["EgressosA4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    $("#qualis-percent-indicador4-desc").text(
      `${((estatisticas["EgressosB4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador4").css(
      "width",
      `${((estatisticas["EgressosB4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador4 span").text(
      `${((estatisticas["EgressosB4+"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    $("#qualis-percent-indicador5-desc").text(
      `${((estatisticas["ArtigosDocentesSemCoautoria"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador5").css(
      "width",
      `${((estatisticas["ArtigosDocentesSemCoautoria"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador5 span").text(
      `${((estatisticas["ArtigosDocentesSemCoautoria"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    $("#qualis-percent-indicador6-desc").text(
      `${((estatisticas["ArtigosDocentesComCoautoria"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador6").css(
      "width",
      `${((estatisticas["ArtigosDocentesComCoautoria"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador6 span").text(
      `${((estatisticas["ArtigosDocentesComCoautoria"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    $("#qualis-percent-indicador7-desc").text(
      `${((estatisticas["ArtigosDocentesNãoPermanentes"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador7").css(
      "width",
      `${((estatisticas["ArtigosDocentesNãoPermanentes"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador7 span").text(
      `${((estatisticas["ArtigosDocentesNãoPermanentes"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    $("#qualis-percent-indicador8-desc").text(
      `${((estatisticas["ArtigosExternos"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador8").css(
      "width",
      `${((estatisticas["ArtigosExternos"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador8 span").text(
      `${((estatisticas["ArtigosExternos"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    $("#qualis-percent-indicador9-desc").text(
      `${((estatisticas["ArtigosPosDocs"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador9").css(
      "width",
      `${((estatisticas["ArtigosPosDocs"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );
    $("#qualis-percent-indicador9 span").text(
      `${((estatisticas["ArtigosPosDocs"] * 100) / estatisticas["total"]).toFixed(1)}%`,
    );

    const qualisDiscente = estatisticas?.qualis_discente ?? {};
    const total = estatisticas?.total ?? 1;

    const chaves = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C"];
    const soma = chaves.reduce(
      (sum, key) => sum + (qualisDiscente[key] || 0),
      0,
    );

    const tituloGrafico = document.getElementById(
      "titlechartpercentqualisdiscente",
    );
    const porcentagem = ((soma * 100) / total).toFixed(2);
    tituloGrafico.querySelector("span").textContent = `${porcentagem}%`;

    const width = 400;
    const height = 400;
    let arcSize = (10 * width) / 250;
    let innerRadius = arcSize * 1;

    let data = [
      {
        value: (
          (estatisticas.qualis_discente["A1"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "A1 com discentes",
        color: baseColors[1],
      },
      {
        value: (
          (estatisticas.qualis_discente["A2"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "A2 com discentes",
        color: baseColors[2],
      },
      {
        value: (
          (estatisticas.qualis_discente["A3"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "A3 com discentes",
        color: baseColors[3],
      },
      {
        value: (
          (estatisticas.qualis_discente["A4"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "A4 com discentes",
        color: baseColors[4],
      },
      {
        value: (
          (estatisticas.qualis_discente["B1"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "B1 com discentes",
        color: baseColors[5],
      },
      {
        value: (
          (estatisticas.qualis_discente["B2"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "B2 com discentes",
        color: baseColors[6],
      },
      {
        value: (
          (estatisticas.qualis_discente["B3"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "B3 com discentes",
        color: baseColors[7],
      },
      {
        value: (
          (estatisticas.qualis_discente["B4"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "B4 com discentes",
        color: baseColors[8],
      },
      {
        value: (
          (estatisticas.qualis_discente["C"] * 100) /
          estatisticas["total"]
        ).toFixed(2),
        label: "C com discentes",
        color: baseColors[10],
      },
    ];

    let svg = d3
      .select(`#${idCanvasQualis}`)
      .attr("width", width)
      .attr("height", height);

    let arcs = data.map(function (obj, i) {
      return d3
        .arc()
        .innerRadius(i * arcSize + innerRadius + 2)
        .outerRadius((i + 1) * arcSize - width / 250 + innerRadius - 2);
    });
    let arcsGrey = data.map(function (obj, i) {
      return d3
        .arc()
        .innerRadius(i * arcSize + (innerRadius + (arcSize / 2 - 2)))
        .outerRadius((i + 1) * arcSize - arcSize / 2 + innerRadius);
    });

    let pieData = data.map(function (obj, i) {
      return [
        { value: obj.value * 0.75, arc: arcs[i], object: obj },
        { value: (100 - obj.value) * 0.75, arc: arcsGrey[i], object: obj },
        { value: 100 * 0.25, arc: arcs[i], object: obj },
      ];
    });

    let pie = d3
      .pie()
      .sort(null)
      .value(function (d) {
        return d.value;
      });
    let g = svg
      .selectAll("g")
      .data(pieData)
      .enter()
      .append("g")
      .attr(
        "transform",
        "translate(" + width / 2 + "," + width / 2 + ") rotate(180)",
      );
    let gText = svg
      .selectAll("g.textClass")
      .data([{}])
      .enter()
      .append("g")
      .classed("textClass", true)
      .attr(
        "transform",
        "translate(" + width / 2 + "," + width / 2 + ") rotate(180)",
      );

    g.selectAll("path")
      .data(function (d) {
        return pie(d);
      })
      .enter()
      .append("path")
      .attr("id", function (d, i) {
        if (i == 1) {
          return "Text" + d.data.object.label;
        }
      })
      .attr("d", function (d) {
        return d.data.arc(d);
      })
      .attr("fill", function (d, i) {
        return i == 0 ? d.data.object.color : i == 1 ? "#E3E3E3" : "none";
      });

    svg.selectAll("g").each(function (d, index) {
      let el = d3.select(this);
      let path = el.selectAll("path").each(function (r, i) {
        if (i === 1) {
          let centroid = r.data.arc.centroid({
            startAngle: r.startAngle + 0.05,
            endAngle: r.startAngle + 0.001 + 0.05,
          });
        }
        if (i === 0) {
          let centroidText = r.data.arc.centroid({
            startAngle: r.startAngle,
            endAngle: r.startAngle,
          });
          let lableObj = r.data.object;
          gText
            .append("text")
            .attr("font-size", 11)
            .text(lableObj.label + ": " + lableObj.value + "%")
            .attr(
              "transform",
              "translate(" +
              (centroidText[0] - (1.5 * width) / 100) +
              "," +
              (centroidText[1] + ") rotate(" + 180 + ")"),
            )
            .attr("dominant-baseline", "central");
        }
      });
    });
  } catch {
  }
}

function fetch_artigos_discentes_ppgs_correlatos(dados) {
  try {
    const estatisticas = dados;

    $("#qualis-percent-correlatos-indicador1-desc").text(
      `${estatisticas["DiscentesA4+"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador1").css(
      "width",
      `${estatisticas["DiscentesA4+"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador1").attr(
      "aria-valuenow",
      estatisticas["DiscentesA4+"].toFixed(1),
    );
    $("#qualis-percent-correlatos-indicador1 span").text(
      `${estatisticas["DiscentesA4+"].toFixed(1)}%`,
    );

    $("#qualis-percent-correlatos-indicador2-desc").text(
      `${estatisticas["DiscentesB4+"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador2").css(
      "width",
      `${estatisticas["DiscentesB4+"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador2 span").text(
      `${estatisticas["DiscentesB4+"].toFixed(1)}%`,
    );

    $("#qualis-percent-correlatos-indicador3-desc").text(
      `${estatisticas["EgressosA4+"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador3").css(
      "width",
      `${estatisticas["EgressosA4+"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador3 span").text(
      `${estatisticas["EgressosA4+"].toFixed(1)}%`,
    );

    $("#qualis-percent-correlatos-indicador4-desc").text(
      `${estatisticas["EgressosB4+"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador4").css(
      "width",
      `${estatisticas["EgressosB4+"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador4 span").text(
      `${estatisticas["EgressosB4+"].toFixed(1)}%`,
    );

    $("#qualis-percent-correlatos-indicador5-desc").text(
      `${estatisticas["ArtigosDocentesSemCoautoria"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador5").css(
      "width",
      `${estatisticas["ArtigosDocentesSemCoautoria"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador5 span").text(
      `${estatisticas["ArtigosDocentesSemCoautoria"].toFixed(1)}%`,
    );

    $("#qualis-percent-correlatos-indicador6-desc").text(
      `${estatisticas["ArtigosDocentesComCoautoria"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador6").css(
      "width",
      `${estatisticas["ArtigosDocentesComCoautoria"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador6 span").text(
      `${estatisticas["ArtigosDocentesComCoautoria"].toFixed(1)}%`,
    );

    $("#qualis-percent-correlatos-indicador7-desc").text(
      `${estatisticas["ArtigosDocentesNãoPermanentes"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador7").css(
      "width",
      `${estatisticas["ArtigosDocentesNãoPermanentes"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador7 span").text(
      `${estatisticas["ArtigosDocentesNãoPermanentes"].toFixed(1)}%`,
    );

    $("#qualis-percent-correlatos-indicador8-desc").text(
      `${estatisticas["ArtigosExternos"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador8").css(
      "width",
      `${estatisticas["ArtigosExternos"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador8 span").text(
      `${estatisticas["ArtigosExternos"].toFixed(1)}%`,
    );

    $("#qualis-percent-correlatos-indicador9-desc").text(
      `${estatisticas["ArtigosPosDocs"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador9").css(
      "width",
      `${estatisticas["ArtigosPosDocs"].toFixed(1)}%`,
    );
    $("#qualis-percent-correlatos-indicador9 span").text(
      `${estatisticas["ArtigosPosDocs"].toFixed(1)}%`,
    );
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetch_indprods_ppg(idCanvasIndprods, dados) {
  try {
    const listAvgIndProds = dados.indprod;
    const indicadores = dados.indicadores;
    renderChartIndprods_(idCanvasIndprods, listAvgIndProds, indicadores);

    $("#formula_indprod")
      .html(`IndProdArt = (${listAvgIndProds.formula.A1}*A1 + ${listAvgIndProds.formula.A2}*A2 + ${listAvgIndProds.formula.A3}*A3
			+ ${listAvgIndProds.formula.A4}*A4 + ${listAvgIndProds.formula.B1}*B1
			+ ${listAvgIndProds.formula.B2}*B2 + ${listAvgIndProds.formula.B3}*B3 + ${listAvgIndProds.formula.B4}*B4)/DP`);
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetch_indprods_extsups_ppg(idCanvasIndprods, dados) {
  try {
    const listAvgIndProds = dados.indprod;
    const indicadores = dados.indicadores;
    renderChartIndprodextsups_(idCanvasIndprods, listAvgIndProds, indicadores);
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchPositionIndProd(dados, id_ppg, nota_ppg) {
  try {
    $("#titulo-chartpositionindprod").text(
      `Posicionamento do PPG em relação a outros nota ${nota_ppg} da área`,
    );
    $("#text-chartpositionindprod").text(
      `Comparação do indicador Média ponderada de artigos (IndArtigo) por DPs e por ano do PPG com os programas nota ${nota_ppg} no período de ${anoInicio} - ${anoFim}`,
    );

    renderChartPositionIndProd(dados, id_ppg);
    //fetchDensityIndProds();
    fetchMapBrazil(
      dados.indprods,
      dados.maior_indprod,
      dados.menor_indprod,
      id_ppg,
    );
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchTimesConclusions(idCanvas, dados) {
  try {
    let timesConclusions = dados;
    renderChartTimesConclusions(idCanvas, timesConclusions);
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchStudentsGraduated(idCanvas, dados) {
  try {
    let listStudents = dados;
    renderChartStudentsGraduated(idCanvas, listStudents);
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchPartDiss(idCanvas, dadosavg, dadospartdis, nota_ppg) {
  try {
    const listAvgPartDiss = dadosavg;
    const listPartDiss = dadospartdis.partdis;
    const indicadores = dadospartdis.indicadores;
    renderChartPartDiss(
      idCanvas,
      listPartDiss,
      listAvgPartDiss,
      indicadores,
      nota_ppg,
    );
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchIndCoautorias(idCanvas, dadosavg, dadosindcoaut, nota_ppg) {
  try {
    const listAvgIndCoautorias = dadosavg;
    const listIndCoautorias = dadosindcoaut.indcoaut;
    const indicadores = dadosindcoaut.indicadores;
    renderChartIndCoautorias(
      idCanvas,
      listIndCoautorias,
      listAvgIndCoautorias,
      indicadores,
      nota_ppg,
    );
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchIndOris(idCanvas, dadosavg, dadosindori, nota_ppg) {
  try {
    const listAvgIndOris = dadosavg;
    const listIndOris = dadosindori.indori;
    const indicadores = dadosindori.indicadores;
    renderChartIndOris(
      idCanvas,
      listIndOris,
      listAvgIndOris,
      indicadores,
      nota_ppg,
    );
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchIndDistOris(idCanvas, dadosavg, dadosinddistori, nota_ppg) {
  try {
    const listAvgIndDistOris = dadosavg;
    const listIndDistOris = dadosinddistori.inddistori;
    const indicadores = dadosinddistori.indicadores;
    renderChartIndDistOris(
      idCanvas,
      listIndDistOris,
      listAvgIndDistOris,
      indicadores,
      nota_ppg,
    );
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchIndAuts(idCanvas, dadosavg, dadosindaut, nota_ppg) {
  try {
    const listAvgIndAuts = dadosavg;
    const listIndAuts = dadosindaut.indaut;
    const indicadores = dadosindaut.indicadores;
    renderChartIndAuts(
      idCanvas,
      listIndAuts,
      listAvgIndAuts,
      indicadores,
      nota_ppg,
    );
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchIndDiss(idCanvas, dadosavg, dadosinddis, nota_ppg) {
  try {
    const listAvgIndDiss = dadosavg;
    const listIndDiss = dadosinddis.inddis;
    const indicadores = dadosinddis.indicadores;
    renderChartIndDiss(
      idCanvas,
      listIndDiss,
      listAvgIndDiss,
      indicadores,
      nota_ppg,
    );
  } catch {
    // GeraToast(dados.detail);
  }
}

// D3

function normaliza_0_1(val, max, min) {
  if (max - min === 0) return 1; // or 0, it's up to you
  return (val - min) / (max - min);
}

function fetchMapBrazil(circleCoordinates, maior, menor, id_ppg) {
  const width = 400;
  const height = 400;

  // Selecionar o elemento SVG
  const svg = d3
    .select("#mapa-brasil")
    .attr("width", width)
    .attr("height", height);

  // Configurar uma projeção para o mapa
  const projection = d3
    .geoMercator()
    .center([-55, -10]) // Coordenadas aproximadas do centro do Brasil
    .scale(500) // Fator de escala para ajustar o tamanho do mapa
    .translate([width / 2, height / 2 - 50]);

  // Criar um caminho de projeção
  const path = d3.geoPath().projection(projection);

  // Carregar os dados do GeoJSON
  d3.json("/assets/js/br.json")
    .then(function (data) {
      const brazil = topojson.feature(data, data.objects.estados);

      // Renderizar o mapa do Brasil
      svg
        .selectAll("path")
        .data(brazil.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#abc8e8") // Cor de preenchimento do mapa
        .attr("stroke", "white"); // Cor da borda do mapa

      const zoom = d3
        .zoom()
        .scaleExtent([1, 8]) // Define the min and max zoom levels
        .on("zoom", zoomed);

      svg.call(zoom);

      // Create or select the tooltip element
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Renderizar os círculos e adicionar tooltips
      svg
        .selectAll("circle")
        .data(circleCoordinates)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
        .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
        .attr("r", (d) => normaliza_0_1(d.indprod, maior, menor) * 15)
        .attr("fill", function (d) {
          if (d.id === id_ppg) return "black";
          else if (d.status == "Pública Federal") return "green";
          else if (d.status == "Pública Estadual") return "blue";
          return "red";
        })
        .attr("stroke", "white")
        .attr("fill-opacity", 0.4)
        .on("mouseover", function (event, d) {
          d3.select(this).attr(
            "r",
            (d) => normaliza_0_1(d.indprod, maior, menor) * 20,
          ); // Increase circle size on mouseover
          tooltip
            .style("opacity", 1) // Show the tooltip
            .html(
              d.nome +
              "<br>" +
              d.sigla +
              " - " +
              d.status +
              "<br>( " +
              d.municipio +
              "/" +
              d.uf +
              " )<br>indProd: " +
              d.indprod.toFixed(3),
            ) // Set tooltip text
            .style("left", event.pageX - 80 + "px")
            .style("top", event.pageY - 80 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr(
            "r",
            (d) => normaliza_0_1(d.indprod, maior, menor) * 15,
          ); // Reset circle size on mouseout
          tooltip.style("opacity", 0); // Hide the tooltip
        });

      function zoomed(event) {
        const { transform } = event;
        try {
          svg
            .selectAll("path") // Select your map elements (e.g., paths)
            .attr("transform", transform); // Apply the zoom transformation

          svg
            .selectAll("circle")
            .attr("cx", (d) =>
              transform.applyX(projection([d.longitude, d.latitude])[0]),
            )
            .attr("cy", (d) =>
              transform.applyY(projection([d.longitude, d.latitude])[1]),
            )
            .attr(
              "r",
              (d) =>
                normaliza_0_1(d.indprod, maior, menor) * (15 * transform.k),
            )
            .on("mouseover", function (event, d) {
              d3.select(this).attr(
                "r",
                (d) =>
                  normaliza_0_1(d.indprod, maior, menor) * 20 * transform.k,
              ); // Increase circle size on mouseover
              tooltip
                .style("opacity", 1) // Show the tooltip
                .html(
                  d.nome +
                  "<br>" +
                  d.sigla +
                  " - " +
                  d.status +
                  "<br>( " +
                  d.municipio +
                  "/" +
                  d.uf +
                  " )<br>indProd: " +
                  d.indprod.toFixed(3),
                ) // Set tooltip text
                .style("left", event.pageX - 80 + "px")
                .style("top", event.pageY - 80 + "px");
            })
            .on("mouseout", function () {
              d3.select(this).attr(
                "r",
                (d) =>
                  normaliza_0_1(d.indprod, maior, menor) * 15 * transform.k,
              ); // Reset circle size on mouseout
              tooltip.style("opacity", 0); // Hide the tooltip
            });
        } catch (e) { }
      }
    })
    .catch((error) => {
      console.error("Erro no mapa: ", error);
    });
}

const mostrarListaProfessores = (listProfs, idPpg) => {
  document.getElementById("titulo-docentes").textContent =
    `Professores no período de ${anoInicio} à ${anoFim}`;

  const listProfsTemp = JSON.parse(JSON.stringify(listProfs));
  const corpoTabela = document.getElementById("tbody-lista-profs");

  //Atualiza formula
  document.getElementById("formula_indprod_docente").innerHTML = `
  ${listProfsTemp.formula.A1}*A1 + ${listProfsTemp.formula.A2}*A2 + ${listProfsTemp.formula.A3}*A3 + ${listProfsTemp.formula.A4}*A4 + 
  ${listProfsTemp.formula.B1}*B1 + ${listProfsTemp.formula.B2}*B2 + ${listProfsTemp.formula.B3}*B3 + ${listProfsTemp.formula.B4}*B4 / período
`;

  const corLattes = {
    "+12 meses": "#ef4444",
    "entre 8 e 12 meses": "#f87171",
    "entre 6 e 8 meses": "#fde047",
    "entre 3 e 6 meses": "#1e40af",
    "menos de 2 meses": "#60a5fa",
  };

  corpoTabela.innerHTML = "";

  //Atualiza opcoes no select
  const select = document.getElementById("select-prof");
  select.innerHTML =
    '<option value="" disabled selected>Escolha um docente</option><option value="todos">* TODOS</option>';

  let flagMediaInserida = false;
  const keysSorted = Object.keys(listProfsTemp.medias).sort(
    (a, b) => listProfsTemp.medias[b] - listProfsTemp.medias[a],
  );

  keysSorted.forEach((m) => {
    flagMediaInserida = false;
    for (let i = 0; i < listProfsTemp.professores.length; i++) {
      const professor = listProfsTemp.professores[i];
      const indProdArt = professor.indprod;

      if (
        parseFloat(indProdArt.toFixed(2)) >=
        parseFloat(listProfsTemp.medias[m].toFixed(2))
      ) {
        const textQualis = `
        <b>A1:</b> ${professor.A1}, <b>A2:</b> ${professor.A2}, <b>A3:</b> ${professor.A3}, <b>A4:</b> ${professor.A4}, 
        <b>B1:</b> ${professor.B1}, <b>B2:</b> ${professor.B2}, <b>B3:</b> ${professor.B3}, <b>B4:</b> ${professor.B4}, 
        <b>C:</b> ${professor.C}
      `;

        const tooltip = textQualis.replace(/<b>/g, "").replace(/<\/b>/g, "");
        const tooltipLattes =
          listProfsTemp.datalattes[professor.num_identificador];

        let status = "";
        for (
          let si = 0;
          si < listProfsTemp.status[professor.num_identificador].length;
          si++
        ) {
          status += `<span><strong>${listProfsTemp.status[professor.num_identificador][si][0]}</strong></span>`;
        }

        const avatar =
          listProfsTemp.avatares !== "null"
            ? listProfsTemp.avatares[professor.num_identificador]
            : "/assets/img/avatars/avatar1.jpeg";

        trie.inserirPalavra(professor.nome.toLowerCase());

        corpoTabela.innerHTML += `
        <tr class="hover:bg-zinc-50 border-b border-b-gray-300" onclick="fetchProfessorProducts_2('${professor.num_identificador}', '${professor.nome}', '${idPpg}', ${anoInicio}, ${anoFim}, '${textQualis}')">
          <td class="px-3 py-3.5">
            <div class="flex items-center gap-4"> 
              <img class="h-11 w-11 rounded-full" src="${avatar}"/>
              <span class="font-medium capitalize"> ${professor.nome.toLowerCase()}</span>
            </div> 
          </td>
          <td class="px-3 py-3.5" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${tooltip}">
            ${indProdArt.toFixed(2)}
          </td>
          <td class="px-3 py-3.5" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${listProfsTemp.status[professor.num_identificador]}\nÚltima atualização do Lattes: ${tooltipLattes}">
            ${status}
            <i class="fas fa-exclamation-circle" style="color: ${corLattes[tooltipLattes]};"></i>
          </td>
        </tr>
      `;

        select.innerHTML += `<option value="${professor.id_sucupira}">${professor.nome}</option>`;

        listProfsTemp.professores.splice(i, 1);
        i = -1;
      } else if (!flagMediaInserida) {
        corpoTabela.innerHTML += `
        <tr class="border-b border-b-gray-300 bg-zinc-50">
          <th class="text-left font-semibold 
		   px-3 py-3.5" scope="colgroup" colspan="5"> IndProd médio dos ${m}: ${listProfs.medias[m].toFixed(2)} </th>
        </tr>
      `;
        flagMediaInserida = true;
      }
    }
  });
};

//?Grafo docentes (co aut)
const exibirGrafoCoautoriasDocentes = (dados) => {
  const data = dados.links;
  const elem = document.getElementById("links-graph");
  elem.innerHTML = "";

  const width = 1000;
  const height = 1000;
  const innerRadius = Math.min(width, height) * 0.3;
  const outerRadius = innerRadius + 10;

  const names = d3.sort(
    d3.union(
      data.map((d) => d.source),
      data.map((d) => d.target),
    ),
  );
  const index = new Map(names.map((name, i) => [name, i]));
  const matrix = Array.from(index, () => new Array(names.length).fill(0));
  for (const { source, target, value } of data)
    matrix[index.get(source)][index.get(target)] += value;

  const chord = d3
    .chordDirected()
    .padAngle(10 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const ribbon = d3
    .ribbonArrow()
    .radius(innerRadius - 1)
    .padAngle(1 / innerRadius);

  const colors = d3.quantize(d3.interpolateRainbow, names.length);

  const svg = d3
    .select("#links-graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr(
      "style",
      "width: 100%; height: 100%; max-height: 1000px; font: 9px sans-serif;",
    );

  const chords = chord(matrix);

  const group = svg.append("g").selectAll().data(chords.groups).join("g");

  group
    .append("path")
    .attr("fill", (d) => colors[d.index])
    .attr("d", arc);

  group
    .append("text")
    .each((d) => (d.angle = (d.startAngle + d.endAngle) / 2))
    .attr("dy", "0.35em")
    .attr(
      "transform",
      (d) => `
						rotate(${(d.angle * 180) / Math.PI - 90})
						translate(${outerRadius + 5})
						${d.angle > Math.PI ? "rotate(180)" : ""}
					`,
    )
    .attr("text-anchor", (d) => (d.angle > Math.PI ? "end" : null))
    .text((d) => names[d.index]);

  group.append("title").text(
    (d) => `${names[d.index]}
				${d3.sum(chords, (c) => (c.source.index === d.index) * c.source.value) + d3.sum(chords, (c) => (c.target.index === d.index) * c.source.value)} artigos`,
  );

  svg
    .append("g")
    .attr("fill-opacity", 0.75)
    .selectAll()
    .data(chords)
    .join("path")
    .style("mix-blend-mode", "multiply")
    .attr("fill", (d) => colors[d.target.index])
    .attr("d", ribbon)
    .append("title")
    .text(
      (d) =>
        `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`,
    );
};

function fetchGraph(op) {
  const ids = op.options[op.selectedIndex].value;
  const nome = op.options[op.selectedIndex].label;

  if (!ids) ids = "todos";

  axios
    .get(`/ppg/grafo/coautores/docente/${ids}/${anoInicio}/${anoFim}`)
    .then((response) => {
      const data = response.data;
      const elem = document.getElementById("graph");
      elem.innerHTML = "";

      const width = 1100;
      const height = 800;

      // Specify the color scale.
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // The force simulation mutates links and nodes, so create a copy
      // so that re-evaluating this cell produces the same result.
      const links = data.links.map((d) => ({ ...d }));
      const nodes = data.nodes.map((d) => ({ ...d }));

      // Create a simulation with several forces.
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink(links).id((d) => d.id),
        )
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      // Create the SVG container.
      const svg = d3
        .select("#graph")
        .append("svg")
        //.attr("width", width)
        //.attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");
      // .call(d3.zoom().on("zoom", function () {
      //  svg.attr("transform", d3.zoomTransform(this))
      //}));

      // Add a line for each link, and a circle for each node.
      const link = svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", (d) => 1.5);

      const node = svg
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (c) => {
          if (c.group === "authors") return 8;
          if (c.group === "authors_solo") return 8;
          return 5;
        })
        .attr("fill", (d) => {
          if (d.group === "authors") {
            if (d.id.toUpperCase() === nome.toUpperCase())
              return d3.schemeCategory10[1];
            return d3.schemeCategory10[0];
          }

          if (d.group === "authors_solo") return d3.schemeCategory10[7];

          return d3.schemeCategory10[4];
        });

      node.append("title").text((d) => d.id);

      let text = svg
        .append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("class", "text")
        .attr("style", "font: 8px sans-serif;")
        .text((d) => {
          if (d.group === "authors" || d.group === "authors_solo")
            return d.id.trim().split(" ")[0];
          return "";
        });

      // Add a drag behavior.
      node.call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended),
      );

      // Set the position attributes of links and nodes each time the simulation ticks.
      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        text.attr("x", (d) => d.x + 10).attr("y", (d) => d.y);
      });

      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      const leg_elem = document.getElementById("legend-graph");
      leg_elem.innerHTML = "";
      const legendContainer = d3.select("#legend-graph");

      const svgl = legendContainer.append("svg").attr("width", 200); // Adjust the width as needed

      const legendData = Object.entries({
        "Docentes com coaturorias": d3.schemeCategory10[0],
        "Docente selecionado": d3.schemeCategory10[1],
        "Docentes sem coautoria": d3.schemeCategory10[7],
        Artigos: d3.schemeCategory10[4],
      });

      const legend = svgl
        .selectAll(".legend")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          const num_columns = 1;
          const column = i % num_columns; // Calculate the column number (0 or 1)
          const row = Math.floor(i / num_columns); // Calculate the row number
          let x = 0;
          if (column === 0) x = 0;
          else if (column == 1)
            x = 120 + 220; // Adjust the x position based on the column
          else x = 220 + 440;
          const y = row * 20; // Adjust the y position based on the row
          return "translate(" + x + "," + y + ")";
        });
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) {
          return d[1];
        });
      legend
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) {
          return d[0];
        });
    })
    .catch((error) => {
      console.error("Error fetching graph: ", error);
    });
}

function exibirGraficoProfessorPorCategoria(idCanvas, dados) {
  let listProfessors = dados;
  renderChartProfessorsByCategory(idCanvas, listProfessors);
}

function fetchProfessorProducts_2(
  num_prof,
  nome,
  id_ppg,
  year1,
  year2,
  text_qualis,
) {
  // axios.get(`/api/dados/prp/geral/producoes/${num_prof}/${id_ppg}/${year1}/${year2}`, {
  //   headers: {
  //     'accept': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   }
  // })
  //   .then(response => {
  //     const produtos = response.data;
  //     app.$options.methods.renderChartProfessorProductions(produtos);
  //   }).catch(error => {
  //     console.error('Error fetching range years: ', error);
  //   });

  // axios.get(`/api/dados/prp/geral/orientados/${num_prof}/${id_ppg}/${year1}/${year2}`, {
  //   headers: {
  //     'accept': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   }
  // })
  //   .then(response => {
  if (listProfs !== undefined) {
    const produtos = listProfs["produtos"];
    renderChartProfessorProductions(produtos[num_prof]);
    const dados = listProfs["orientados"][num_prof];

    let bt_verlattes = document.getElementById("bt_verlattes");
    $("#bt_verlattes").click(function () {
      let url = `http://lattes.cnpq.br/${num_prof}`;
      let width = 800;
      let height = 600;
      let left = (window.screen.width - width) / 2;
      let top = (window.screen.height - height) / 2;
      window.open(
        url,
        "Popup",
        "width=" +
        width +
        ", height=" +
        height +
        ", left=" +
        left +
        ", top=" +
        top,
      );
    });

    let div_num_prof = document.getElementById("nome-prof");
    const names = nome.trim().split(" ");

    // Extract the first name
    const firstName = names[0].toLowerCase();

    // Extract the last names and get the initials
    const lastNames = names.slice(1);
    const initials = lastNames.map((lastName) =>
      lastName.charAt(0).toUpperCase(),
    );

    // Combine the first name with the last names' initials
    div_num_prof.innerText = `Docente: ${firstName} ${initials.join(". ")}.`;

    /***********************************
     * O array 'dados' contém 4 dicionarios: 2 primeiros para doutorado (conclusoes dentro e fora do prazo) e 2 últimos para mestrado (conclusoes dentro e fora do prazo)
     *
     * As barras de progresso dependem das letiáveis:
     * ---------------------------------------------
     * d_dtitulados = DOUTORADO TITULADO DENTRO DO PRAZO
     * d_ftitulados = DOUTORADO TITULADO FORA DO PRAZO
     * d_atitulados = ABANDONOU DOUTORADO (DESLIGADO OU DESISTIU)
     * m_dtitulados = MESTRADO TITULADO DENTRO DO PRAZO
     * m_ftitulados = MESTRADO TITULADO FORA DO PRAZO
     * m_atitulados = ABANDONOU MESTRADO (DESLIGADO OU DESISTIU)
     *
     */
    const d_dtitulados =
      dados[0].TITULADO + dados[0]["MUDANCA DE NÍVEL COM DEFESA"];
    const d_ftitulados =
      dados[1].TITULADO + dados[1]["MUDANCA DE NÍVEL COM DEFESA"];
    const d_atitulados =
      dados[0].DESLIGADO +
      dados[1].DESLIGADO +
      dados[0].ABANDONOU +
      dados[1].ABANDONOU;

    const m_dtitulados =
      dados[2].TITULADO + dados[2]["MUDANCA DE NÍVEL COM DEFESA"];
    const m_ftitulados =
      dados[3].TITULADO + dados[3]["MUDANCA DE NÍVEL COM DEFESA"];
    const m_atitulados =
      dados[2].DESLIGADO +
      dados[3].DESLIGADO +
      dados[2].ABANDONOU +
      dados[3].ABANDONOU;

    //<div id="pb-mestrado-dentro" class="progress-bar bg-primary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"><span class="visually-hidden">60%</span></div>
    let div_mest_dentro = document.getElementById("pb-mestrado-dentro");
    let span_mest_dentro = document.getElementById("span-mestrado-dentro");

    let div_mest_fora = document.getElementById("pb-mestrado-fora");
    let span_mest_fora = document.getElementById("span-mestrado-fora");

    let div_mest_desligado = document.getElementById("pb-mestrado-desligado");
    let span_mest_desligado = document.getElementById(
      "span-mestrado-desligado",
    );

    let total_mest = m_dtitulados + m_ftitulados + m_atitulados;
    let perc;
    if (total_mest > 0) {
      perc = (m_dtitulados * 100) / total_mest;
      div_mest_dentro.setAttribute("aria-valuenow", perc);
      div_mest_dentro.style = "width: " + perc.toFixed(2) + "%";
      span_mest_dentro.innerHTML = "" + perc.toFixed(2) + "%";

      perc = (m_ftitulados * 100) / total_mest;
      div_mest_fora.setAttribute("aria-valuenow", perc);
      div_mest_fora.style = "width: " + perc.toFixed(2) + "%";
      span_mest_fora.innerHTML = "" + perc.toFixed(2) + "%";

      perc = (m_atitulados * 100) / total_mest;
      div_mest_desligado.setAttribute("aria-valuenow", perc);
      div_mest_desligado.style = "width: " + perc.toFixed(2) + "%";
      span_mest_desligado.innerHTML = "" + perc.toFixed(2) + "%";
    } else {
      perc = 0.0;
      div_mest_dentro.setAttribute("aria-valuenow", perc);
      div_mest_dentro.style = "width: " + perc.toFixed(2) + "%";
      span_mest_dentro.innerHTML = "" + perc.toFixed(2) + "%";

      div_mest_fora.setAttribute("aria-valuenow", perc);
      div_mest_fora.style = "width: " + perc.toFixed(2) + "%";
      span_mest_fora.innerHTML = "" + perc.toFixed(2) + "%";

      div_mest_desligado.setAttribute("aria-valuenow", perc);
      div_mest_desligado.style = "width: " + perc.toFixed(2) + "%";
      span_mest_desligado.innerHTML = "" + perc.toFixed(2) + "%";
    }
    let span = document.getElementById("qdade-orientados-mestrado");
    span.innerHTML = "" + total_mest;

    let div_dot_dentro = document.getElementById("pb-doutorado-dentro");
    let span_dot_dentro = document.getElementById("span-doutorado-dentro");

    let div_dot_fora = document.getElementById("pb-doutorado-fora");
    let span_dot_fora = document.getElementById("span-doutorado-fora");

    let div_dot_desligado = document.getElementById("pb-doutorado-desligado");
    let span_dot_desligado = document.getElementById(
      "span-doutorado-desligado",
    );

    let total_dot = d_dtitulados + d_ftitulados + d_atitulados;
    //console.log(total_mest);
    if (total_dot > 0) {
      perc = (d_dtitulados * 100) / total_dot;
      div_dot_dentro.setAttribute("aria-valuenow", perc);
      div_dot_dentro.style = "width: " + perc.toFixed(2) + "%";
      span_dot_dentro.innerHTML = "" + perc.toFixed(2) + "%";

      perc = (d_ftitulados * 100) / total_dot;
      div_dot_fora.setAttribute("aria-valuenow", perc);
      div_dot_fora.style = "width: " + perc.toFixed(2) + "%";
      span_dot_fora.innerHTML = "" + perc.toFixed(2) + "%";

      perc = (d_atitulados * 100) / total_mest;
      div_dot_desligado.setAttribute("aria-valuenow", perc);
      div_dot_desligado.style = "width: " + perc.toFixed(2) + "%";
      span_dot_desligado.innerHTML = "" + perc.toFixed(2) + "%";
    } else {
      perc = 0.0;
      div_dot_dentro.setAttribute("aria-valuenow", perc);
      div_dot_dentro.style = "width: " + perc.toFixed(2) + "%";
      span_dot_dentro.innerHTML = "" + perc.toFixed(2) + "%";

      div_dot_fora.setAttribute("aria-valuenow", perc);
      div_dot_fora.style = "width: " + perc.toFixed(2) + "%";
      span_dot_fora.innerHTML = "" + perc.toFixed(2) + "%";

      div_dot_desligado.setAttribute("aria-valuenow", perc);
      div_dot_desligado.style = "width: " + perc.toFixed(2) + "%";
      span_dot_desligado.innerHTML = "" + perc.toFixed(2) + "%";
    }
    span = document.getElementById("qdade-orientados-doutorado");
    span.innerHTML = "" + total_dot;
  }
  // }).catch(error => {
  //   console.error('Error fetching range years: ', error);
  // });
}

function exibirGraficoLattesDesatualizado(idCanvas, lattes) {
  const lattesdocs = lattes;
  renderizarGraficoAtualizacao(idCanvas, lattesdocs);
}

const exibirGraficoProducaoPorLinhaPesquisa = (data) => {
  const elem = document.getElementById("chartresearchlinesdata");
  elem.innerHTML = "";
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = 800 - margin.left - margin.right;
  let height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select("#chartresearchlinesdata")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const sankey = d3
    .sankey()
    .nodeId((d) => d.name)
    .nodeAlign(d3.sankeyLeft)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ]);

  const { nodes, links } = sankey({
    nodes: data.nodes.map((d) => Object.assign({}, d)),
    links: data.links.map((d) => Object.assign({}, d)),
  });

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  rect
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => {
      if (d.category === "linha") return color(d.name);
      return color(d.category);
    })
    .attr("stroke", "#000");

  rect.append("title").text((d) => {
    return `${d.name}:\n${d.value}`;
  });

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .enter()
    .append("g")
    .style("mix-blend-mode", "multiply");

  link
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => {
      if (d.target.category === "linha") return color(d.target.name);
      return color(d.target.category);
    })
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${d.value}`);

  svg
    .append("g")
    .selectAll()
    .data(nodes)
    .enter()
    .append("text")
    .attr("font-size", 10)
    .attr("x", (d) => {
      if (d.category === "subtipo") return d.x0 - 8;
      return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6;
    })
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => {
      if (d.category === "subtipo") return "end";
      return d.x0 < width / 2 ? "start" : "end";
    })
    .text((d) => {
      return d.name;
    });
}

const exibirGraficoProjetosPorLinhaPesquisa = (data) => {
  const elem = document.getElementById("chartprojectsresearchlinesdata");
  elem.innerHTML = "";

  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = 800 - margin.left - margin.right;
  let height = 800 - margin.top - margin.bottom;

  const svg = d3
    .select("#chartprojectsresearchlinesdata")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const sankey = d3
    .sankey()
    .nodeId((d) => d.name)
    .nodeAlign(d3.sankeyLeft)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ]);

  const { nodes, links } = sankey({
    nodes: data.nodes.map((d) => Object.assign({}, d)),
    links: data.links.map((d) => Object.assign({}, d)),
  });

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  rect
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => {
      if (d.category === "linha") return color(d.name);
      return color(d.category);
    })
    .attr("stroke", "#000");

  rect.append("title").text((d) => {
    if (d.value == 50) return `${d.name}:\n+ de ${d.value} trabalhos`;
    else if (d.value == 1) return `${d.name}`;
    return `${d.name}:\n${d.value}`;
  });

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .enter()
    .append("g")
    .style("mix-blend-mode", "multiply");

  link
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => {
      if (d.target.category === "linha") return color(d.target.name);
      return color(d.target.category);
    })
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${d.value}`);

  svg
    .append("g")
    .selectAll()
    .data(nodes)
    .enter()
    .append("text")
    .attr("font-size", 10)
    .attr("x", (d) => {
      return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6;
    })
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => {
      return d.x0 < width / 2 ? "start" : "end";
    })
    .text((d) => {
      if (d.category === "projeto")
        if (d.name.length > 40) {
          return d.name.substring(0, 40) + "..."; // Retorna os primeiros 20 caracteres
        } else {
          return d.name; // Se a string for menor ou igual a 20 caracteres, retorna a string original
        }
      return d.name;
    });
}

const fetchDadosProjetosLattes = (data) => {
  const elem = document.getElementById("chartprojectsdata");
  elem.innerHTML = "";

  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = 800 - margin.left - margin.right;
  let height = 0;
  let tamanho_card = 1800 * (data.nodes.length / 180);
  if (tamanho_card < 1800) height = 1800 - margin.top - margin.bottom;
  else height = tamanho_card - margin.top - margin.bottom;

  const svg = d3
    .select("#chartprojectsdata")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const sankey = d3
    .sankey()
    .nodeId((d) => d.name)
    .nodeAlign(d3.sankeyLeft)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ]);

  const { nodes, links } = sankey({
    nodes: data.nodes.map((d) => Object.assign({}, d)),
    links: data.links.map((d) => Object.assign({}, d)),
  });

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  rect
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => color(d.category))
    .attr("stroke", "#000");

  rect.append("title").text((d) => {
    if (d.name.startsWith("projeto")) return `${d.name}: ${d.titulo}`;
    else if (
      d.name == "graduação" ||
      d.name == "mestrado" ||
      d.name == "doutorado"
    )
      return `Alunos de ${d.name} participantes:\n${d.value}`;
    else if (d.name == "com produção" || d.name == "sem produção")
      return `${d.name} associada:\n${d.value}`;
    return `${d.name}:\n${d.value}`;
  });

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .enter()
    .append("g")
    .style("mix-blend-mode", "multiply");

  link
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => color(d.target.category))
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${d.value}`);

  svg
    .append("g")
    .selectAll()
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => {
      if (d.name.startsWith("projeto")) return "";
      return d.name;
    });
}

function fetchTCCsResearchLinesData(dados) {
  const data = dados;
  const elem = document.getElementById("charttccsresearchlinesdata");
  elem.innerHTML = "";

  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = 800 - margin.left - margin.right;
  let height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select("#charttccsresearchlinesdata")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const sankey = d3
    .sankey()
    .nodeId((d) => d.name)
    .nodeAlign(d3.sankeyLeft)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ]);

  const { nodes, links } = sankey({
    nodes: data.nodes.map((d) => Object.assign({}, d)),
    links: data.links.map((d) => Object.assign({}, d)),
  });

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  rect
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => {
      if (d.category === "linha") return color(d.name);
      return color(d.category);
    })
    .attr("stroke", "#000");

  rect.append("title").text((d) => {
    return `${d.name}:\n${d.value}`;
  });

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .enter()
    .append("g")
    .style("mix-blend-mode", "multiply");

  link
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => {
      if (d.target.category === "linha") return color(d.target.name);
      return color(d.target.category);
    })
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${d.value}`);

  svg
    .append("g")
    .selectAll()
    .data(nodes)
    .enter()
    .append("text")
    .attr("font-size", 10)
    .attr("x", (d) => {
      if (d.category === "subtipo") return d.x0 - 8;
      return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6;
    })
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => {
      if (d.category === "subtipo") return "end";
      return d.x0 < width / 2 ? "start" : "end";
    })
    .text((d) => {
      return d.name;
    });
}

function fetchTCCsProductionsData(idCanvas, dados) {
  try {
    const listProductions = dados.produtos;
    renderChartTCCsProductions_(idCanvas, listProductions);
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchTCCsProductionsTiposData(idCanvas, dados) {
  try {
    const listProductions = dados.tccs_com_producoes;
    const medias = dados.medias;
    renderChartTCCsProductions_tipos(idCanvas, listProductions, medias);
  } catch {
    // GeraToast(dados.detail || e);
  }
}

function fetchTCCsArtigosData(idCanvas, dados) {
  try {
    const listProductions = dados.tccs_com_qualis;
    renderChartTCCsArtigos(idCanvas, listProductions);
  } catch {
    // GeraToast(dados.detail);
  }
}

function fetchTCCsLivrosData(idCanvas, dados) {
  try {
    const listProductions = dados.tccs_com_livros;
    renderizarGraficoTCCsLivros(idCanvas, listProductions);
  } catch {
    // GeraToast(dados.detail);
  }
}


const exibirParticipantesExternos = (infoBancas) => {
  let data = {
    "name": "Participações em PPGs",
    "value": infoBancas.participa_ppg["Não"] + infoBancas.participa_ppg["Sim"],
    "children": [
      {
        "name": "Não",
        "value": infoBancas.participa_ppg["Não"]
      },
      {
        "name": "Sim",
        "value": infoBancas.participa_ppg["Sim"],
        "children": Object.keys(infoBancas.tipo_participacao_ppg)
          .filter(key => key !== "Nenhum")
          .map(key => ({
            "name": key,
            "value": infoBancas.tipo_participacao_ppg[key]
          }))
      }
    ]
  };

  let width = 1000;
  let height = 500;
  let margin = { top: 20, right: 200, bottom: 20, left: 250 };
  let innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;

  let tree = d3.tree()
    .size([innerHeight, innerWidth]);

  let root = d3.hierarchy(data)
    .sum(function (d) { return d.value || 0; });

  tree(root);

  let svg = d3.select("#grafico-categoria").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "mx-auto")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let link = svg.selectAll(".link")
    .data(root.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .attr("stroke", "#ccc")
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("d", function (d) {
      return "M" + d.y + "," + d.x
        + "C" + (d.parent.y + 100) + "," + d.x
        + " " + (d.parent.y + 100) + "," + d.parent.x
        + " " + d.parent.y + "," + d.parent.x;
    });

  let node = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("pointer-events", "none")
    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

  node.append("circle")
    .attr("r", 8)
    .attr("fill", "#2563eb");

  node.append("text")
    .attr("dy", 3)
    .attr("font-size", "12px")
    .attr("x", function (d) { return d.children ? -8 : 8; })
    .style("text-anchor", function (d) { return d.children ? "end" : "start"; })
    .text(function (d) { return d.data.name + " (" + (d.data.value || "0") + ")"; });

  const ctxGrauAcademico = document.getElementById("grafico-grau-academico").getContext("2d");
  const ctxPaisOrigem = document.getElementById("grafico-pais-origem").getContext("2d");
  const ctxPaisTitulacao = document.getElementById("grafico-pais-titulacao").getContext("2d");
  const ctxAreaTitulacao = document.getElementById("grafico-area-titulacao").getContext("2d");

  criaGraficoPizza(
    ctxGrauAcademico,
    Object.keys(infoBancas.grau_academico),
    Object.values(infoBancas.grau_academico),
    "Grau Acadêmico"
  );

  criaGraficoPizza(
    ctxPaisOrigem,
    Object.keys(infoBancas.pais_origem),
    Object.values(infoBancas.pais_origem),
    "País de Origem"
  );

  criaGraficoPizza(
    ctxPaisTitulacao,
    Object.keys(infoBancas.pais_titulacao),
    Object.values(infoBancas.pais_titulacao),
    "País de Titulação"
  );

  criaGraficoPizza(
    ctxAreaTitulacao,
    Object.keys(infoBancas.area_titulacao),
    Object.values(infoBancas.area_titulacao),
    "Área de Titulação"
  );
}

const buscaSimulacaoQualisPPG = (idCanvasQualis) => {
  const element = "#col-simulacao-qualis";

  let checkboxes = document.getElementsByName("chkdocentes");
  let selectedCboxes = Array.prototype.slice
    .call(checkboxes)
    .filter((ch) => ch.checked == false);

  let blacklist = selectedCboxes.map((ch) => ch.value);

  if (blacklist.length === 0) {
    axios
      .get(
        `/ppg/grafico/simulacao/indicadores/artigosqualis/${anoInicio}/${anoFim}`,
      )
      .then((response) => {
        const listQualisProductions = response.data.produtos;
        renderChartQualis_simulacao(idCanvasQualis, listQualisProductions);
        $(element).waitMe("hide");
      })
      .catch((error) => {
        console.error("Error fetching list qualis: ", error);
      });
  } else {
    axios
      .post(
        `/ppg/grafico/simulacao/indicadores/artigosqualis/${anoInicio}/${anoFim}`,
        {
          lista_negra: blacklist,
        },
      )
      .then((response) => {
        const listaProducaoQualis = response.data.produtos;
        renderChartQualis_simulacao(idCanvasQualis, listaProducaoQualis);
      })
      .catch((error) => {
        console.error("Error fetching list qualis: ", error);
      });
  }
}

function insere_tabela(lista, anofinal) {
  const nome_ppg = fetchNomePPG();
  let tabela = document.getElementById("tabela-indprods");

  // const chaves = lista['rotulos'];
  // let anos = [...new Set(Object.keys(lista.indprods))].sort();

  // tabela.innerHTML = '';

  // let html = '';

  // anos.forEach(function(ano, i) {
  //   if(ano !== anofinal.toString()){
  //     html+=`
  //       <div class="container">
  //       <div class="row">
  //           <div class="col">
  //               <div class="card">
  //                   <div class="card-body">
  //                       <h4 class="card-title">${ano}</h4>
  //                       <div class="table-responsive text-start">
  //                           <table class="table table-sm">
  //                               <thead>
  //                                   <tr>
  //                                       <th>Programas</th>
  //                                       <th>IndProdArt</th>
  //                                       <th># Docentes</th>
  //                                   </tr>
  //                               </thead>
  //                               <tbody>`;

  //     html += `<tr>
  //           <td>${nome_ppg}</td>
  //           <td>${lista['indprods'][ano].toFixed(3)}</td>
  //           <td>${lista['permanentes'][ano]}</td>
  //         </tr>`;

  //     for(let i = 0; i < chaves.length; i++ ) {
  //       lista[chaves[i]].forEach(function(item, k) {
  //         if(ano === item.ano.toString()){
  //           if(chaves[i] === 'região')
  //             html += `<tr>
  //                 <td>${lista['nome_regiao']}</td>
  //                 <td>${item.indprodall.toFixed(3)}</td>
  //                 <td>${item.permanentes.toFixed(3)}</td>
  //             </tr>`;
  //           else if(chaves[i] === 'país')
  //             html += `<tr>
  //                       <td>País</td>
  //                       <td>${item.indprodall.toFixed(3)}</td>
  //                       <td>${item.permanentes.toFixed(3)}</td>
  //                   </tr>`;
  //           else
  //             html += `<tr>
  //                     <td>Nota ${chaves[i]}</td>
  //                     <td>${item.indprodall.toFixed(3)}</td>
  //                     <td>${item.permanentes.toFixed(3)}</td>
  //                 </tr>`;
  //         }
  //       });

  //     }

  //       html += `                 </tbody>
  //                             </table>
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //       </div>`;

  //   }
  // });

  // tabela.innerHTML += html;
}

function fetch_simulacao_indprods_ppg(idCanvasIndprods) {
  const element = "#col-simulacao-indprod";
  $(element).waitMe("show");

  let checkboxes = document.getElementsByName("chkdocentes");
  let selectedCboxes = Array.prototype.slice
    .call(checkboxes)
    .filter((ch) => ch.checked == false);

  let blacklist = selectedCboxes.map((ch) => ch.value);

  if (blacklist.length === 0) {
    axios
      .get(
        `/ppg/grafico/simulacao/indicadores/indprodart/${anoInicio}/${anoFim}`,
      )
      .then((response) => {
        const listAvgIndProds = response.data.indprod;
        const indicadores = response.data.indicadores;
        renderChartIndprods_simulacao(
          idCanvasIndprods,
          listAvgIndProds,
          indicadores,
        );
        $(element).waitMe("hide");
        //insere_tabela(listAvgIndProds,ano_atual);
        $("#formula_indprod_simulacao")
          .html(`IndProdArt = (${listAvgIndProds.formula.A1}*A1 + ${listAvgIndProds.formula.A2}*A2 + ${listAvgIndProds.formula.A3}*A3
			+ ${listAvgIndProds.formula.A4}*A4 + ${listAvgIndProds.formula.B1}*B1
			+ ${listAvgIndProds.formula.B2}*B2 + ${listAvgIndProds.formula.B3}*B3 + ${listAvgIndProds.formula.B4}*B4)/DP`);
      })
      .catch((error) => {
        console.error("Error fetching list indprods: ", error);
      });
  } else {
    axios
      .post(
        `/ppg/grafico/simulacao/indicadores/indprodart/${anoInicio}/${anoFim}`,
        {
          lista_negra: blacklist,
        },
      )
      .then((response) => {
        const listAvgIndProds = response.data.indprod;
        const indicadores = response.data.indicadores;
        renderChartIndprods_simulacao(
          idCanvasIndprods,
          listAvgIndProds,
          indicadores,
        );
        $(element).waitMe("hide");
        //insere_tabela(listAvgIndProds, ano_atual);
        $("#formula_indprod_simulacao")
          .html(`IndProdArt = (${listAvgIndProds.formula.A1}*A1 + ${listAvgIndProds.formula.A2}*A2 + ${listAvgIndProds.formula.A3}*A3
			+ ${listAvgIndProds.formula.A4}*A4 + ${listAvgIndProds.formula.B1}*B1
			+ ${listAvgIndProds.formula.B2}*B2 + ${listAvgIndProds.formula.B3}*B3 + ${listAvgIndProds.formula.B4}*B4)/DP`);
      })
      .catch((error) => {
        console.error("Error fetching list indprods: ", error);
      });
  }
}

