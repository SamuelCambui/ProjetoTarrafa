import trie from "./utils/trie.js"

let data
let svg

function run_waitMe(element, text) {
  $(element).waitMe({
    //none, rotateplane, stretch, orbit, roundBounce, win8,
    //win8_linear, ios, facebook, rotation, timer, pulse,
    //progressBar, bouncePulse or img
    effect: 'progressBar',
    //place text under the effect (string).
    text: text,
    //background for container (string).
    bg: 'white',
    //color for background animation and text (string).
    color: '#93a3d2',
    //max size
    maxSize: '',
    //wait time im ms to close
    waitTime: -1,
    //url to image
    source: '',
    //or 'horizontal'
    textPos: 'vertical',
    //font size
    fontSize: '',
    // callback
    onClose: function () { }
  });
}

//Rede de colaboração
async function constroiGrafo(valor, fonte, tipo) {

}


$(document).ready(function () {

  $('#wrapper').show();
  run_waitMe('#wrapper', 'progress', 'Carregando...', false);


  fetchChartsIndex();

  $('#wrapper').waitMe('hide');
});




function fetchChartsIndex() {
  const value = $('#select-type-product').find(":selected").val();
  const fonte = $('input[name=fonteRadioOptions]:checked').val();
  const tipo = $('input[name=tipoRadioOptions]:checked').val();


  //fetchListPrograms();  
  index_sliderGraph();
  index_fetchGraph(value, fonte, tipo);
  // index_fetchListProductions('charttotalproductions');
  // index_fetchListPeriodicProductions('charttotalsperiodicproductions');
  // index_fetchListTechnicalProductions('charttotalstechnicalproductions');
  // index_fetchListBiblioProductions('charttotalsbiblioproductions');
  // index_fetchListStudents('charttotalstudentslevel');
}


let index_graph_year1 = 2017;
var index_graph_year2 = 2023;//new Date().getFullYear();


function index_sliderGraph() {
  var max = 2023;//new Date().getFullYear()
  var min = 2017
  var rangeYears = []


  for (var i = min; i <= max; i++) {
    rangeYears.push(i)
  }
  new rSlider({
    target: '#slider-graph-index',
    values: rangeYears,
    range: true,
    tooltip: false,
    set: [rangeYears[0], rangeYears[rangeYears.length - 1]],
    onChange: (vals) => {
      const anos = vals.split(',').map(Number);
      index_graph_year1 = anos[0];
      index_graph_year2 = anos[1];
    }
    //onChange: (vals) => teste(vals)
  });
}


function highlightConnectedNodesAndLinks(node, links, link, text) {
  //node.style('opacity', 0.3);
  console.log
  const nodeId = node.data()[0].id;
  link.style('stroke', function (link_d) {
    return link_d.source.id === nodeId || link_d.target.id === nodeId ? 'black' : '#ffffff';
  }).style('stroke-width', function (link_d) {
    return link_d.source.id === nodeId || link_d.target.id === nodeId ? 2 : 0;
  });


  text.style("opacity", function (label_d) {
    return label_d.id === nodeId ? 1 : 0.0
  });


  // Encontre os nós conectados a este nó
  const connectedNodes = new Set();
  connectedNodes.add(nodeId);
  links.forEach(link_d => {
    if (link_d.source.id === nodeId) {
      connectedNodes.add(link_d.target.id);
    } else if (link_d.target.id === nodeId) {
      connectedNodes.add(link_d.source.id);
    }
  });

  connectedNodes.forEach(id => {
    var e = document.getElementById(id);
    d3.select(e).style('opacity', 1);
    var t = document.getElementById(`text_${id}`)
    d3.select(t).style('opacity', 1);
  });

  node.style('opacity', 1.0);
  node.attr("stroke-width", 2);

}

let vertice_selecionado = false;

function index_fetchGraph(product_type, fonte, tipo) {
  let programas = {};

  if (listaProgramas !== undefined) {

    listaProgramas.forEach(programa => {
      programas[programa.nome] = obterCorAleatoria();
    });

    if (product_type === undefined) product_type = "ARTIGO EM PERIÓDICO"

    axios.get(`/ppg/grafoppgs/${fonte}/${tipo}/${product_type}/${index_graph_year1}/${index_graph_year2}`)
      .then(response => {
        data = response.data.grafo;
        const forca = response.data.forca;


        if (forca == -400)
          $('input[name=tipoRadioOptions][value=ppgs]').click();
        else
          $('input[name=tipoRadioOptions][value=docentes]').click();


        const elem = document.getElementById('links-graph');
        elem.innerHTML = "";


        const width = 1100;
        const height = 880;

        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const links = data.links.map(d => ({ ...d }));
        const nodes = data.nodes.map(d => ({ ...d }));

        data.nodes.map(d => {
          trie.inserirPalavra(d.id.toLowerCase());
          return d.id
        });

        // Create a simulation with several forces.
        // Duplicating to increase the scattering.
        d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody().strength(forca))
          .force("center", d3.forceCenter(-50, -10))
          .force("x", d3.forceX())
          .force("y", d3.forceY());
        const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody().strength(forca))
          //.force("center", d3.forceCenter(-100, -height / 5))
          .force("x", d3.forceX())
          .force("y", d3.forceY());


        $('#links-graph').empty();
        $('#legend-graph').empty();

        // Create the SVG container with a viewBox for responsive behavior.
        svg = d3.select('#links-graph').append("svg")
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("height", "100%")
          .style("background-color", "#f4f4f5"); // Use style to set background color

        // Create a group element for zoom and pan transformations.
        const zoomContainer = svg.append("g");

        // Define zoom behavior.
        const zoom = d3.zoom()
          // .scaleExtent([0.5, 5]) // Set the zoom limits.
          .on("zoom", function (event) {
            zoomContainer.attr("transform", event.transform); // Apply the transformation.
          });

        // Apply the zoom behavior to the SVG.
        svg.call(zoom);

        // Event listeners for the zoom buttons.
        d3.select("#zoom-in").on("click", () => {
          // Use the zoom behavior to scale by a factor of 1.2.
          zoom.scaleBy(svg.transition().duration(500), 1.2);
        });

        d3.select("#zoom-out").on("click", () => {
          // Use the zoom behavior to scale by a factor of 0.8.
          zoom.scaleBy(svg.transition().duration(500), 0.8);
        });

        d3.select("#tela-cheia").on("click", () => {
          const svgElement = svg.node();
          if (!document.fullscreenElement) {
            // svgElement.classList.add('h-screen');

            if (svgElement.requestFullscreen) {
              svgElement.requestFullscreen();
            } else if (svgElement.mozRequestFullScreen) { // Firefox
              svgElement.mozRequestFullScreen();
            } else if (svgElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
              svgElement.webkitRequestFullscreen();
            } else if (svgElement.msRequestFullscreen) { // IE/Edge
              svgElement.msRequestFullscreen();
            }
          } else {
            document.exitFullscreen().then(() => {
              // svgElement.classList.remove('h-screen');
            });
          }
        });

        // Add a line for each link, and a circle for each node.
        const link = zoomContainer.append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("stroke-width", d => {
            return Math.sqrt(d.value);
          });


        const node = zoomContainer.append("g")
          .attr("stroke", "#3B3B3B")
          .attr("stroke-width", 1.5)
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", c => {
            let importancia = c.importancia;
            if (nodes.length < 20)
              importancia = 30;
            let mult = 3;
            if (mult * Math.log(importancia) < 4) return 4;
            return mult * Math.log(importancia);
          })
          .attr("id", d => { return d.id })
          .attr("fill", d => {
            return programas[d.nome];
          });

        node.append("title")
          .text(d => `${d.id} (${d.nome})`);


        var text = zoomContainer.append("g")
          .selectAll("text")
          .data(nodes)
          .join("text")
          .attr("class", "text")
          .attr("style", "font: 8px sans-serif;")
          .attr("id", d => { return `text_${d.id}` })
          .text(d => {
            if (forca === -60)
              return d.id.trim().split(' ')[0];
            return d.id;
          });

        // Add a drag behavior.
        node.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

        // Add a drag behavior.
        node.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

        // mantem o estado ao selecionar um vertice
        node.on('click', function (d) {
          vertice_selecionado = !vertice_selecionado;

          if (vertice_selecionado === false) {
            node.style('opacity', 0.1);
            // d3.select(this).style('opacity', 1);
            highlightConnectedNodesAndLinks(d3.select(this), links, link, text);
          }
          else {
            text.style("font-size", 8);
            text.style('opacity', 1);
            node.style('opacity', 1);
            node.attr("stroke-width", 1.5);
            link
              .style("stroke", "#999")
              .style("stroke-width", d => {
                return Math.sqrt(d.value);
              });
          }
        })

        // Set the position attributes of links and nodes each time the simulation ticks.
        simulation.on("tick", () => {
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

          node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

          text
            .attr("x", d => d.x + 10)
            .attr("y", d => d.y);
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


        const svgl = legendContainer.append("svg")
          .attr("height", Object.keys(programas).length * 21)
          .attr("width", 400)
          .attr("class", "ppgs");


        const svgLegendas = document.querySelector(".ppgs")
        svgLegendas.addEventListener("click", selecionarPpg)


        const legendData = Object.entries(programas);


        const legend = svgl.selectAll(".legend")
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

        legend.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function (d) {
            return d[1];
          });
        legend.append("text")
          .style("font-size", 9)
          .attr("x", 24)
          .attr("style", "cursor: pointer;")
          .attr("y", 9)
          .attr("dy", ".35em")
          .text(function (d) {
            return d[0];
          });


      }).catch(error => {
        console.error('Error fetching graph: ', error);
        GeraToast('Erro ao tentar carregar rede de colaboração');
      })
      .finally(() => {
        $(element).waitMe('hide');
      });
    //});
  }
}


//Filtros extras
function selecionarPpg(e) {
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

function constroiGrafoFiltrado(nodeIds) {
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


  const linksObj = data.links.map(d => ({ ...d }));


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



function procurarNo(e) {
  const links = svg.selectAll("line");
  const node = svg.selectAll("circle");

  let pesquisadorProcurado = e.target.textContent.toLowerCase().trim();

  if (!pesquisadorProcurado) {
    node.style("stroke", "white").style("stroke-width", "1");
  }
  else {
    const selectNode = node.filter((d) => d.id.toLowerCase().trim() === pesquisadorProcurado);
    node.style('opacity', 0.1);
    links.style('opacity', 0);

    selectNode.style("opacity", "1");

    const text = svg.selectAll(".text");
    text.style("opacity", "0")

    const nodeId = selectNode.data()[0].id;

    links.style('stroke', function (link_d) {
      return link_d.source.id === nodeId || link_d.target.id === nodeId ? 'blue' : '#ffffff';
    }).style('stroke-width', function (link_d) {
      return link_d.source.id === nodeId || link_d.target.id === nodeId ? 2 : 0;
    });


    text.style("opacity", function (label_d) {
      return label_d.id === nodeId ? 1 : 0.0
    });

    const linksObj = data.links.map(d => ({ ...d }));

    // Encontre os nós conectados a este nó
    const connectedNodes = new Set();
    connectedNodes.add(nodeId);
    linksObj.forEach(link_d => {
      if (link_d.source === nodeId) {
        connectedNodes.add(link_d.target);
      } else if (link_d.target === nodeId) {
        connectedNodes.add(link_d.source);
      }
    });

    connectedNodes.forEach(id => {
      let e = document.getElementById(id);
      d3.select(e).style('opacity', 1);
      let t = document.getElementById(`text_${id}`)
      d3.select(t).style('opacity', 1);
    });

    links.style('opacity', 1);
  }
}


//Artigos dos docentes
function listar_artigos() {
  let ano = document.getElementById('inputAno').value;


  const element = '#info_carregamento_artigos';
  run_waitMe(element, 'Carregando lista de artigos...');


  axios.get(`/ppg/listarartigos/${ano}`)
    .then(response => {
      var html = '';
      var lista_artigos = response.data;
      lista_artigos.forEach(artigo => {
        html += `<tr onclick="">
        <td style="text-align: center; vertical-align: middle;">${artigo['id_dupl'] + 1}</td>
        <td style="text-align: left;padding-right: 12px; vertical-align: middle;">
          <div class="row align-items-center">
            <div class="col-auto align-self-center">
              <strong>${artigo['nome_producao']}</strong>                                                            
            </div>
          </div>                                                    
        </td>
        <td style="text-align: center; vertical-align: middle;">
          ${artigo['duplicado'] > 0 ? 'Sim' : ''}
        </td>
        <td style="text-align: left; vertical-align: center;">
          <ul>`;


        artigo['programas'].forEach(ppg => {
          html += `<li>${ppg}</li>`;
        });
        html += `</ul>          
        </td>
      </tr>`;
      });
      $('#tbody-lista-artigos').html(html);
    }).catch(error => {
      console.error('Error fetching graph: ', error);
      GeraToast('Erro ao tentar carregar lista de artigos');
    }).finally(() => {
      $(element).waitMe('hide');
    });
}