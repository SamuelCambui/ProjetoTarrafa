// !todo navegação por botoes

export const renderizarItensPesquisa = (nomes, container, input) => {
  container.innerHTML = "";

  if (nomes.length === 0) {
    container.classList.add("hidden");
    return;
  }

  const fragment = document.createDocumentFragment();

  nomes.forEach((nome) => {
    const item = document.createElement("div");
    item.className =
      "resultado-item cursor-pointer rounded p-2 mb-1 mx-2 hover:bg-indigo-100 transition-colors duration-100";
    item.textContent = nome;
    fragment.appendChild(item);

    item.addEventListener("click", () => {
      input.value = nome;
      container.classList.add("hidden");
    });
  });

  container.appendChild(fragment);
  container.classList.remove("hidden");
};

export const filtrarResultadosPesquisa = (input, trie) => {
  const valorBusca = input.value.trim().toLowerCase();

  if (!valorBusca) {
    return [];
  }

  return trie.autocomplete(valorBusca);
};