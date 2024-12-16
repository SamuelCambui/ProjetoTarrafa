export const graficosBancasTCCs = () => {
  const gerarGraficos = async (anoInicio, anoFim) => {
    try {
      const response = await axios.get(
        `/ppg/graficos/bancas-tab/${anoInicio}/${anoFim}`,
      );
      const {
        tccproducao: tccProducao,
        produtos,
        bancasexternos: bancasExternos,
      } = response.data;

      exibirGraficoLinhasPesquisa(tccProducao);
      exibirGraficoProdutosVinculados("charttccsproductions", produtos);
      exibirGraficoPorLinhaDePesquisa("charttccsproductions-tipos", produtos);
      exibirGraficoArtigosComQualis("chartartigostccs", produtos);
      exibirGraficosLivros("chartlivrostccs", produtos);
      atualizarDadosBancas(bancasExternos);
      exibirParticipantesExternos(bancasExternos);
    } catch (error) {
      console.error("Erro ao buscar dados de bancas-tab: ", error);
    }
  };

  const atualizarDadosBancas = (infoBancas) => {
    const quantidadeBancas = document.getElementById("quantidade-bancas");
    const quantidadeInternos = document.getElementById("quantidade-internos");
    const quantidadeExternos = document.getElementById("quantidade-externos");

    if (quantidadeBancas)
      quantidadeBancas.innerText = infoBancas.quantidade_bancas;
    if (quantidadeInternos)
      quantidadeInternos.innerText = infoBancas.quantidade_internos;
    if (quantidadeExternos)
      quantidadeExternos.innerText = infoBancas.quantidade_externos;
  };

  const exibirGraficoLinhasPesquisa = (data) => {
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
  };

  const exibirGraficoPorLinhaDePesquisa = (idCanvas, dados) => {
    try {
      renderChartTCCsProductions_tipos(
        idCanvas,
        dados.tccs_com_producoes,
        dados.medias,
      );
    } catch {
      // GeraToast(dados.detail || e);
    }
  };

  const exibirGraficoArtigosComQualis = (idCanvas, dados) => {
    try {
      const listProductions = dados.tccs_com_qualis;
      renderChartTCCsArtigos(idCanvas, listProductions);
    } catch {
      // GeraToast(dados.detail);
    }
  }

  const exibirGraficosLivros = (idCanvas, dados) => {
    try {
      const listProductions = dados.tccs_com_livros;
      renderizarGraficoTCCsLivros(idCanvas, listProductions);
    } catch {
      // GeraToast(dados.detail);
    }
  }

  const exibirGraficoProdutosVinculados = (idCanvas, dados) => {
    try {
      renderChartTCCsProductions_(idCanvas, dados.produtos);
    } catch {}
  };

  const exibirParticipantesExternos = (infoBancas) => {
    // Remove o gráfico anterior, se existir
    d3.select("#grafico-categoria").select("svg").remove();

    let data = {
      name: "Participações em PPGs",
      value: infoBancas.participa_ppg["Não"] + infoBancas.participa_ppg["Sim"],
      children: [
        {
          name: "Não",
          value: infoBancas.participa_ppg["Não"],
        },
        {
          name: "Sim",
          value: infoBancas.participa_ppg["Sim"],
          children: Object.keys(infoBancas.tipo_participacao_ppg)
            .filter((key) => key !== "Nenhum")
            .map((key) => ({
              name: key,
              value: infoBancas.tipo_participacao_ppg[key],
            })),
        },
      ],
    };

    let width = 1000;
    let height = 500;
    let margin = { top: 20, right: 200, bottom: 20, left: 250 };
    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;

    let tree = d3.tree().size([innerHeight, innerWidth]);

    let root = d3.hierarchy(data).sum(function (d) {
      return d.value || 0;
    });

    tree(root);

    let svg = d3
      .select("#grafico-categoria")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "mx-auto")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let link = svg
      .selectAll(".link")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("stroke", "#ccc")
      .attr("fill", "none")
      .attr("stroke-width", "3px")
      .attr("d", function (d) {
        return (
          "M" +
          d.y +
          "," +
          d.x +
          "C" +
          (d.parent.y + 100) +
          "," +
          d.x +
          " " +
          (d.parent.y + 100) +
          "," +
          d.parent.x +
          " " +
          d.parent.y +
          "," +
          d.parent.x
        );
      });

    let node = svg
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("pointer-events", "none")
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    node.append("circle").attr("r", 8).attr("fill", "#2563eb");

    node
      .append("text")
      .attr("dy", 3)
      .attr("font-size", "12px")
      .attr("x", function (d) {
        return d.children ? -8 : 8;
      })
      .style("text-anchor", function (d) {
        return d.children ? "end" : "start";
      })
      .text(function (d) {
        return d.data.name + " (" + (d.data.value || "0") + ")";
      });

    const ctxGrauAcademico = document
      .getElementById("grafico-grau-academico")
      .getContext("2d");
    const ctxPaisOrigem = document
      .getElementById("grafico-pais-origem")
      .getContext("2d");
    const ctxPaisTitulacao = document
      .getElementById("grafico-pais-titulacao")
      .getContext("2d");
    const ctxAreaTitulacao = document
      .getElementById("grafico-area-titulacao")
      .getContext("2d");

    // Destroi gráficos anteriores, se existirem
    if (window.myGrauAcademicoChart) window.myGrauAcademicoChart.destroy();
    if (window.myPaisOrigemChart) window.myPaisOrigemChart.destroy();
    if (window.myPaisTitulacaoChart) window.myPaisTitulacaoChart.destroy();
    if (window.myAreaTitulacaoChart) window.myAreaTitulacaoChart.destroy();

    // Cria novos gráficos
    window.myGrauAcademicoChart = criaGraficoPizza(
      ctxGrauAcademico,
      Object.keys(infoBancas.grau_academico),
      Object.values(infoBancas.grau_academico),
      "Grau Acadêmico",
    );

    window.myPaisOrigemChart = criaGraficoPizza(
      ctxPaisOrigem,
      Object.keys(infoBancas.pais_origem),
      Object.values(infoBancas.pais_origem),
      "País de Origem",
    );

    window.myPaisTitulacaoChart = criaGraficoPizza(
      ctxPaisTitulacao,
      Object.keys(infoBancas.pais_titulacao),
      Object.values(infoBancas.pais_titulacao),
      "País de Titulação",
    );

    window.myAreaTitulacaoChart = criaGraficoPizza(
      ctxAreaTitulacao,
      Object.keys(infoBancas.area_titulacao),
      Object.values(infoBancas.area_titulacao),
      "Área de Titulação",
    );
  };

  return {
    gerarGraficos,
  };
};
