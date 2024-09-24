export const graficosDocentes = () => {
  let listaDocentes;

  const carregamento = document.getElementById("carregamento");
  carregamento.classList.remove("hidden");
  carregamento.classList.add("flex");

  const gerarGraficos = async (anoInicio, anoFim) => {
    try {
      const resposta = await axios.get(
        `/ppg/graficos/docentes-tab/${anoInicio}/${anoFim}`,
      );
      const {
        id_ppg: idPpg,
        listadocentes,
        links: dados,
        lattes,
        categorias,
      } = resposta.data;

      listaDocentes = listadocentes;

      exibirGraficoProfessorPorCategoria(
        "chartprofessorsbycategory",
        categorias,
      );
      exibirGraficoLattesDesatualizado("chartlattesupdate", lattes);
      exibirListaDocentes(listaDocentes, idPpg, anoInicio, anoFim);
      exibirGrafoCoautoriasDocentes(dados);

      document.getElementById("select-prof").addEventListener("change", (e) => {
        buscarRedeColaboracao(e, anoInicio, anoFim)
      });
    } catch (error) {
      console.error("Erro ao buscar dados de docentes: ", error);
    }
    finally {
      carregamento.classList.remove("flex");  
      carregamento.classList.add("hidden");
    }
  };

  const atualizarTitulo = (anoInicio, anoFim) => {
    document.getElementById("titulo-docentes").textContent =
      `Professores no período de ${anoInicio} a ${anoFim}`;
  };

  const atualizarFormula = (formula) => {
    document.getElementById("formula_indprod_docente").innerHTML =
      `${formula.A1}*A1 + ${formula.A2}*A2 + ${formula.A3}*A3 + ${formula.A4}*A4 + ${formula.B1}*B1 + ${formula.B2}*B2 + ${formula.B3}*B3 + ${formula.B4}*B4 / período`;
  };

  const limparElementos = () => {
    document.getElementById("tbody-lista-profs").innerHTML = "";
    const select = document.getElementById("select-prof");
    select.innerHTML =
      '<option value="" disabled selected>Escolha um docente</option><option value="todos">* TODOS</option>';
  };

  const ordenarProfessoresPorMedia = (medias) => {
    return Object.keys(medias).sort((a, b) => {
      return medias[b] - medias[a];
    });
  };

  const criarLinhaProfessor = (
    professor,
    indProdArt,
    tooltip,
    tooltip_lattes,
    status,
    avatar,
    idPpg,
    anoInicio,
    anoFim,
    text_qualis,
    corLattes,
  ) => {
    const linhaProfessor = document.createElement("tr");
    linhaProfessor.className =
      "border-b cursor-pointer hover:bg-zinc-50 border-b-gray-300";
    linhaProfessor.innerHTML = `
    <td class="px-3 py-3.5">
      <div class="flex items-center gap-4"> 
        <img class="h-11 w-11 rounded-full" src="${avatar}"/>
        <span class="font-medium capitalize">${professor.nome.toLowerCase()}</span>
      </div>
    </td>

    <td class="px-3 py-3.5" title="${tooltip}">${indProdArt.toFixed(2)}</td>
    <td class="px-3 py-3.5" title="${status}\nÚltima atualização do Lattes: ${tooltip_lattes}">
      ${status}
      <i class="fas fa-exclamation-circle" style="color: ${corLattes[tooltip_lattes]};"></i>
    </td>`;
    linhaProfessor.onclick = () =>
      buscaProducoesProf(
        professor.num_identificador,
        professor.nome,
        idPpg,
        anoInicio,
        anoFim,
        text_qualis,
      );

    return linhaProfessor;
  };

  const criarLinhaMedia = (nomeMedia, valorMedia) => {
    const linhaMedia = document.createElement("tr");
    linhaMedia.classList.add("border-b", "border-b-gray-300", "bg-zinc-50");
    linhaMedia.innerHTML = `
    <th class="text-left font-semibold px-3 py-3.5" scope="colgroup" colspan="5"> IndProd médio dos ${nomeMedia}: ${valorMedia.toFixed(2)} </th>`;

    return linhaMedia;
  };

  const processarListaProfessores = (
    listaDocentes,
    idPpg,
    anoInicio,
    anoFim,
    corLattes,
  ) => {
    const tabelaProfessores = document.getElementById("tbody-lista-profs");
    const select = document.getElementById("select-prof");
    let flagMediaInserida;

    const chavesOrdenadas = ordenarProfessoresPorMedia(listaDocentes.medias);

    chavesOrdenadas.forEach((m) => {
      flagMediaInserida = false;

      for (let i = 0; i < listaDocentes.professores.length; i++) {
        const professor = listaDocentes.professores[i];
        const indProdArt = professor.indprod;

        if (
          parseFloat(indProdArt.toFixed(2)) >=
          parseFloat(listaDocentes.medias[m].toFixed(2))
        ) {
          const text_qualis = `<strong>A1:</strong> ${professor.A1}, <strong>A2:</strong> ${professor.A2}, <strong>A3:</strong> ${professor.A3}, <strong>A4:</strong> ${professor.A4}, <strong>B1:</strong> ${professor.B1}, <strong>B2:</strong> ${professor.B2}, <strong>B3:</strong> ${professor.B3}, <strong>B4:</strong> ${professor.B4}, <strong>C:</strong> ${professor.C}`;
          const tooltip = text_qualis
            .replace(/<strong>/g, "")
            .replace(/<\/strong>/g, "");
          const tooltip_lattes =
            listaDocentes.datalattes[professor.num_identificador];
          const status = listaDocentes.status[professor.num_identificador]
            .map((s) => `<span><strong>${s[0]}</strong></span>`)
            .join("");
          let avatar = "/assets/img/avatars/avatar1.jpeg";
          if (listaDocentes.avatares !== "null") {
            avatar = listaDocentes.avatares[professor.num_identificador];
          }

          const linha = criarLinhaProfessor(
            professor,
            indProdArt,
            tooltip,
            tooltip_lattes,
            status,
            avatar,
            idPpg,
            anoInicio,
            anoFim,
            text_qualis,
            corLattes,
          );
          tabelaProfessores.appendChild(linha);

          select.innerHTML += `<option value="${professor.id_sucupira}">${professor.nome}</option>`;

          listaDocentes.professores.splice(i, 1);
          i = -1;
        } else if (!flagMediaInserida) {
          const mediaRow = criarLinhaMedia(m, listaDocentes.medias[m]);
          tabelaProfessores.appendChild(mediaRow);
          flagMediaInserida = true;
        }
      }
    });
  };

  const exibirListaDocentes = (listaDocentes, idPpg, anoInicio, anoFim) => {
    const corLattes = {
      "+12 meses": "#ef4444",
      "entre 8 e 12 meses": "#f87171",
      "entre 6 e 8 meses": "#fde047",
      "entre 3 e 6 meses": "#1e40af",
      "menos de 2 meses": "#60a5fa",
    };

    const listaProfsTemp = JSON.parse(JSON.stringify(listaDocentes));

    atualizarTitulo(anoInicio, anoFim);
    atualizarFormula(listaProfsTemp.formula);
    limparElementos();
    processarListaProfessores(
      listaProfsTemp,
      idPpg,
      anoInicio,
      anoFim,
      corLattes,
    );
  };

  const exibirGraficoProfessorPorCategoria = (
    idCanvas,
    listagemProfessores,
  ) => {
    renderChartProfessorsByCategory(idCanvas, listagemProfessores);
  };

  const exibirGraficoLattesDesatualizado = (idCanvas, lattes) => {
    const lattesdocs = lattes;
    renderizarGraficoAtualizacao(idCanvas, lattesdocs);
  };

  const exibirGrafoCoautoriasDocentes = (dados) => {
    const data = dados.links;
    const elem = document.getElementById("links-graph");
    elem.innerHTML = "";

    // Reduced size of the graph
    const width = 500;
    const height = 500;
    const innerRadius = Math.min(width, height) * 0.2; // Adjusted innerRadius
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
        .attr("style", "width: 100%; height: 100%; font-size: 5px"); 

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

 
  const buscarRedeColaboracao = (e, anoInicio, anoFim) => {
    let ids = e.target.value;    
    let nome = e.target.options[e.target.selectedIndex].text;  

    axios
      .get(`/ppg/grafo/coautores/docente/${ids}/${anoInicio}/${anoFim}`)
      .then((response) => {
        const data = response.data;
        const elem = document.getElementById("graph");
        elem.innerHTML = "";

        const width = 1100;
        const height = 800;

        const links = data.links.map((d) => ({ ...d }));
        const nodes = data.nodes.map((d) => ({ ...d }));

        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3.forceLink(links).id((d) => d.id),
          )
          .force("charge", d3.forceManyBody().strength(-50))
          .force("x", d3.forceX())
          .force("y", d3.forceY());

        const svg = d3
          .select("#graph")
          .append("svg")
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "max-width: 100%; height: auto;");

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

        node.call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended),
        );

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

        document.getElementById("legend-graph").innerHTML = "";
        const legendContainer = d3.select("#legend-graph");

        const svgl = legendContainer.append("svg").attr("width", 200); 

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
          .style("font-size", "10px") 
          .text(function (d) {
            return d[0];
          });
      })
      .catch((error) => {
        console.error("Error fetching graph: ", error);
      });
  };

  const buscaProducoesProf = (idLattes, nome) => {
    let btnVerLattes = document.getElementById("btn-lattes-docente");
    btnVerLattes.addEventListener("click", function () {
      let url = `http://lattes.cnpq.br/${idLattes}`;
      let width = 800;
      let height = 600;
      let left = (window.screen.width - width) / 2;
      let top = (window.screen.height - height) / 2;
      window.open(
        url,
        "Popup",
        `width=${width},height=${height},left=${left},top=${top}`,
      );
    });

    if (listaDocentes !== undefined) {
      const produtos = listaDocentes["produtos"];
      renderChartProfessorProductions(produtos[idLattes]);
      const dadosOrientandos = listaDocentes["orientados"][idLattes];

      let divNomeProfessor = document.getElementById("nome-prof");
      const nomes = nome.trim().split(" ");

      const primeiroNome = nomes[0].toLowerCase();

      const sobreNomes = nomes.slice(1);
      const initials = sobreNomes.map((lastName) =>
        lastName.charAt(0).toUpperCase(),
      );

      divNomeProfessor.innerText = `Docente: ${primeiroNome} ${initials.join(". ")}.`;

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
        dadosOrientandos[0].TITULADO +
        dadosOrientandos[0]["MUDANCA DE NÍVEL COM DEFESA"];
      const d_ftitulados =
        dadosOrientandos[1].TITULADO +
        dadosOrientandos[1]["MUDANCA DE NÍVEL COM DEFESA"];
      const d_atitulados =
        dadosOrientandos[0].DESLIGADO +
        dadosOrientandos[1].DESLIGADO +
        dadosOrientandos[0].ABANDONOU +
        dadosOrientandos[1].ABANDONOU;

      const m_dtitulados =
        dadosOrientandos[2].TITULADO +
        dadosOrientandos[2]["MUDANCA DE NÍVEL COM DEFESA"];
      const m_ftitulados =
        dadosOrientandos[3].TITULADO +
        dadosOrientandos[3]["MUDANCA DE NÍVEL COM DEFESA"];
      const m_atitulados =
        dadosOrientandos[2].DESLIGADO +
        dadosOrientandos[3].DESLIGADO +
        dadosOrientandos[2].ABANDONOU +
        dadosOrientandos[3].ABANDONOU;

      let divMestradoPrazo = document.getElementById("pb-mestrado-dentro");
      let spanMestradoPrazo = document.getElementById("span-mestrado-dentro");

      let divMestradoForaPrazo = document.getElementById("pb-mestrado-fora");
      let spanMestradoForaPrazo = document.getElementById("span-mestrado-fora");

      let divMestradoDesligado = document.getElementById("pb-mestrado-desligado");
      let spanMestradoDesligado = document.getElementById(
        "span-mestrado-desligado",
      );

      let total_mest = m_dtitulados + m_ftitulados + m_atitulados;
      let perc;
      if (total_mest > 0) {
        perc = (m_dtitulados * 100) / total_mest;
        divMestradoPrazo.setAttribute("aria-valuenow", perc);
        divMestradoPrazo.style = "width: " + perc.toFixed(2) + "%";
        spanMestradoPrazo.innerHTML = "" + perc.toFixed(2) + "%";

        perc = (m_ftitulados * 100) / total_mest;
        divMestradoForaPrazo.setAttribute("aria-valuenow", perc);
        divMestradoForaPrazo.style = "width: " + perc.toFixed(2) + "%";
        spanMestradoForaPrazo.innerHTML = "" + perc.toFixed(2) + "%";

        perc = (m_atitulados * 100) / total_mest;
        divMestradoDesligado.setAttribute("aria-valuenow", perc);
        divMestradoDesligado.style = "width: " + perc.toFixed(2) + "%";
        spanMestradoDesligado.innerHTML = "" + perc.toFixed(2) + "%";
      } else {
        perc = 0.0;
        divMestradoPrazo.setAttribute("aria-valuenow", perc);
        divMestradoPrazo.style = "width: " + perc.toFixed(2) + "%";
        spanMestradoPrazo.innerHTML = "" + perc.toFixed(2) + "%";

        divMestradoForaPrazo.setAttribute("aria-valuenow", perc);
        divMestradoForaPrazo.style = "width: " + perc.toFixed(2) + "%";
        spanMestradoForaPrazo.innerHTML = "" + perc.toFixed(2) + "%";

        divMestradoDesligado.setAttribute("aria-valuenow", perc);
        divMestradoDesligado.style = "width: " + perc.toFixed(2) + "%";
        spanMestradoDesligado.innerHTML = "" + perc.toFixed(2) + "%";
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
  };
  
  return {
    gerarGraficos,
  };
};
