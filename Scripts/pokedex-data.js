document.addEventListener('DOMContentLoaded', () => {
    const contenedorPokemon = document.getElementById('contenedor-pokemon');
    const detallesPokemon = document.getElementById('detalles-pokemon');
    const cuerpoDetalles = document.getElementById('cuerpo-detalles');
    const cerrarBtn = document.getElementById('cerrar-btn');

    // Función para obtener datos de los Pokémon desde la API
    async function obtenerPokemones(offset = 0, limit = 150) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos de los Pokémon');
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error(error);
        }
    }

// Función para mostrar los detalles del Pokémon seleccionado
function mostrarDetallesPokemon(pokemonData) {
    cuerpoDetalles.innerHTML = `
        <div class="cuerpo-detalles">
            <img src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            <h1>${pokemonData.name}</h1>
            <div class="info">
                <p>Altura: ${pokemonData.height / 10} m</p>
                <p>Peso: ${pokemonData.weight / 10} kg</p>
            </div>
            <div class="estadisticas">
                ${pokemonData.stats.map(stat => `
                    <p>${stat.stat.name}: ${stat.base_stat}</p>
                    <div class="contenedor-barra">
                        <div class="barra ${stat.stat.name.toLowerCase()}" data-porcentaje="${stat.base_stat * 0.5}"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    detallesPokemon.style.display = 'flex';

    // Ahora vamos a animar las barras de estadísticas
    animarBarras();
}


    // Evento para cerrar el modal de detalles
    cerrarBtn.addEventListener('click', () => {
        detallesPokemon.style.display = 'none';
    });

    // Evento para cerrar el modal al hacer clic fuera del contenido
    detallesPokemon.addEventListener('click', (e) => {
        if (e.target === detallesPokemon) {
            detallesPokemon.style.display = 'none';
        }
    });

    // Función para crear tarjetas de Pokémon
    async function crearTarjetasPokemon() {
        const pokemones = await obtenerPokemones();
        pokemones.forEach(async (pokemon) => {
            try {
                const response = await fetch(pokemon.url);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del Pokémon');
                }
                const pokemonData = await response.json();

                const tarjeta = document.createElement('div');
                tarjeta.classList.add('tarjeta');
                tarjeta.style.backgroundImage = `url('https://upload.wikimedia.org/wikipedia/commons/5/53/Poké_Ball_icon.svg')`;
                tarjeta.innerHTML = `
                    <div class="contenido-tarjeta">
                        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="imagen-pokemon">
                        <p class="nombre-pokemon">${pokemonData.name}</p>
                    </div>
                `;
                
                tarjeta.addEventListener('click', () => mostrarDetallesPokemon(pokemonData));
                contenedorPokemon.appendChild(tarjeta);

            } catch (error) {
                console.error(error);
            }
        });
    }

    // Cargar tarjetas de Pokémon al inicio
    crearTarjetasPokemon();
});
