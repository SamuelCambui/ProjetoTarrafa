// Função para criar um nó na Trie
const criarNo = (valor) => {
    return {
      valor: valor,
      fimDaPalavra: false,
      filhos: new Map()
    };
  };
  
  // Factory function para criar uma árvore Trie
  const criarTrie = () => {
    let inicio = criarNo('');
  
    // Método para inserir uma palavra na Trie
    const inserirPalavra = (palavra) => {
      let noAtual = inicio;
  
      for (let c of palavra) {
        if (!noAtual.filhos.has(c)) {
          noAtual.filhos.set(c, criarNo(c));
        }
        noAtual = noAtual.filhos.get(c);
      }
  
      noAtual.fimDaPalavra = true; 
    };
    
    // Método para autocompletar palavras na Trie
    const autocomplete = (palavra) => {
      let resultados = [];
      let noAtual = inicio;
  
      // Ir até o nó correspondente ao prefixo da palavra
      for (let c of palavra) {
        if (noAtual.filhos.has(c)) {
          noAtual = noAtual.filhos.get(c);
        } else {
          return resultados;
        }
      }
  
      helper(noAtual, resultados, palavra.substring(0, palavra.length - 1));
      return resultados;
    };
  
    // Função auxiliar recursiva para autocompletar
    const helper = (no, res, prefixo) => {
      if (no.fimDaPalavra) {
        res.push(prefixo + no.valor);
      }
      for (let c of no.filhos.keys()) {
        helper(no.filhos.get(c), res, prefixo + no.valor);
      }
    };
  
    return {
      inserirPalavra,
      autocomplete
    };
  };
  
  const trie = criarTrie();
  export default trie;