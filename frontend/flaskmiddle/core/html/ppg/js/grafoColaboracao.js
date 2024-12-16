import trie from "./utils/trie.js";
// ! ver ouput de dados e modificar na constroiGrafoFiltrado(), ver parametros das funções


export const grafoColaboracao = () => {
  let dados;
  let svg;
  let listaDados = []; //Docentes ou PPGs
  let vertice_selecionado = false;

  const selecionarPpg = (e) => {
    let selectedVal

    if (e.target.tagName == "text") {
      selectedVal = e.target.textContent

      const node = svg.selectAll("circle");

      if (selectedVal == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
      }

      else {
        const selectNode = node.filter((d) => d.nome === selectedVal);
        const nodeIds = selectNode.data().map(obj => obj.id);

        constroiGrafoFiltrado(nodeIds)
      }
    }
  }

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

  const constroiGrafo = async (fonte, tipo, anoInicial, anoFinal, produto = "ARTIGO EM PERIÓDICO") => {
    let programas = {};

    if (listaProgramas !== undefined) {
      listaProgramas.forEach((programa) => {
        programas[programa.nome] = obterCorAleatoria();
      });

      axios
        .get(
          `/ppg/grafoppgs/${fonte}/${tipo}/${produto}/${anoInicial}/${anoFinal}`
        )
        .then((response) => {
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
            listaDados.push(d.id.toLowerCase());
            return d.id;
          });

          // Create a simulation with several forces.
          // Duplicating to increase the scattering.
          d3.forceSimulation(nodes)
            .force(
              "link",
              d3.forceLink(links).id((d) => d.id)
            )
            .force("charge", d3.forceManyBody().strength(forca))
            .force("center", d3.forceCenter(-50, -10))
            .force("x", d3.forceX())
            .force("y", d3.forceY());
          const simulation = d3
            .forceSimulation(nodes)
            .force(
              "link",
              d3.forceLink(links).id((d) => d.id)
            )
            .force("charge", d3.forceManyBody().strength(forca))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

          $("#links-graph").empty();
          $("#legend-graph").empty();

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
            const svgElement = svg.node();
            if (!document.fullscreenElement) {
              if (svgElement.requestFullscreen) {
                svgElement.requestFullscreen();
              } else if (svgElement.mozRequestFullScreen) {
                // Firefox
                svgElement.mozRequestFullScreen();
              } else if (svgElement.webkitRequestFullscreen) {
                // Chrome, Safari, Opera
                svgElement.webkitRequestFullscreen();
              } else if (svgElement.msRequestFullscreen) {
                // IE/Edge
                svgElement.msRequestFullscreen();
              }
              return;
            }
            document.exitFullscreen();
          });

          // d3.select("#resetar-grafo").on("click", () => {
          // })

          // Add a line for each link, and a circle for each node.
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
              .on("end", dragended)
          );

          // Add a drag behavior.
          node.call(
            d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          );

          // mantem o estado ao selecionar um vertice
          node.on('click', function () {
            vertice_selecionado = !vertice_selecionado;

            if (vertice_selecionado === false) {
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
            .attr("width", 400)
            .attr("id", "ppgs");

          const legendData = Object.entries(programas);

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
            .style("font-size", 9)
            .attr("x", 24)
            .attr("style", "cursor: pointer;")
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function (d) {
              return d[0];
            });

          const svgLegendas = document.getElementById("ppgs");
          svgLegendas.addEventListener("click", selecionarPpg);

        })
        .catch((error) => {
          console.error("Erro: ", error);
          // GeraToast("Erro ao tentar carregar rede de colaboração");
        });
    }
  };

  const constroiGrafoFiltrado = (nodeIds) => {
    const node = svg.selectAll("circle");
    const links = svg.selectAll("line");

    node.style('opacity', 0.1);

    const text = svg.selectAll(".text");
    text.style('opacity', 0);

    links.style('stroke', link_d => {
      // Verifica se o nome do nó de origem ou de destino está presente no array `nodeIds`
      if (nodeIds.includes(link_d.source.id) || nodeIds.includes(link_d.target.id)) {
        return 'yellow';
      } else {
        return 'white';
      }
    })


    links.style('stroke', link_d => {
      // Verifica se o nome do nó de origem ou de destino está presente no array `nodeIds`
      return nodeIds.includes(link_d.source.id) || nodeIds.includes(link_d.target.id) ? 'red' : '#ffffff';
    }).style('stroke-width', function (link_d) {
      return nodeIds.includes(link_d.source.id) || nodeIds.includes(link_d.target.id) ? 2 : 0;
    });

    const linksObj = dados.links.map(d => ({ ...d }));
    const connectedNodes = new Map();

    nodeIds.forEach(item => {
      connectedNodes[item] = [];
    });

    linksObj.forEach(link_obj => {
      if (connectedNodes[link_obj.source] !== undefined) { //retirar nome próprio
        connectedNodes[link_obj.source].push(link_obj.target)
      } else if (connectedNodes[link_obj.target] !== undefined) {
        connectedNodes[link_obj.target].push(link_obj.source)
      }
    });

    Object.entries(connectedNodes).forEach(([chave, valores]) => {
      let chaveElemento = document.getElementById(chave);
      d3.select(chaveElemento).style('opacity', 1);
      let chaveTexto = document.getElementById(`text_${chave}`);
      d3.select(chaveTexto).style('opacity', 1);
      valores.forEach(id => {
        let elemento = document.getElementById(id);
        d3.select(elemento).style('opacity', 1);
        let texto = document.getElementById(`text_${id}`);
        d3.select(texto).style('opacity', 1);
      });
    });

    links.style('opacity', 1);
  }


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
