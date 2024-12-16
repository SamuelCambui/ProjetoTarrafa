export const graficosProjetos = () => {
  const gerarGraficos = async (anoInicio, anoFim) => {
    try {
      const resposta = await axios.get(`/ppg/graficos/projetos-tab/${anoInicio}/${anoFim}`);
      const {
        producaolinhas: linhasProducao,
        projetoslinhas: linhasProjeto,
        projetoslattes: projetosLattes,
      } = resposta.data;


      exibirGraficoProducaoPorLinhaPesquisa(linhasProducao);
      exibirGraficoProjetosPorLinhaPesquisa(linhasProjeto);
      exibirGraficoProjetosDocentesPpg(projetosLattes); 
    } catch (error) {
      console.error("Erro ao buscar dados de projetos-tab: ", error);
    }
  };
  

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

  
  const exibirGraficoProjetosDocentesPpg = (data) => {
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
  
  
  return {
    gerarGraficos,
  };
};
