//Incompleto
import { ordenaTabela } from "./ordenaTabela.js";

const itensPorPagina = 10;
let paginaAtual = 1;
let paginasTotais = 0;
let dados = [];
let totalItems = 0;

export const renderizarTabela = (dados) => {
};


const irAPagina = (pagina) => {
  if (pagina >= 1 && pagina <= paginasTotais) {
    paginaAtual = pagina;
    let inicioDosDados = (paginaAtual - 1) * itensPorPagina;
    let fimDosDados = inicioDosDados + itensPorPagina;
    const dadosPaginados = dados.slice(inicioDosDados, fimDosDados);
    renderizarTabela(dadosPaginados);
  }
};

document.getElementById("ant-pagina").addEventListener("click", (e) => {
  e.preventDefault();
  if (paginaAtual > 1) {
    irAPagina(paginaAtual - 1);
  }
});

document.getElementById("prox-pagina").addEventListener("click", (e) => {
  e.preventDefault();
  if (paginaAtual < paginasTotais) {
    irAPagina(paginaAtual + 1);
  }
});

export const configurarPaginacao = (dadosGerais) => {
  console.log("to aqui")
  totalItems = dadosGerais.length;
  paginasTotais = Math.ceil(totalItems / itensPorPagina);
  dados = dadosGerais;
  irAPagina(1); 
};
