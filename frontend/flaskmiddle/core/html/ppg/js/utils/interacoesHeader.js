const dropdownToggle = document.getElementById('dropdownToggle');
const menu = document.getElementById('menu');

dropdownToggle.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});
