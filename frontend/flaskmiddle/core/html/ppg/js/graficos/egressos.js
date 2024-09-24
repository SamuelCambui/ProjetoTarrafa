export const graficosEgressos = () => {
  let listaEgressos;
  let listaAtuacoesEgressos;
  let listaProdEgressos;

  const gerarGraficos = async (anoInicio, anoFim) => {
    const carregamento = document.getElementById("carregamento");
    carregamento.classList.remove("hidden");
    carregamento.classList.add("flex");

    try {
      const resposta = await axios.get(
        `/ppg/graficos/egressos-tab/${anoInicio}/${anoFim}`,
      );

      if (resposta.status !== 200) {
        throw new Error("A busca pelo gráfico não retornou resposta");
      }

      const {
        egressos_titulados: listaEgressosTitulados,
        listaegressos: dictEgressos,
        lattes,
        resumos_curriculos: listaEgressosCurriculosLattes,
      } = resposta.data;

      listaProdEgressos = resposta.data.producoes_egressos;

      buscarAtualizacoesEgressosLattes("chartlattesupdateegresso", lattes);
      buscarEgressosTituladosPorAno(
        "chartegressostituladosporano",
        listaEgressosTitulados,
      );
      obterDadosEgressos(dictEgressos, anoInicio, anoFim);
    } catch (error) {
      console.error("Erro ao buscar dados de egressos-tab: ", error);
    } finally {
      carregamento.classList.remove("flex");
      carregamento.classList.add("hidden");
    }
  };

  const buscarEgressosTituladosPorAno = (idCanvas, dados) => {
    renderChartEgressosTituladosPorAno(idCanvas, dados);
  };

  const buscarAtualizacoesEgressosLattes = (idCanvas, lattes) => {
    renderChartLattesUpdateEgressos(idCanvas, lattes);
  };

  const exibirEstatisticasEgressos = (
    quantidadeEgressosComMudanca,
    listaEgressosAInserir,
  ) => {
    const porcentagem = Math.round(
      (quantidadeEgressosComMudanca * 100) / listaEgressosAInserir.length,
    );
    const porcentagemEgressos = document.getElementById("porcentagem-egressos");
    const circuloProgresso = document.getElementById("circulo-progresso");

    porcentagemEgressos.textContent = `${porcentagem}%`;

    const offset = 100 - porcentagem;
    circuloProgresso.style.strokeDashoffset = offset;
  };

  const buscarAtuacaoEgresso = (idLattes, nome) => {
    const informacoes = document.getElementById("informacoes-egressos");
    informacoes.innerHTML = "";

    const abas = document.getElementById("tab-info-egresso");
    let conteudoAba = "";

    Object.entries(listaAtuacoesEgressos[idLattes].modalidades).forEach(
      ([modalidadeEgresso, atuacao], index) => {
        const {
          atuacao_antes: atuacaoAntes,
          atuacao_depois: atuacaoDepois,
          ano_egresso: anoEgresso,
        } = atuacao;
        let { ano_inicio: anoInicioAntes, ano_fim: anoFimAntes } = atuacaoAntes;
        let { ano_inicio: anoInicioDepois, ano_fim: anoFimDepois } =
          atuacaoDepois;

        anoInicioAntes =
          anoInicioAntes === "0" ? "Não encontrado" : anoInicioAntes;
        anoFimAntes = anoFimAntes === "0" ? "Não encontrado" : anoFimAntes;
        anoInicioDepois =
          anoInicioDepois === "0" ? "Não encontrado" : anoInicioDepois;
        anoFimDepois = anoFimDepois === "0" ? "Não encontrado" : anoFimDepois;

        const activeClass =
          index === 0
            ? "active inline-block rounded-t-lg border-b-2 p-4 text-indigo-500 hover:text-indigo-500 border-indigo-500"
            : "inline-block rounded-t-lg border-b-2 p-4 text-gray-500 hover:text-gray-700 border-gray-200";
        conteudoAba += `
            <li class="me-2" role="presentation">
            <button class="${activeClass}" id="aba-${modalidadeEgresso}" type="button" role="tab" aria-controls="${modalidadeEgresso}" aria-selected="${index === 0}">
              ${modalidadeEgresso}
            </button>
            </li>`;

        informacoes.innerHTML += `
      <div class="tab-pane ${index === 0 ? "block" : "hidden"}" id="${modalidadeEgresso}" role="tabpanel" aria-labelledby="aba-${modalidadeEgresso}">
      <p class="py-4 text-zinc-700 font-extrabold">Titulação em ${anoEgresso}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-extrabold text-indigo-500">Antes</h3>
          <h4 class="font-medium text-blue-600">Local de trabalho</h4>
          <p class="mb-2 text-zinc-700">${atuacaoAntes.local_trabalho}</p>
          <h4 class="font-medium text-blue-600">Atuação</h4>
          <p class="mb-2 text-zinc-700">${atuacaoAntes.atuacao}</p>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-blue-600">Ano Início</h4>
              <p class="mb-2 text-zinc-700">${anoInicioAntes}</p>
            </div>
            <div>
              <h4 class="font-medium text-blue-600">Ano Final</h4>
              <p class="mb-2 text-zinc-700">${anoFimAntes}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 class="font-extrabold text-indigo-500">Depois</h3>
          <h4 class="font-medium text-blue-600">Local de trabalho</h4>
          <p class="mb-2 text-zinc-700">${atuacaoDepois.local_trabalho}</p>
          <h4 class="font-medium text-blue-600">Atuação</h4>
          <p class="mb-2 text-zinc-700">${atuacaoDepois.atuacao}</p>
          <div class="grid grid-cols-2 gap-4 mb-2">
            <div>
              <h4 class="font-medium text-blue-600">Ano Início</h4>
              <p class="text-zinc-700">${anoInicioDepois}</p>
            </div>
            <div>
              <h4 class="font-medium text-blue-600">Ano Final</h4>
              <p class="text-zinc-700">${anoFimDepois}</p>
            </div>
          </div>
        </div>
      </div>
      </div>`;
      },
    );

    abas.innerHTML = conteudoAba;

    const elementosAbas = abas.querySelectorAll("button");

    elementosAbas.forEach((aba, index) => {
      aba.addEventListener("click", () => {
        elementosAbas.forEach((a, i) => {
          const painelAlvo = document.getElementById(
            a.getAttribute("aria-controls"),
          );

          a.classList.remove("active", "text-indigo-500", "border-indigo-500");
          a.classList.add("text-gray-500", "border-gray-200");
          a.setAttribute("aria-selected", "false");

          // Oculta todos os painéis
          painelAlvo.classList.add("hidden");
        });

        aba.classList.add("active", "text-indigo-500", "border-indigo-500");
        aba.classList.remove("text-gray-500", "border-gray-200");
        aba.setAttribute("aria-selected", "true");

        const painelAlvo = document.getElementById(
          aba.getAttribute("aria-controls"),
        );
        if (painelAlvo) {
          painelAlvo.classList.remove("hidden");
        }
      });
    });

    // Lógica para exibir nome do egresso
    const nomeEgresso = document.getElementById("nome-egresso");
    const names = nome.trim().split(" ");
    const firstName = names[0];
    const lastNames = names.slice(1);
    const initials = lastNames
      .map((lastName) => lastName.charAt(0).toUpperCase())
      .join(". ");
    nomeEgresso.innerText = `Egresso: ${firstName} ${initials}.`;

    const mensagem = document.getElementById("mensagem-produtos");

    if (listaProdEgressos !== undefined) {
      debugger;
      const produtos = listaProdEgressos[idLattes];

      // Render the chart
      renderChartProducoes(produtos, "chartproducoesegressos");

      if (produtos.length > 0) {
        mensagem.classList.add("hidden");
      } else {
        mensagem.classList.remove("hidden");
      }
    }
  };

  const exibirTabelaEgressos = (
    listaEgressosAInserir,
    tabelaEgressos,
    listaEgressos,
  ) => {
    const corLattes = {
      "+12 meses": "#ff91a9",
      "entre 8 e 12 meses": "#72bef1",
      "entre 6 e 8 meses": "#ffdd88",
      "entre 3 e 6 meses": "#5d75b0",
      "menos de 2 meses": "#b794ff",
    };

    let quantidadeEgressosComMudanca = 0;
    const defaultAvatar = "/assets/img/avatars/avatar1.jpeg";

    // Variáveis de controle para adicionar linha de mudança apenas uma vez
    let linhaComMudancaAdicionada = false;
    let linhaSemMudancaAdicionada = false;

    listaEgressosAInserir.forEach((dadosEgressos) => {
      const { mudanca, idlattes, linkavatar, nome, verificado } = dadosEgressos;
      const avatar = linkavatar || defaultAvatar;

      if (mudanca === "Com mudança") {
        quantidadeEgressosComMudanca++;
      }

      // Adicionar a linha de "Com mudança" ou "Sem mudança" apenas no primeiro egresso
      if (mudanca === "Com mudança" && !linhaComMudancaAdicionada) {
        const headerRow = document.createElement("tr");
        headerRow.className = "border-b border-b-gray-300 bg-zinc-50";
        headerRow.innerHTML = `
                  <td class="text-left font-semibold px-3 py-3.5" colspan="2">
                      Egressos com mudança de emprego após defesa:
                  </td>
              `;
        tabelaEgressos.appendChild(headerRow);
        linhaComMudancaAdicionada = true; // Marcar como inserida
      } else if (mudanca !== "Com mudança" && !linhaSemMudancaAdicionada) {
        const headerRow = document.createElement("tr");
        headerRow.className = "border-b border-b-gray-300 bg-zinc-50";
        headerRow.innerHTML = `
                  <td class="text-left font-semibold px-3 py-3.5" colspan="2">
                      Egressos sem mudança de emprego após defesa:
                  </td>
              `;
        tabelaEgressos.appendChild(headerRow);
        linhaSemMudancaAdicionada = true; // Marcar como inserida
      }

      const linhaEgresso = document.createElement("tr");
      linhaEgresso.className =
        "border-b cursor-pointer hover:bg-zinc-50 border-b-gray-300";
      linhaEgresso.onclick = () => buscarAtuacaoEgresso(idlattes, nome);

      const statusColor =
        corLattes[listaEgressos[idlattes]?.atualizacao_lattes] ||
        "defaultColor"; // Handle undefined cases
      const statusIcon = `
              <i class="fas fa-exclamation-circle" style="color: ${statusColor}"></i>
          `;

      linhaEgresso.innerHTML = `
              <td class="px-3 py-3.5">
                  <div class="flex items-center gap-4">
                      <img class="h-11 w-11 rounded-full" src="${avatar}" />
                      <span class="font-medium capitalize">${nome.toLowerCase()}</span>
                  </div>
              </td>
              <td class="px-3 py-3.5" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="Ultima Atualização Lattes: ${listaEgressos[idlattes]}">
                  ${statusIcon}
              </td>
          `;

      tabelaEgressos.appendChild(linhaEgresso);
    });

    exibirEstatisticasEgressos(
      quantidadeEgressosComMudanca,
      listaEgressosAInserir,
    );
  };

  const obterDadosEgressos = (dictEgressos, anoInicio, anoFim) => {
    listaEgressos = dictEgressos.dados;
    listaAtuacoesEgressos = dictEgressos.lattes;

    const tabelaEgressos = document.getElementById("tbody-lista-egressos");

    document.getElementById("titulo-egressos").textContent =
      `Egressos no período de ${anoInicio} a ${anoFim}`;

    exibirTabelaEgressos(listaEgressos, tabelaEgressos, listaAtuacoesEgressos);
  };

  return {
    gerarGraficos,
  };
};
