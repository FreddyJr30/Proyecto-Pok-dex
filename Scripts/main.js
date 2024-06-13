document.addEventListener('DOMContentLoaded', () => {
    const pokedex = new Pokedex();
    pokedex.fetchPokemons();
    pokedex.loadTrainers();
    pokedex.renderTeam();

    // Sidebar open and close functionality
    document.getElementById('open-sidebar').addEventListener('click', () => {
        document.getElementById('sidebar').style.width = '250px';
    });

    document.getElementById('close-sidebar').addEventListener('click', () => {
        document.getElementById('sidebar').style.width = '0';
    });

    // Toggle types list in the sidebar
    document.getElementById('toggle-types').addEventListener('click', () => {
        const typeList = document.getElementById('type-list');
        if (typeList.classList.contains('hidden')) {
            typeList.classList.remove('hidden');
        } else {
            typeList.classList.add('hidden');
        }
    });

    // Filter Pokémon by type when clicking on sidebar items
    document.querySelectorAll('#type-list li').forEach(item => {
        item.addEventListener('click', (event) => {
            const type = event.target.getAttribute('data-type');
            pokedex.filterByType(type);
            document.getElementById('sidebar').style.width = '0';
        });
    });
});