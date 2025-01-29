import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  
  /*
  desestruturação de array
  useState retorna:
    -isMobile:variável que armazena o valor atual do estado.Inicialmente, foi definido como undefined
    -setIsMobile:Uma função para atualizar o estado 
  
  <boolean | undefined>: tipo do estado boolean ou undefined
  */
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  //executado após o componente renderizar.
  /*
  [] é a lista de dependências. Quando vazio, o efeito só é executado uma vez, quando for montado
  */
  React.useEffect(() => {
    /*
    Criação de um MediaQueryList
    (max-width: 767px) verifica se a largura da janela é menor que o ponto de interrupção (768px)
    */
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    /*
    -função será chamada sempre que a largura da janela mudar
    -atualiza o estado isMobile usando a função setIsMobile
      Define true se a largura da janela for menor que o ponto de interrupção.
      Define false caso contrário.
    */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    /*
    adiciona um event listener ao objeto mql
    Chama a função onChange sempre que a largura da janela cruza o limite de 768px.
      -A largura da janela passa a ser menor que 768px (a query é verdadeira).
      -A largura da janela passa a ser maior ou igual a 768px (a query é falsa).
    */
    mql.addEventListener("change", onChange)
    /*
    Define o estado inicial
    */
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    /*
    função de limpeza
    quando o componente é desmontado, o ouvinte "change" não continua ativo
    */
    return () => mql.removeEventListener("change", onChange)
  }, [])

  /*
  Técnica em JavaScript para converter qualquer valor para um valor booleano

  O valor de isMobile pode ser inicialmente undefined, e o operador !! garante que ele seja convertido 
  para um valor booleano válido (true ou false)
  */
  return !!isMobile
}
