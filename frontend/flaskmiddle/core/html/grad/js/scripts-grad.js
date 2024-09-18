Chart.register(ChartDataLabels);

Chart.defaults.font.size = 10;

/**
 * Renderiza um gráfico na tela
 * @param { string } idChart ID da tag que será montado o gráfico
 * @param { Object } chartData Dados do Gráfico
 * @param { 'line'| 'bar'| 'doughnut'| 'bubble'| 'polarArea'| 'radar'| 'scatter' } chartData.type Tipo do gráfico
 * @param { Object } chartData.data Tipo do gráfico
 * @param { string[] } chartData.data.labels Tipo do gráfico
 * @param { Array.<{
 *  label:string,
 *  data: number[],
 * }> } chartData.data.datasets Dados do Gráfico
 * @param { Array.<{
 *  type?: 'line'| 'bar'| 'doughnut'| 'bubble'| 'polarArea'| 'radar'| 'scatter',
 *  xAxisID?: string,
 *  yAxisID?: string,
 *  backgroundColor?: Color | Color[],
 *  borderColor?: Color | Color[],
 *  borderWidth?: number | number[],
 *  borderDash?: number[],
 *  borderDashOffset?: number,
 *  borderCapStyle?: string,
 *  borderJoinStyle?: string,
 *  cubicInterpolationMode?: string,
 *  fill?: boolean | string,
 *  lineTension?: number,
 *  pointBackgroundColor?: Color | Color[],
 *  pointBorderColor?: Color | Color[],
 *  pointBorderWidth?: number | number[],
 *  pointRadius?: number | number[],
 *  pointStyle?: string | string[] | Image | Image[],
 *  pointHitRadius?: number | number[],
 *  pointHoverBackgroundColor?: Color | Color[],
 *  pointHoverBorderColor?: Color | Color[],
 *  pointHoverBorderWidth?: number | number[],
 *  pointHoverRadius?: number | number[],
 *  showLine?: boolean,
 *  spanGaps?: boolean,
 *  steppedLine?: boolean | string
 * }> } datasetOptions Opções de configuração de cada dataset na ordem passada em charData
 * @param { Object } chartOptions Opções de configuração do Gráfico
 * @param { Object } layout Opções de configuração de layout do Gráfico
 * @returns { Chart }
 */
export const renderChart = (
  idChart,
  chartData,
  datasetOptions,
  chartOptions,
  layout,
) => {
  const {
    data: { datasets },
  } = chartData;
  let datasetsChart = datasets;
  if (datasetOptions) {
    datasetsChart = datasets.map((dataset, index) => {
      return {
        ...dataset,
        ...datasetOptions[index],
      };
    });
  }
  const canvas = document.getElementById(idChart);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  return new Chart(ctx, {
    ...chartData,
    data: {
      labels: chartData.data.labels,
      datasets: datasetsChart,
    },
    options: {
      ...chartOptions,
    },
    layout: { ...layout },
  });
};

export const CHART_COLORS = {
  pink: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
  red: "rgb(139, 0, 0)",
  lightGreen: "rgb(144, 238, 144)",
  darkBlue: "rgb(0, 0, 139)",
  gold: "rgb(255, 215, 0)",
  brown: "rgb(165, 42, 42)",
  cyan: "rgb(0, 255, 255)",
  magenta: "rgb(255, 0, 255)",
  lime: "rgb(0, 255, 0)",
  teal: "rgb(0, 128, 128)",
  navy: "rgb(0, 0, 128)",
  maroon: "rgb(128, 0, 0)",
  olive: "rgb(128, 128, 0)",
  lavender: "rgb(230, 230, 250)",
  coral: "rgb(255, 127, 80)",
  salmon: "rgb(250, 128, 114)",
  indigo: "rgb(75, 0, 130)",
  beige: "rgb(245, 245, 220)",
  mint: "rgb(189, 252, 201)",
  peach: "rgb(255, 218, 185)",
  turquoise: "rgb(64, 224, 208)",
  violet: "rgb(238, 130, 238)",
  chartreuse: "rgb(127, 255, 0)",
  khaki: "rgb(240, 230, 140)",
  plum: "rgb(221, 160, 221)",
  sienna: "rgb(160, 82, 45)"
};

export const carregaGraficoMapaBrasil = (dados) => {
  const container = d3.select("#mapa-brasil-container");
  const width = container.node().getBoundingClientRect().width;
  const height = 800;

  // Selecionar o elemento SVG
  const svg = d3
    .select("#mapa-brasil")
    .attr("width", width)
    .attr("height", height);

  // Configurar uma projeção para o mapa
  const projection = d3
    .geoMercator()
    .center([-55, -10]) // Coordenadas aproximadas do centro do Brasil
    .scale(900) // Fator de escala para ajustar o tamanho do mapa
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

      const resetZoom = () => {
        svg.transition().duration(650).call(zoom.transform, d3.zoomIdentity); // Resetar para a identidade (sem transformação)
      };

      d3.select("#reset-zoom").on("click", resetZoom);

      // Funçao que delimita a escala do tamanho dos círculos
      const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(dados, (d) => d.quantidade_alunos)]) // Entrada: valores de alunos
        .range([3, 30]); // Saída: raio mínimo e máximo dos círculos

      // Create or select the tooltip element
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("font-size", "12px") // Tamanho da fonte do texto
        .style("color", "rgba(255, 255, 255, 0.8)") // Cor do texto
        .style("background-color", "rgba(34, 34, 34, 0.8)") // Cor do plano de fundo
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("pointer-events", "none") // Evitar interferência no mouse
        .style("opacity", 0); // Inicialmente invisível

      // Renderizar os círculos e adicionar tooltips
      svg
        .selectAll("circle")
        .data(dados)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
        .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
        .attr("r", (d) => radiusScale(d.quantidade_alunos))
        .attr("fill", "blue")
        .attr("stroke", "white")
        .attr("fill-opacity", 0.4)
        .on("mouseover", function (event, d) {
          d3.select(this).attr(
            "r",
            (d) => radiusScale(d.quantidade_alunos) * 1.2,
          ); // Increase circle size on mouseover
          tooltip
            .style("opacity", 1) // Show the tooltip
            .html(
              d.naturalidade +
                " - " +
                d.estado +
                "<br> " +
                d.quantidade_alunos +
                " Alunos",
            ) // Set tooltip text
            .style("left", event.pageX - 80 + "px")
            .style("top", event.pageY - 80 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", radiusScale(d.quantidade_alunos));
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
            .attr("r", (d) => radiusScale(d.quantidade_alunos))
            .on("mouseover", function (event, d) {
              d3.select(this).attr(
                "r",
                (d) => radiusScale(d.quantidade_alunos) * 1.2,
              ); // Increase circle size on mouseover
              tooltip
                .style("opacity", 1) // Show the tooltip
                .html(
                  d.naturalidade +
                    " - " +
                    d.estado +
                    "<br> " +
                    Number(d.quantidade_alunos) +
                    " Alunos",
                ) // Set tooltip text
                .style("left", event.pageX - 80 + "px")
                .style("top", event.pageY - 80 + "px");
            })
            .on("mouseout", function () {
              d3.select(this).attr("r", (d) =>
                radiusScale(d.quantidade_alunos),
              ); // Reset circle size on mouseout
              tooltip.style("opacity", 0); // Hide the tooltip
            });
        } catch (e) {}
      }
    })
    .catch((error) => {
      console.error("Erro no mapa: ", error);
    });
};
