document.addEventListener('DOMContentLoaded', () => {
    const contenedorPokemon = document.getElementById('contenedor-pokemon');
    const detallesPokemon = document.getElementById('detalles-pokemon');
    const cuerpoDetalles = document.getElementById('cuerpo-detalles');
    const cerrarBtn = document.getElementById('cerrar-btn');
    const buscadorNombre = document.getElementById('buscador-nombre');
    const buscadorTipo = document.getElementById('buscador-tipo');
    const mostrarTodosBtn = document.getElementById('mostrar-todos');

    let pokemones = []; // Lista para almacenar todos los Pokémon

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
    const tipos = pokemonData.types.map(typeInfo => typeInfo.type.name);

    cuerpoDetalles.innerHTML = `
        <div class="cuerpo-detalles">
            <img src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            <div class="tipos">
                ${tipos.map(tipo => `
                    <button class="boton-tipo ${tipo}" onclick="filtrarPorTipo('${tipo}')">${tipo}</button>
                `).join('')}
            </div>
            <h1>${pokemonData.name}</h1>
            <div class="info">
                <p>Altura: ${pokemonData.height / 10} m</p>
                <p>Peso: ${pokemonData.weight / 10} kg</p>
            </div>
            <div class="estadisticas">
                ${pokemonData.stats.map(stat => `
                    <p>${stat.stat.name}: ${stat.base_stat}</p>
                    <div class="contenedor-barra">
                        <div class="barra ${stat.stat.name.toLowerCase()}" data-porcentaje="${stat.base_stat * 0.8}"></div>
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
        const pokemonesData = await obtenerPokemones();
        pokemones = []; // Reset the pokemones array

        pokemonesData.forEach(async (pokemon) => {
            try {
                const response = await fetch(pokemon.url);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del Pokémon');
                }
                const pokemonData = await response.json();
                pokemones.push(pokemonData); // Store the pokemon data

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

    // Función para filtrar Pokémon por tipo
    function filtrarPorTipo(tipo) {
        const pokemonesFiltrados = pokemones.filter(pokemon =>
            pokemon.types.some(typeInfo => typeInfo.type.name === tipo)
        );
        mostrarPokemones(pokemonesFiltrados);
    }

    // Función para mostrar los Pokémon filtrados
    function mostrarPokemones(listaPokemones) {
        contenedorPokemon.innerHTML = '';
        listaPokemones.forEach(pokemon => crearTarjetaPokemon(pokemon));
    }

    // Función para manejar la búsqueda por nombre
    function buscarPorNombre() {
        const nombre = buscadorNombre.value.toLowerCase();
        const pokemonesFiltrados = pokemones.filter(pokemon =>
            pokemon.name.toLowerCase().includes(nombre)
        );
        mostrarPokemones(pokemonesFiltrados);
    }

    // Función para manejar la búsqueda por tipo desde el buscador
    function buscarPorTipo() {
        const tipo = buscadorTipo.value;
        if (tipo) {
            filtrarPorTipo(tipo);
        } else {
            mostrarPokemones(pokemones);
        }
    }

    // Función para mostrar todos los Pokémon
    mostrarTodosBtn.addEventListener('click', () => {
        mostrarPokemones(pokemones);
    });

    // Añadir eventos de búsqueda
    buscadorNombre.addEventListener('input', buscarPorNombre);
    buscadorTipo.addEventListener('change', buscarPorTipo);

    // Inicializar la Pokédex al cargar la página
    window.addEventListener('DOMContentLoaded', crearTarjetasPokemon);

});
