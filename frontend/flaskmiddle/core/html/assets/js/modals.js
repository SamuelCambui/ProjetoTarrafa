const abrirModal = () => {
    const modal = document.getElementById('modalEsqueceuSenha');
    modal.classList.remove('invisible');
}

function fecharModal() {
    const modal = document.getElementById('modalEsqueceuSenha');
    modal.classList.add('invisible');
}

document.getElementById('esqueceu-senha').addEventListener('click', () =>
    abrirModal()
);
