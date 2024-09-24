const abrirModal = () => {
    const modal = document.getElementById('modal-esqueceu-senha');
    modal.classList.remove('invisible');
}

function fecharModal() {
    const modal = document.getElementById('modal-esqueceu-senha');
    modal.classList.add('invisible');
}

document.getElementById('esqueceu-senha').addEventListener('click', () =>
    abrirModal()
);
