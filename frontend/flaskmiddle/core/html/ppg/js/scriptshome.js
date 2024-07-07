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

$('#graph-index-button').on('click', async function(){
	const value = $('#select-type-product').find(":selected").val();
	const fonte = $('input[name=fonteRadioOptions]:checked').val();
	const tipo = $('input[name=tipoRadioOptions]:checked').val();
	//console.log(radio)
	index_fetchGraph(value, fonte, tipo);
});



$(document).ready(function () {

	$('#wrapper').show();
	run_waitMe('#wrapper', 'progress', 'Carregando...', false);
	
	fetchChartsIndex();

	// $("img[async-src]").each(function(index) {
	// 	$(this).attr("src", $(this).attr("async-src"));
	// });


	$('#Programas-tab').click();
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

  var index_graph_year1 = 2013;
  var index_graph_year2 = 2023;//new Date().getFullYear();
  
 function index_sliderGraph() {
	var max = 2023;//new Date().getFullYear()
	var min = 2013
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
	const nodeId = node.data()[0].id;
	link.style('stroke', function (link_d) {
	  return link_d.source.id === nodeId || link_d.target.id === nodeId ? 'black' : '#ffffff';
	}).style('stroke-width', function (link_d) {
	  return link_d.source.id === nodeId || link_d.target.id === nodeId ? 2 : 0;
	});
  
	text.style("opacity", function(label_d){ 
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

  function index_fetchGraph(product_type, fonte, tipo) {

	const element = '#row-slider';
	run_waitMe(element, 'Carregando rede de colaboração...');
  
	var programas = {
	  // "BIODIVERSIDADE E USO DOS RECURSOS NATURAIS": "#444444",
	  // "BIOTECNOLOGIA": "#F08080",
	  // "BOTÂNICA APLICADA": "#131211",
	  // "CIÊNCIAS DA SAÚDE": "#008000",
	  // "CUIDADO PRIMÁRIO EM SAÚDE": "#FF0000",
	  // "DESENVOLVIMENTO ECONÔMICO E ESTRATÉGIA EMPRESARIAL": "#A0A0A0",
	  // "DESENVOLVIMENTO SOCIAL": "#cbf808",
	  // "EDUCAÇÃO": "#800000",
	  // "FILOSOFIA": "#00FF00",
	  // "GEOGRAFIA": "#008080",
	  // //"HISTORIA": "#73c5e0",
	  // //"LETRAS": "#000080",
	  // "LETRAS-ESTUDOS LITERÁRIOS": "#0000FF",
	  // "MODELAGEM COMPUTACIONAL E SISTEMAS": "#0080FF",
	  // "PRODUÇÃO VEGETAL NO SEMIÁRIDO": "#FF00FF",
	  // "SOCIEDADE, AMBIENTE E TERRITÓRIO": "#34cb05",
	  // "ZOOTECNIA": "#f26a21"
	};
  			
	//axios.get('/ppg/nomeprogramas')
	//.then(response => {
	//  var listaProgramas = response.data.programas;

	if(listaProgramas !== undefined) {
	  
	  for (var i = 0; i < listaProgramas.length; i++) programas[listaProgramas[i].nome] = getRandomColor();
  
	  if (product_type === undefined) product_type = "ARTIGO EM PERIÓDICO"
  
	  axios.get(`/ppg/grafoppgs/${fonte}/${tipo}/${product_type}/${index_graph_year1}/${index_graph_year2}`)
		.then(response => {
	
	
		  const data = response.data.grafo;
		  const forca = response.data.forca;
  
		  if(forca == -400)
			$('input[name=tipoRadioOptions][value=ppgs]').click();
		  else 
			$('input[name=tipoRadioOptions][value=docentes]').click();
  
		  const elem = document.getElementById('links-graph');
		  elem.innerHTML = "";
	
		  const width = 1100;
		  const height = 880;
	
		  // Specify the color scale.
		  const color = d3.scaleOrdinal(d3.schemeCategory10);
	
		  // The force simulation mutates links and nodes, so create a copy
		  // so that re-evaluating this cell produces the same result.
		  const links = data.links.map(d => ({ ...d }));
		  const nodes = data.nodes.map(d => ({ ...d }));
	
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
	
		  // Create the SVG container.
		  const svg = d3.select('#links-graph').append("svg")
			//.attr("width", width)
			//.attr("height", height)                     
			//.call(d3.zoom().on("zoom", function () {
			// svg.attr("transform", d3.zoomTransform(this));
			//}))
			.attr("viewBox", [-width / 2, -height / 2, width, height]);
	
		  //.attr("style", "max-width: 1500px; height: 100%; transform: translate(170px, -120px);");
	
		  //svg.on('mousedown.zoom',null);
	
	
	
		  // Add a line for each link, and a circle for each node.
		  const link = svg.append("g")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke-width", d => {
			  //if(d.value > 100) return 10;
			  //else if(d.value <= 100 && d.value > 50) return 7;
			  //else if(d.value <= 50 && d.value > 10) return 4;
			  //else if(d.value <= 10 && d.value > 5) return 3;
			  //return 1;
			  return Math.sqrt(d.value);
			});
	
		  const node = svg.append("g")
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
			  //if(c.tipo === 'ppg') return 5;
			  //return 2;
			})
			.attr("id", d => { return d.id })
			.attr("fill", d => {
			  //if(d.id === 'RENE RODRIGUES VELOSO') return color(d.id);
			  return programas[d.nome];
			});
	
		  node.append("title")
			.text(d => `${d.id} (${d.nome})`);
	
		  var text = svg.append("g")
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
	
		  // svg.append("text")
		  // .attr("x", (width/2)-100)
		  // .attr("y", -(height/2)+10)
		  // .attr("style", "font: 8px sans-serif;")
		  // .text('Scroll do mouse: zoom +/-');
	
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
	
		  node.on('click', function (d) {
			node.style('opacity', 0.1);
			// d3.select(this).style('opacity', 1);
			highlightConnectedNodesAndLinks(d3.select(this), links, link, text);
	
				
			// text.style("opacity", function(label_d){ 
			//   return label_d.id === d.srcElement.__data__.id ? 1 : 0.1 
			// } );
	
			// link
			//   .style('stroke', function (link_d) { 
			//     return link_d.source.id ===  d.srcElement.__data__.id || link_d.target.id ===  d.srcElement.__data__.id ? '#69b3b2' : '#b8b8b8';
			//   })
			//   .style('stroke-width', function (link_d) { 
			//     return link_d.source.id ===  d.srcElement.__data__.id || link_d.target.id ===  d.srcElement.__data__.id ? 4 : 1;
			//   });
		  })
			.on('mouseout', function (d) {
			  text.style("font-size", 8);
			  text.style('opacity', 1);
			  node.style('opacity', 1);
			  node.attr("stroke-width", 1.5);
			  link
				.style("stroke", "#999")
				.style("stroke-width", d => {
				  //if(d.value > 100) return 10;
				  //else if(d.value <= 100 && d.value > 50) return 7;
				  //else if(d.value <= 50 && d.value > 10) return 4;
				  //else if(d.value <= 10 && d.value > 5) return 3;
				  //return 1;
				  
				  return Math.sqrt(d.value);
				});
			});
	
	
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
			.attr("width", 1000) // Adjust the width as needed
			.attr("height", 2000); // Adjust the height as needed
	
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
			  //if (column === 0)
			  //  x = 0;
			  //else if (column == 1)
			  //  x = 120 + 220; // Adjust the x position based on the column
			  //else x = 220 + 440;
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
			//$(element).attr('style','height: 1px;')
			$(element).waitMe('hide');
		});
	//});
	}
  
	
}

function listar_artigos() {
	var ano = document.getElementById('inputAno').value;

	const element = '#info_carregamento_artigos';
	run_waitMe(element, 'Carregando lista de artigos...');

	axios.get(`/ppg/listarartigos/${ano}`)
	.then(response => {
		var html = '';
		var lista_artigos = response.data;
		lista_artigos.forEach(artigo => {
			html += `<tr onclick="">
				<td style="text-align: center; vertical-align: middle;">${artigo['id_dupl']+1}</td>
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
				html+=`</ul>					
				</td>
			</tr>`;
		});
		$('#tbody-lista-artigos').html(html);
		}).catch(error => {
			console.error('Error fetching graph: ', error);
			GeraToast('Erro ao tentar carregar lista de artigos');
		  }).finally(()=>{
			$(element).waitMe('hide');
		  });

		
			

}


  