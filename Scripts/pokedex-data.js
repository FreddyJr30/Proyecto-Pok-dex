document.addEventListener('DOMContentLoaded', () => {
    const contenedorPokemon = document.getElementById('contenedor-pokemon');
    const detallesPokemon = document.getElementById('detalles-pokemon');
    const cuerpoDetalles = document.getElementById('cuerpo-detalles');
    const cerrarBtn = document.getElementById('cerrar-btn');
    const buscadorNombre = document.getElementById('buscador-nombre');
    const buscadorTipo = document.getElementById('buscador-tipo');
    const mostrarTodosBtn = document.getElementById('mostrar-todos');
    const modalOpciones = document.getElementById('modal-opciones');

    let pokemones = []; // Lista para almacenar todos los Pokémon

    // Equipos preestablecidos
    const equipos = {
        equipo1: [],
        equipo2: [],
        equipo3: [],
        equipo4: [],
        equipo5: [],
        equipo6: []
    };

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
                        <button class="boton-tipo ${tipo}" data-tipo="${tipo}">${tipo}</button>
                    `).join('')}
                </div>
                <button class="agregar-equipo-btn" data-pokemon-id="${pokemonData.id}">Agregar a Equipo</button>
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

        for (const pokemon of pokemonesData) {
            try {
                const response = await fetch(pokemon.url);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del Pokémon');
                }
                const pokemonData = await response.json();
                pokemones.push(pokemonData); // Store the pokemon data
                crearTarjetaPokemon(pokemonData);

            } catch (error) {
                console.error(error);
            }
        }
    }

    // Función para crear una tarjeta de Pokémon
    function crearTarjetaPokemon(pokemon) {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');
        tarjeta.style.backgroundImage = `url('https://upload.wikimedia.org/wikipedia/commons/5/53/Poké_Ball_icon.svg')`;
        tarjeta.innerHTML = `
            <div class="contenido-tarjeta">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="imagen-pokemon">
                <p class="nombre-pokemon">${pokemon.name}</p>
            </div>
        `;

        tarjeta.addEventListener('click', () => mostrarDetallesPokemon(pokemon));
        contenedorPokemon.appendChild(tarjeta);
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
    crearTarjetasPokemon();

    // Evento delegado para manejar clics en los botones de tipo dentro del modal
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('boton-tipo')) {
            const tipo = event.target.dataset.tipo;
            filtrarPorTipo(tipo);
            detallesPokemon.style.display = 'none'; // Cierra el modal al hacer clic en un tipo
        }
    });

    //****Funciones para agregar equipos
    // Función para agregar un Pokémon a un equipo
    function agregarPokemonAlEquipo(pokemonId, equipoId) {
        const equipo = equipos[`equipo${equipoId}`];
        const pokemon = pokemones.find(p => p.id == pokemonId);

        if (equipo.length < 6) {
            equipo.push(pokemon);
            guardarEquipos();
            mostrarEquipos();
        } else {
            alert('El equipo ya tiene 6 Pokémon.');
        }
    }

    // Función para mostrar los Pokémon en los equipos
    function mostrarEquipos() {
        for (let i = 1; i <= 6; i++) {
            const contenedorEquipo = document.getElementById(`contenedor-equipo${i}`);
            contenedorEquipo.innerHTML = '';

            if (equipos[`equipo${i}`]) {
                equipos[`equipo${i}`].forEach(pokemon => {
                    if (pokemon && pokemon.sprites && pokemon.sprites.front_default) {
                        const divPokemon = document.createElement('div');
                        divPokemon.classList.add('pokemon-equipo');
                        divPokemon.innerHTML = `
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                        <p>${pokemon.name}</p>
                    `;
                        contenedorEquipo.appendChild(divPokemon);
                    } else {
                        console.error(`Error: Pokémon en equipo ${i} no tiene datos de sprites disponibles.`);
                    }
                });
            }
        }
    }

    // Función para cargar los equipos desde localStorage
    function cargarEquipos() {
        const equiposGuardados = localStorage.getItem('equipos');
        if (equiposGuardados) {
            Object.assign(equipos, JSON.parse(equiposGuardados));
            mostrarEquipos();
        }
    }

    // Función para guardar los equipos en localStorage
    function guardarEquipos() {
        localStorage.setItem('equipos', JSON.stringify(equipos));
    }

    // Manejador para el botón "Agregar a Equipo"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('agregar-equipo-btn')) {
            const pokemonId = e.target.getAttribute('data-pokemon-id');
            modalOpciones.classList.add('active');
            modalOpciones.setAttribute('data-pokemon-id', pokemonId);
        }
    });

    // Manejador para los botones dentro del modal de opciones
    document.querySelectorAll('.opciones-equipo button').forEach(button => {
        button.addEventListener('click', () => {
            const equipoId = button.getAttribute('data-equipo');
            const pokemonId = modalOpciones.getAttribute('data-pokemon-id');

            agregarPokemonAlEquipo(pokemonId, equipoId);

            modalOpciones.classList.remove('active');
        });
    });

    // Inicializar la aplicación
    cargarEquipos();
});