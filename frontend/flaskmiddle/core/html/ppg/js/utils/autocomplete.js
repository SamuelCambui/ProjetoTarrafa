export const renderizarItensPesquisa = (dados, resultadosDocentes, inputDocentes) => {
    resultadosDocentes.innerHTML = "";

    dados.forEach((item) => {
        const itemResultado = document.createElement("div");
        itemResultado.classList.add("resultado-nome");
        itemResultado.textContent = item;

        itemResultado.addEventListener("click", () => {
            inputDocentes.value = item;
            itemResultado.style.display = "none";
        });
        resultadosDocentes.appendChild(itemResultado);
    });

    resultadosDocentes.style.display = dados.length ? "block" : "none";
}


export const filtrarResultadosPesquisa = (inputDocentes, trie) => {
    const inputDocente = inputDocentes.value.trim().toLowerCase();

    if (inputDocente.length > 0) {
        return trie.autocomplete(inputDocente);
    }
}