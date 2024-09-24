import trie from "./utils/trie.js";
// ! ver ouput de dados e modificar na constroiGrafoFiltrado(), ver parametros das funções

export const grafoColaboracao = () => {
  let dados;
  let svg;
  let listaDados = [];
  let verticeSelecionado = false;

  const selecionarPpg = (e) => {
    let selectedVal;

    if (e.target.tagName == "text") {
      selectedVal = e.target.textContent;

      const node = svg.selectAll("circle");

      if (selectedVal == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
      } else {
        const selectNode = node.filter((d) => d.nome === selectedVal);
        const nodeIds = selectNode.data().map((obj) => obj.id);

        constroiGrafoFiltrado(nodeIds);
      }
    }
  };

  const destacarNosEArestas = (node, links, link, text) => {
    const nodeId = node.data()[0].id;
    link
      .style("stroke", (link_d) => {
        return link_d.source.id === nodeId || link_d.target.id === nodeId
          ? "#d97706"
          : "#ffffff";
      })
      .style("stroke-width", (link_d) => {
        return link_d.source.id === nodeId || link_d.target.id === nodeId
          ? 2
          : 0;
      });

    text.style("opacity", (label_d) => {
      return label_d.id === nodeId ? 1 : 0;
    });

    const connectedNodes = new Set();
    connectedNodes.add(nodeId);
    links.forEach((link_d) => {
      if (link_d.source.id === nodeId) {
        connectedNodes.add(link_d.target.id);
      } else if (link_d.target.id === nodeId) {
        connectedNodes.add(link_d.source.id);
      }
    });

    connectedNodes.forEach((id) => {
      const e = document.getElementById(id);
      d3.select(e).style("opacity", 1);
      const t = document.getElementById(`text_${id}`);
      d3.select(t).style("opacity", 1);
    });

    node.style("opacity", 1);
    node.attr("stroke-width", 2);
  };

  const constroiGrafo = async (
    fonte,
    tipo,
    anoInicial,
    anoFinal,
    produto = "ARTIGO EM PERIÓDICO",
  ) => {
    const carregamento = document.getElementById("carregamento");
    carregamento.classList.remove("hidden");
    carregamento.classList.add("flex");

    let programas = {};

    if (listaProgramas !== undefined) {
      listaProgramas.forEach((programa) => {
        programas[programa.nome] = obterCorAleatoria();
      });
      try {
        const response = await axios.get(
          `/ppg/grafoppgs/${fonte}/${tipo}/${produto}/${anoInicial}/${anoFinal}`,
        );

        dados = response.data.grafo;
        const forca = response.data.forca;

        if (forca == -400)
          $("input[name=tipoRadioOptions][value=ppgs]").click();
        else $("input[name=tipoRadioOptions][value=docentes]").click();

        const elem = document.getElementById("links-graph");
        elem.innerHTML = "";

        const width = 1100;
        const height = 880;

        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const links = dados.links.map((d) => ({ ...d }));
        const nodes = dados.nodes.map((d) => ({ ...d }));

        dados.nodes.map((d) => {
          trie.inserirPalavra(d.id.toLowerCase());
          listaDados.push(d.id);
          return d.id;
        });

        d3.forceSimulation(nodes)
          .force(
            "link",
            d3.forceLink(links).id((d) => d.id),
          )
          .force("charge", d3.forceManyBody().strength(forca))
          .force("center", d3.forceCenter(-50, -10))
          .force("x", d3.forceX())
          .force("y", d3.forceY());
        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3.forceLink(links).id((d) => d.id),
          )
          .force("charge", d3.forceManyBody().strength(forca))
          .force("x", d3.forceX())
          .force("y", d3.forceY());

        document.getElementById("links-graph").innerHTML = "";
        document.getElementById("legend-graph").innerHTML = "";

        // Create the SVG container with a viewBox for responsive behavior.
        svg = d3
          .select("#links-graph")
          .append("svg")
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("height", "100%")
          .style("background-color", "#f4f4f5");

        const zoomContainer = svg.append("g");

        const zoom = d3
          .zoom()
          .scaleExtent([0.5, 5])
          .on("zoom", function (event) {
            zoomContainer.attr("transform", event.transform);
          });

        svg.call(zoom);

        d3.select("#zoom-in").on("click", () => {
          zoom.scaleBy(svg.transition().duration(300), 1.2);
        });

        d3.select("#zoom-out").on("click", () => {
          zoom.scaleBy(svg.transition().duration(300), 0.8);
        });

        d3.select("#tela-cheia").on("click", () => {
          const container = document.getElementById("container-grafo"); 
          const fullscreenButton = document.getElementById("tela-cheia");
        
          const minimizeIcon = `
            <svg class="text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 14 10 14 10 20"/>
              <polyline points="20 10 14 10 14 4"/>
              <line x1="14" x2="21" y1="10" y2="3"/>
              <line x1="3" x2="10" y1="21" y2="14"/>
            </svg>`;
        
          const maximizeIcon = `
            <svg class="text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"/>
              <polyline points="9 21 3 21 3 15"/>
              <line x1="21" x2="14" y1="3" y2="10"/>
              <line x1="3" x2="10" y1="21" y2="14"/>
            </svg>`;
        
          // Toggle fullscreen
          if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
              container.requestFullscreen();
            } else if (container.mozRequestFullScreen) { // Firefox
              container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) { // Chrome, Safari, Opera
              container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) { // IE/Edge
              container.msRequestFullscreen();
            }
            debugger
            fullscreenButton.innerHTML = minimizeIcon;
          } else {
            document.exitFullscreen(); // Exit fullscreen mode
            // Change the icon back to maximize
            fullscreenButton.innerHTML = maximizeIcon;
          }
        });
        
        const link = zoomContainer
          .append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("stroke-width", (d) => {
            return Math.sqrt(d.value);
          });

        const node = zoomContainer
          .append("g")
          .attr("stroke", "#3B3B3B")
          .attr("stroke-width", 1.5)
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("cursor", "pointer")
          .attr("r", (c) => {
            let importancia = c.importancia;
            if (nodes.length < 20) importancia = 30;
            let mult = 3;
            if (mult * Math.log(importancia) < 4) return 4;
            return mult * Math.log(importancia);
          })
          .attr("id", (d) => {
            return d.id;
          })
          .attr("fill", (d) => {
            return programas[d.nome];
          });

        node.append("title").text((d) => `${d.id} (${d.nome})`);

        let text = zoomContainer
          .append("g")
          .selectAll("text")
          .data(nodes)
          .join("text")
          .attr("class", "text")
          .attr("style", "font: 8px sans-serif;")
          .attr("id", (d) => {
            return `text_${d.id}`;
          })
          .text((d) => {
            if (forca === -60) return d.id.trim().split(" ")[0];
            return d.id;
          });

        // Add a drag behavior.
        node.call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended),
        );

        // Add a drag behavior.
        node.call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended),
        );

        // mantem o estado ao selecionar um vertice
        node.on("click", function () {
          verticeSelecionado = !verticeSelecionado;

          if (verticeSelecionado === false) {
            node.style("opacity", 0.1);
            destacarNosEArestas(d3.select(this), links, link, text);
          } else {
            text.style("font-size", 8);
            text.style("opacity", 1);
            node.style("opacity", 1);
            node.attr("stroke-width", 1.5);
            link.style("stroke", "#999").style("stroke-width", (d) => {
              return Math.sqrt(d.value);
            });
          }
        });

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

        // Reheat the simulation when drag starts, and fix the subject position.
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        // Update the subject (dragged node) position during drag.
        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        // Restore the target alpha so the simulation cools after dragging ends.
        // Unfix the subject position now that it’s no longer being dragged.
        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        const legendContainer = d3.select("#legend-graph");

        const svgl = legendContainer
          .append("svg")
          .attr("height", Object.keys(programas).length * 21)
          .attr("id", "ppgs")
          .attr("class", "w-[300px] md:w-[400px]");

        const legendData = Object.entries(programas);

        const legend = svgl
          .selectAll(".legend")
          .data(legendData)
          .enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function (d, i) {
            const numCol = 1;
            const col = i % numCol; // Calculate the column number (0 or 1)
            const row = Math.floor(i / numCol); // Calculate the row number
            let x = 0;
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
          .style("font-size", "11px")
          .style("cursor", "pointer")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text((d) => d[0]);

        const svgLegendas = document.getElementById("ppgs");
        svgLegendas.addEventListener("click", selecionarPpg);

        const numConexoes = mapeiaPorConexoes();
        criarSliderConexoes(numConexoes);
      } catch (error) {
        console.error("Erro: ", error);
      } finally {
        carregamento.classList.remove("flex");
        carregamento.classList.add("hidden");
      }
    }
  };

  // * Slider
  const mapeiaPorConexoes = () => {
    const numDeConexoes = {};

    dados.nodes.forEach((node) => (numDeConexoes[node.id] = 0));

    dados.links.forEach((link) => {
      const sourceId = link.source;
      const targetId = link.target;

      if (sourceId !== targetId) {
        numDeConexoes[sourceId] = (numDeConexoes[sourceId] || 0) + 1;
        numDeConexoes[targetId] = (numDeConexoes[targetId] || 0) + 1;
      }
    });
     
    return numDeConexoes;
  };

  const criarSliderConexoes = (numDeConexoes) => {
    let valores = Object.values(numDeConexoes);
    let menorValor = Math.min(...valores);
    let maiorValor = Math.max(...valores);

    let sliderParams = {
      id: "valor-slider",
      min: menorValor,
      max: maiorValor,
      value: menorValor,
    };

    let slider = document.createElement("input");
    slider.type = "range";
    slider.id = sliderParams.id;
    slider.min = sliderParams.min;
    slider.max = sliderParams.max;
    slider.value = sliderParams.value;
    slider.classList.add("accent-indigo-400", "py-0");

    const filtroPorConexoes = document.getElementById("filtro-conexoes");
    filtroPorConexoes.innerHTML = "";

    let valorAtual = document.createElement("p");
    valorAtual.id = "valor-atual";
    valorAtual.classList.add("text-zinc-700", "text-sm");

    filtroPorConexoes.appendChild(slider);
    filtroPorConexoes.appendChild(valorAtual);

    slider.addEventListener("input", () => {
      valorAtual.textContent = `${slider.value} conexões`;
      let numeroSelecionado = parseInt(slider.value);

      let nosFiltrados = listaDados.filter(
        (nome) => numDeConexoes[nome] === numeroSelecionado,
      );

      constroiGrafoFiltrado(nosFiltrados);
    });
  };

  const constroiGrafoFiltrado = (nodeIds) => {
    const node = svg.selectAll("circle");
    const links = svg.selectAll("line");

    node.style("opacity", 0.1);

    const text = svg.selectAll(".text");
    text.style("opacity", 0);

    links.style("stroke", (link_d) => {
      if (
        nodeIds.includes(link_d.source.id) ||
        nodeIds.includes(link_d.target.id)
      ) {
        return "yellow";
      } else {
        return "white";
      }
    });

    links
      .style("stroke", (link_d) => {
        // Verifica se o nome do nó de origem ou de destino está presente no array `nodeIds`
        return nodeIds.includes(link_d.source.id) ||
          nodeIds.includes(link_d.target.id)
          ? "#d97706"
          : "#ffffff";
      })
      .style("stroke-width", function (link_d) {
        return nodeIds.includes(link_d.source.id) ||
          nodeIds.includes(link_d.target.id)
          ? 2
          : 0;
      });

    const linksObj = dados.links.map((d) => ({ ...d }));
    const connectedNodes = new Map();

    nodeIds.forEach((item) => {
      connectedNodes[item] = [];
    });

    linksObj.forEach((link_obj) => {
      if (connectedNodes[link_obj.source] !== undefined) {
        //retirar nome próprio
        connectedNodes[link_obj.source].push(link_obj.target);
      } else if (connectedNodes[link_obj.target] !== undefined) {
        connectedNodes[link_obj.target].push(link_obj.source);
      }
    });

    Object.entries(connectedNodes).forEach(([chave, valores]) => {
      let chaveElemento = document.getElementById(chave);
      d3.select(chaveElemento).style("opacity", 1);
      let chaveTexto = document.getElementById(`text_${chave}`);
      d3.select(chaveTexto).style("opacity", 1);
      valores.forEach((id) => {
        let elemento = document.getElementById(id);
        d3.select(elemento).style("opacity", 1);
        let texto = document.getElementById(`text_${id}`);
        d3.select(texto).style("opacity", 1);
      });
    });

    links.style("opacity", 1);
  };

  return {
    getListaDados: () => {
      return listaDados;
    },
    getDictDados: () => {
      return dados;
    },
    getSvg: () => {
      return svg;
    },
    constroiGrafo,
  };
};
