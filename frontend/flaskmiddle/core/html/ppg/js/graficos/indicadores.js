let anoInicio;
let anoFim;

export const graficosIndicadores = async () => {
  anoInicio = 2017;
  anoFim = 2023;

  try {
    const resposta = await axios.get(
      `/ppg/graficos/indicadores-tab/${anoInicio}/${anoFim}`,
    );
    const dados = resposta.data;
    const idPpg = dados.id_ppg;
    const notaPpg = dados.nota_ppg;

    buscarQualisPpg("chartqualisproductions", dados.dadosqualis);
    buscarQualisDiscentePpg(
      "chartqualisdiscenteproductions",
      dados.dadosqualisdiscente,
    );
    buscarArtigosDiscentesPpg(
      "chartpercentqualisdiscente",
      dados.dadosartigosdiscente,
    );
    buscarIndprodsPpg("chartindprodsproductions", dados.dadosindprods);
    buscarIndprodsExtsupsPpg(
      "chartindprodextsupsproductions",
      dados.dadosextsup,
    );
    buscarPosicaoIndProd(dados.dadosposition, idPpg, notaPpg);
    buscarTempoDefesa("carttempodefesa", dados.dadostempodefesa);
    buscarEstudantesGraduados(
      "chartstudentsgraduated",
      dados.dadosestudantestitulados,
    );
    buscarPartDiss(
      "chartpartdis",
      dados.dadosavgpartdis,
      dados.dadospartdis,
      notaPpg,
    );
    buscarIndCoautorias(
      "chartindcoautoria",
      dados.dadosavgindcoautoria,
      dados.dadosindcoautoria,
      notaPpg,
    );
    buscarIndOris(
      "chartindori",
      dados.dadosavgindori,
      dados.dadosindori,
      notaPpg,
    );
    buscarIndDistOris(
      "chartinddistori",
      dados.dadosavginddistori,
      dados.dadosinddistori,
      notaPpg,
    );
    buscarIndAuts(
      "chartindaut",
      dados.dadosavgindaut,
      dados.dadosindaut,
      notaPpg,
    );
    buscarIndDiss(
      "chartinddis",
      dados.dadosavginddis,
      dados.dadosinddis,
      notaPpg,
    );

    const elementoSiglaIes = document.getElementById("sigla_ies");
    if (elementoSiglaIes) {
      elementoSiglaIes.textContent = sigla_ies;
    }

    const respostaCorrelatos = await axios.get(
      `/ppg/graficos/indicadores-tab-correlatos/${anoInicio}/${anoFim}`,
    );
    const dadosCorrelatos = respostaCorrelatos.data;
    buscarArtigosDiscentesPpgsCorrelatos(
      dadosCorrelatos.dadosartigosdiscentes_correlatos,
    );
  } catch (erro) {
    console.error("Erro ao buscar dados: ", erro);
  }
};

const buscarQualisPpg = (idCanvasQualis, dadosQualis) => {
  const { produtos, artigos } = dadosQualis;
  try {
    renderizarGraficoQualis(idCanvasQualis, produtos, artigos);
  } catch {}
};

const buscarQualisDiscentePpg = (idCanvasQualis, dados) => {
  try {
    renderChartQualis_discente(idCanvasQualis, dados.produtos);
  } catch {}
};

const buscarArtigosDiscentesPpg = (idCanvasArtigosDiscente, estatisticas) => {
  const atualizarIndicador = (id, valor) => {
    const elemento = document.getElementById(id);
    const porcentagem = `${((valor * 100) / estatisticas.total).toFixed(1)}%`;

    // Update the percentage description
    const descElement = document.getElementById(`${id}-desc`);
    if (descElement) {
      descElement.textContent = porcentagem;
    }

    // Update the width of the progress bar
    elemento.style.width = porcentagem;

    // Update the aria-valuenow attribute
    elemento.setAttribute(
      "aria-valuenow",
      ((valor * 100) / estatisticas.total).toFixed(1),
    );
  };
  atualizarIndicador("qualis-percent-indicador1", estatisticas["DiscentesA4+"]);
  atualizarIndicador("qualis-percent-indicador2", estatisticas["DiscentesB4+"]);
  atualizarIndicador("qualis-percent-indicador3", estatisticas["EgressosA4+"]);
  atualizarIndicador("qualis-percent-indicador4", estatisticas["EgressosB4+"]);
  atualizarIndicador(
    "qualis-percent-indicador5",
    estatisticas["ArtigosDocentesSemCoautoria"],
  );
  atualizarIndicador(
    "qualis-percent-indicador6",
    estatisticas["ArtigosDocentesComCoautoria"],
  );
  atualizarIndicador(
    "qualis-percent-indicador7",
    estatisticas["ArtigosDocentesNãoPermanentes"],
  );
  atualizarIndicador(
    "qualis-percent-indicador8",
    estatisticas["ArtigosExternos"],
  );
  atualizarIndicador(
    "qualis-percent-indicador9",
    estatisticas["ArtigosPosDocs"],
  );

  const qualisDiscente = estatisticas?.qualis_discente ?? {};
  const total = estatisticas?.total ?? 1;

  const chaves = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C"];
  const soma = chaves.reduce((sum, key) => sum + (qualisDiscente[key] || 0), 0);

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
    .select(`#${idCanvasArtigosDiscente}`)
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
};

const buscarIndprodsPpg = (idCanvasIndprods, dadosIndprods) => {
  try {
    const { indprod, indicadores } = dadosIndprods;
    renderChartIndprods_(idCanvasIndprods, indprod, indicadores);

    const formula = indprod.formula;

    const formulaString = `IndProdArt = (${formula.A1}*A1 + ${formula.A2}*A2 + ${formula.A3}*A3
    + ${formula.A4}*A4 + ${formula.B1}*B1
    + ${formula.B2}*B2 + ${formula.B3}*B3 + ${formula.B4}*B4)/DP`;

    document.getElementById("formula_indprod").innerHTML = formulaString;
  } catch {}
};

const buscarIndprodsExtsupsPpg = (idCanvasIndprodsExtsups, dadosExtsup) => {
  try {
    const { indprod, indicadores } = dadosExtsup;
    renderChartIndprodextsups_(idCanvasIndprodsExtsups, indprod, indicadores);
  } catch {}
};

const buscarMapaBrasil = (coordenadasCirculo, maior, menor, idPpg) => {
  const normaliza = (val, max, min) => {
    if (max - min === 0) return 1;
    return (val - min) / (max - min);
  };

  const width = 400;
  const height = 400;

  const svg = d3
    .select("#mapa-brasil")
    .attr("width", width)
    .attr("height", height);

  const projection = d3
    .geoMercator()
    .center([-55, -10])
    .scale(500)
    .translate([width / 2, height / 2 - 50]);

  const path = d3.geoPath().projection(projection);

  d3.json("/assets/js/br.json")
    .then(function (data) {
      const brasil = topojson.feature(data, data.objects.estados);

      svg
        .selectAll("path")
        .data(brasil.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#abc8e8")
        .attr("stroke", "white");

      const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

      svg.call(zoom);

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      svg
        .selectAll("circle")
        .data(coordenadasCirculo)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
        .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
        .attr("r", (d) => normaliza(d.indprod, maior, menor) * 15)
        .attr("fill", function (d) {
          if (d.id === idPpg) return "#a8a29e";
          else if (d.status === "Pública Federal") return "#c084fc";
          else if (d.status === "Pública Estadual") return "#22d3ee";
          return "#fbbf24";
        })
        .attr("stroke", "white")
        .attr("fill-opacity", 0.4)
        .on("mouseover", function (event, d) {
          d3.select(this).attr(
            "r",
            (d) => normaliza(d.indprod, maior, menor) * 20,
          );
          tooltip
            .style("opacity", 1)
            .html(
              `${d.nome}<br>${d.sigla} - ${d.status}<br>(${d.municipio}/${d.uf})<br>indProd: ${d.indprod.toFixed(3)}`,
            )
            .style("left", event.pageX - 80 + "px")
            .style("top", event.pageY - 80 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr(
            "r",
            (d) => normaliza(d.indprod, maior, menor) * 15,
          );
          tooltip.style("opacity", 0);
        });

      function zoomed(e) {
        const { transform } = e;
        svg.selectAll("path").attr("transform", transform);

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
            (d) => normaliza(d.indprod, maior, menor) * 15 * transform.k,
          )
          .on("mouseover", function (event, d) {
            d3.select(this).attr(
              "r",
              (d) => normaliza(d.indprod, maior, menor) * 20 * transform.k,
            );
            tooltip
              .style("opacity", 1)
              .html(
                `${d.nome}<br>${d.sigla} - ${d.status}<br>(${d.municipio}/${d.uf})<br>indProd: ${d.indprod.toFixed(3)}`,
              )
              .style("left", event.pageX - 80 + "px")
              .style("top", event.pageY - 80 + "px");
          })
          .on("mouseout", function () {
            d3.select(this).attr(
              "r",
              normaliza(d.indprod, maior, menor) * 15 * transform.k,
            );
            tooltip.style("opacity", 0);
          });
      }
    })
    .catch((error) => {
      console.error("Erro no mapa: ", error);
    });
};

const buscarPosicaoIndProd = (dadosPosicao, idPpg, notaPpg) => {
  const {
    indprods,
    maior_indprod: maiorIndProd,
    menor_indprod: menorIndProd,
  } = dadosPosicao;
  try {
    document.getElementById("text-chartpositionindprod").textContent =
      `Posicionamento do PPG em relação a outros nota ${notaPpg} da área`;

    document.getElementById("text-chartpositionindprod").textContent =
      `Comparação do indicador Média ponderada de artigos (IndArtigo) por DPs e por ano do PPG com os programas nota ${notaPpg} no período de ${anoInicio} - ${anoFim}`;

    renderChartPositionIndProd(dadosPosicao, idPpg);
    buscarMapaBrasil(indprods, maiorIndProd, menorIndProd, idPpg);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const buscarTempoDefesa = (idCanvas, dadosTempoDefesa) => {
  try {
    renderChartTimesConclusions(idCanvas, dadosTempoDefesa);
  } catch {}
};

const buscarEstudantesGraduados = (idCanvas, dadosEstudantesGraduados) => {
  renderChartStudentsGraduated(idCanvas, dadosEstudantesGraduados);
};

const buscarPartDiss = (
  idCanvasPartDis,
  dadosMediaParteDis,
  dadosParteDis,
  notaPpg,
) => {
  const { partdis, indicadores } = dadosParteDis;
  renderChartPartDiss(
    idCanvasPartDis,
    partdis,
    dadosMediaParteDis,
    indicadores,
    notaPpg,
  );
};

const buscarIndCoautorias = (
  idCanvasIndCoautoria,
  dadosMediaIndCoautoria,
  dadosIndCoautoria,
  notaPpg,
) => {
  const { indcoaut, indicadores } = dadosIndCoautoria;

  renderChartIndCoautorias(
    idCanvasIndCoautoria,
    indcoaut,
    dadosMediaIndCoautoria,
    indicadores,
    notaPpg,
  );
};

const buscarIndOris = (idCanvas, dadosavg, dadosindori, nota_ppg) => {
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
  } catch (erro) {
    console.error(erro);
  }
};

const buscarIndDistOris = (
  idCanvasIndDistOri,
  dadosMediaIndDistOri,
  dadosIndDistOri,
  notaPpg,
) => {
  try {
    const { inddistori: listaIndDistOri, indicadores } = dadosIndDistOri;
    renderChartIndDistOris(
      idCanvasIndDistOri,
      listaIndDistOri,
      dadosMediaIndDistOri,
      indicadores,
      notaPpg,
    );
  } catch (erro) {
    console.error(erro);
  }
};

const buscarIndAuts = (
  idCanvasIndAut,
  dadosMediaIndAut,
  dadosIndAut,
  notaPpg,
) => {
  try {
    const { indaut: listaIndAut, indicadores } = dadosIndAut;
    renderChartIndAuts(
      idCanvasIndAut,
      listaIndAut,
      dadosMediaIndAut,
      indicadores,
      notaPpg,
    );
  } catch {}
};

const buscarIndDiss = (
  idCanvasIndDis,
  dadosMediaIndDis,
  dadosIndDis,
  notaPpg,
) => {
  try {
    const { inddis: listaIndDiss, indicadores } = dadosIndDis;
    renderChartIndDiss(
      idCanvasIndDis,
      listaIndDiss,
      dadosMediaIndDis,
      indicadores,
      notaPpg,
    );
  } catch {}
};

const buscarArtigosDiscentesPpgsCorrelatos = (estatisticas) => {
  try {
    const atualizarIndicador = (id, valor) => {
      const elemento = document.getElementById(id);
      const elementoDescricao = document.getElementById(`${id}-desc`);
      const spanElemento = elemento ? elemento.querySelector("span") : null;

      const percentual = `${valor.toFixed(1)}%`;

      if (elementoDescricao) elementoDescricao.textContent = percentual;
      if (elemento) {
        elemento.style.width = percentual;
        elemento.setAttribute("aria-valuenow", valor.toFixed(1));
      }
      if (spanElemento) spanElemento.textContent = percentual;
    };

    atualizarIndicador(
      "qualis-percent-correlatos-indicador1",
      estatisticas["DiscentesA4+"],
    );
    atualizarIndicador(
      "qualis-percent-correlatos-indicador2",
      estatisticas["DiscentesB4+"],
    );
    atualizarIndicador(
      "qualis-percent-correlatos-indicador3",
      estatisticas["EgressosA4+"],
    );
    atualizarIndicador(
      "qualis-percent-correlatos-indicador4",
      estatisticas["EgressosB4+"],
    );
    atualizarIndicador(
      "qualis-percent-correlatos-indicador5",
      estatisticas["ArtigosDocentesSemCoautoria"],
    );
    atualizarIndicador(
      "qualis-percent-correlatos-indicador6",
      estatisticas["ArtigosDocentesComCoautoria"],
    );
    atualizarIndicador(
      "qualis-percent-correlatos-indicador7",
      estatisticas["ArtigosDocentesNãoPermanentes"],
    );
    atualizarIndicador(
      "qualis-percent-correlatos-indicador8",
      estatisticas["ArtigosExternos"],
    );
    atualizarIndicador(
      "qualis-percent-correlatos-indicador9",
      estatisticas["ArtigosPosDocs"],
    );
  } catch (erro) {
    console.error("Ocorreu um erro:", erro);
  }
};
