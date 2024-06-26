document.addEventListener('DOMContentLoaded', () => {
    class Pokedex {
        constructor() {
            this.contenedorPokemon = document.getElementById('contenedor-pokemon');
            this.detallesPokemon = document.getElementById('detalles-pokemon');
            this.cuerpoDetalles = document.getElementById('cuerpo-detalles');
            this.cerrarBtn = document.getElementById('cerrar-btn');
            this.buscadorNombre = document.getElementById('buscador-nombre');
            this.buscadorTipo = document.getElementById('buscador-tipo');
            this.mostrarTodosBtn = document.getElementById('mostrar-todos');
            this.modalOpciones = document.getElementById('modal-opciones');

            this.pokemones = []; // Lista para almacenar todos los Pokémon

            // Equipos preestablecidos
            this.equipos = {
                equipo1: [],
                equipo2: [],
                equipo3: [],
                equipo4: [],
                equipo5: [],
                equipo6: []
            };

            this.init();
        }

        /******************************************************************************************************************/

        async obtenerPokemones(offset = 0, limit = 150) {
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

        /******************************************************************************************************************/

        mostrarDetallesPokemon(pokemonData) {
            const tipos = pokemonData.types.map(typeInfo => typeInfo.type.name);
            const tipoPrincipal = tipos[0];

            this.cuerpoDetalles.innerHTML = `
        <div class="cuerpo-detalles pokemon-card ${tipoPrincipal}">
            <div class="imagen-contenedor ${tipoPrincipal}">
                <img src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            </div>
            <div class="parte-fija">
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
                <nav class="nav-items">
                    <a href="#estadisticas">Estadísticas</a>
                    <a href="#moves">Moves</a>
                </nav>
                <div class="parte-dinamica">
                  <!-- El contenido dinámico se actualizará aquí -->
                </div>
            </div>
        </div>
    `;
            this.detallesPokemon.style.display = 'flex';

            // Mostrar inicialmente la sección de estadísticas
            this.mostrarSeccion('estadisticas', pokemonData);

            // Manejar clics en los enlaces de navegación
            const linksNavegacion = document.querySelectorAll('.nav-items a');
            linksNavegacion.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const seccionId = link.getAttribute('href').substring(1);
                    this.mostrarSeccion(seccionId, pokemonData);
                });
            });

            this.animarBarras();
        }


        mostrarSeccion(seccionId, pokemonData) {
            const parteDinamica = document.querySelector('.parte-dinamica');

            if (seccionId === 'estadisticas') {
                parteDinamica.innerHTML = `
                    <div class="seccion-detalles" id="estadisticas">
                     <h3>Estadisticas</h3>
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
                this.animarBarras(); // Animar las barras de estadísticas
            } else if (seccionId === 'moves') {
                parteDinamica.innerHTML = `
                    <div class="seccion-detalles" id="moves">
                        <h3>Moves</h3>
                        <ul>
                            ${pokemonData.moves.map(move => `
                                <li>${move.move.name}</li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }
        }

        cerrarModalDetalles() {
            this.detallesPokemon.style.display = 'none';
        }

        /******************************************************************************************************************/

        async crearTarjetasPokemon() {
            const pokemonesData = await this.obtenerPokemones();
            this.pokemones = [];

            for (const pokemon of pokemonesData) {
                try {
                    const response = await fetch(pokemon.url);
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos del Pokémon');
                    }
                    const pokemonData = await response.json();
                    this.pokemones.push(pokemonData);
                    this.crearTarjetaPokemon(pokemonData);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        /******************************************************************************************************************/

        crearTarjetaPokemon(pokemon) {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');
            tarjeta.style.backgroundImage = `url('https://upload.wikimedia.org/wikipedia/commons/5/53/Poké_Ball_icon.svg')`;
            tarjeta.innerHTML = `
                <div class="contenido-tarjeta">
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="imagen-pokemon">
                    <p class="nombre-pokemon">${pokemon.name}</p>
                </div>
            `;
            tarjeta.addEventListener('click', () => this.mostrarDetallesPokemon(pokemon));
            this.contenedorPokemon.appendChild(tarjeta);
        }

        /******************************************************************************************************************/

        filtrarPorTipo(tipo) {
            const pokemonesFiltrados = this.pokemones.filter(pokemon =>
                pokemon.types.some(typeInfo => typeInfo.type.name === tipo)
            );
            this.mostrarPokemones(pokemonesFiltrados);
        }

        mostrarPokemones(listaPokemones) {
            this.contenedorPokemon.innerHTML = '';
            listaPokemones.forEach(pokemon => this.crearTarjetaPokemon(pokemon));
        }

        buscarPorNombre() {
            const nombre = this.buscadorNombre.value.toLowerCase();
            const pokemonesFiltrados = this.pokemones.filter(pokemon =>
                pokemon.name.toLowerCase().includes(nombre)
            );
            this.mostrarPokemones(pokemonesFiltrados);
        }

        buscarPorTipo() {
            const tipo = this.buscadorTipo.value;
            if (tipo) {
                this.filtrarPorTipo(tipo);
            } else {
                this.mostrarPokemones(this.pokemones);
            }
        }

        /******************************************************************************************************************/

        pokemonYaEnEquipo(pokemonId) {
            for (let equipo in this.equipos) {
                if (this.equipos[equipo].some(pokemon => pokemon.id == pokemonId)) {
                    return true;
                }
            }
            return false;
        }

        /******************************************************************************************************************/

        agregarPokemonAlEquipo(pokemonId, equipoId) {
            const equipo = this.equipos[`equipo${equipoId}`];
            const pokemon = this.pokemones.find(p => p.id == pokemonId);

            if (this.pokemonYaEnEquipo(pokemonId)) {
                alert('Este Pokémon ya fue seleccionado en otro equipo.');
                return;
            }

            if (equipo.length < 6) {
                equipo.push(pokemon);
                this.guardarEquipos();
                this.mostrarEquipos();
            } else {
                alert('El equipo ya tiene 6 Pokémon.');
            }
        }

        /******************************************************************************************************************/

        mostrarEquipos() {
            for (let i = 1; i <= 6; i++) {
                const contenedorEquipo = document.getElementById(`contenedor-equipo${i}`);
                contenedorEquipo.innerHTML = ''; // Limpiar el contenido antes de mostrar

                if (this.equipos[`equipo${i}`]) {
                    this.equipos[`equipo${i}`].forEach(pokemon => {
                        if (pokemon && pokemon.sprites && pokemon.sprites.front_default) {
                            const divPokemon = document.createElement('div');
                            divPokemon.classList.add('pokemon-equipo');
                            divPokemon.style.backgroundColor = this.obtenerColorTipo(pokemon.types[0].type.name); // Asignar color según el tipo
                            divPokemon.innerHTML = `
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                        <p>${pokemon.name}</p>
                        <button class="eliminar-pokemon-btn" data-pokemon-id="${pokemon.id}" data-equipo-id="${i}">&times;</button>
                    `;
                            contenedorEquipo.appendChild(divPokemon);
                        } else {
                            console.error(`Error: Pokémon en equipo ${i} no tiene datos de sprites disponibles.`);
                        }
                    });
                }
            }

            // Agregar evento para eliminar Pokémon
            document.querySelectorAll('.eliminar-pokemon-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const pokemonId = event.target.getAttribute('data-pokemon-id');
                    const equipoId = event.target.getAttribute('data-equipo-id');
                    this.eliminarPokemonDelEquipo(pokemonId, equipoId);
                });
            });
        }

        /******************************************************************************************************************/

        //Funcion para Eliminar pokemons
        eliminarPokemonDelEquipo(pokemonId, equipoId, event) {
            const equipo = this.equipos[`equipo${equipoId}`];
            const index = equipo.findIndex(pokemon => pokemon.id == pokemonId);
            if (index !== -1) {
                equipo.splice(index, 1);
                this.guardarEquipos();
                this.mostrarEquipos(); // Actualiza la visualización de los equipos
            }
            // Evitar que se active la tarjeta de detalles al eliminar
            event.stopPropagation();
        }

        /******************************************************************************************************************/

        mostrarEquipos() {
            for (let i = 1; i <= 6; i++) {
                const contenedorEquipo = document.getElementById(`contenedor-equipo${i}`);
                contenedorEquipo.innerHTML = '';

                if (this.equipos[`equipo${i}`]) {
                    this.equipos[`equipo${i}`].forEach(pokemon => {
                        if (pokemon && pokemon.sprites && pokemon.sprites.front_default) {
                            this.crearTarjetaEquipo(pokemon, i);
                        } else {
                            console.error(`Error: Pokémon en equipo ${i} no tiene datos de sprites disponibles.`);
                        }
                    });
                }
            }
        }

        /******************************************************************************************************************/

        crearTarjetaEquipo(pokemon, equipoId) {
            const contenedorEquipo = document.getElementById(`contenedor-equipo${equipoId}`);

            const tarjeta = document.createElement('div');
            tarjeta.classList.add('pokemon-equipo');
            tarjeta.style.backgroundColor = this.obtenerColorTipo(pokemon.types[0].type.name); // Color según el tipo del Pokémon
            tarjeta.innerHTML = `
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <p>${pokemon.name}</p>
                <button class="eliminar-pokemon-btn" data-pokemon-id="${pokemon.id}" data-equipo-id="${equipoId}">X</button>
            `;
            tarjeta.addEventListener('click', () => this.mostrarDetallesPokemon(pokemon));
            contenedorEquipo.appendChild(tarjeta);
        }

        /******************************************************************************************************************/

        obtenerColorTipo(tipo) {
            switch (tipo) {
                case 'grass':
                    return '#78C850'; // Verde
                case 'fire':
                    return '#F08030'; // Naranja
                case 'water':
                    return '#6890F0'; // Azul
                case 'bug':
                    return '#A8B820'; // Verde claro
                case 'normal':
                    return '#CECEDB'; // Gris
                case 'poison':
                    return '#A040A0'; // Púrpura
                case 'electric':
                    return '#F8D030'; // Amarillo
                case 'ground':
                    return '#E0C068'; // Marrón claro
                case 'fairy':
                    return '#EE99AC'; // Rosa claro
                case 'fighting':
                    return '#C03028'; // Rojo oscuro
                case 'psychic':
                    return '#F85888'; // Rosa
                case 'rock':
                    return '#B8A038'; // Marrón
                case 'ghost':
                    return '#705898'; // Púrpura oscuro
                case 'ice':
                    return '#98D8D8'; // Azul claro
                case 'dragon':
                    return '#7038F8'; // Púrpura
                case 'dark':
                    return '#705848'; // Marrón oscuro
                case 'steel':
                    return '#8F8F92'; // Gris claro
                case 'flying':
                    return '#A890F0'; // Lila
                default:
                    return '#8F8F92'; // Gris por defecto
            }
        }

        /******************************************************************************************************************/

        cargarEquipos() {
            const equiposGuardados = localStorage.getItem('equipos');
            if (equiposGuardados) {
                Object.assign(this.equipos, JSON.parse(equiposGuardados));
                this.mostrarEquipos();
            }
        }

        guardarEquipos() {
            localStorage.setItem('equipos', JSON.stringify(this.equipos));
        }

        /******************************************************************************************************************/

        init() {
            this.crearTarjetasPokemon();
            this.cargarEquipos();

            this.cerrarBtn.addEventListener('click', () => this.cerrarModalDetalles());

            this.detallesPokemon.addEventListener('click', (e) => {
                if (e.target === this.detallesPokemon) {
                    this.cerrarModalDetalles();
                }
            });

            this.mostrarTodosBtn.addEventListener('click', () => this.mostrarPokemones(this.pokemones));
            this.buscadorNombre.addEventListener('input', () => this.buscarPorNombre());
            this.buscadorTipo.addEventListener('change', () => this.buscarPorTipo());

            document.addEventListener('click', (event) => {
                if (event.target.classList.contains('boton-tipo')) {
                    const tipo = event.target.dataset.tipo;
                    this.filtrarPorTipo(tipo);
                    this.cerrarModalDetalles();
                } else if (event.target.classList.contains('agregar-equipo-btn')) {
                    const pokemonId = event.target.getAttribute('data-pokemon-id');
                    this.modalOpciones.classList.add('active');
                    this.modalOpciones.setAttribute('data-pokemon-id', pokemonId);
                } else if (event.target.classList.contains('eliminar-pokemon-btn')) {
                    const pokemonId = event.target.getAttribute('data-pokemon-id');
                    const equipoId = event.target.getAttribute('data-equipo-id');

                    this.eliminarPokemonDelEquipo(pokemonId, equipoId);
                }
            });

            document.querySelectorAll('.opciones-equipo button').forEach(button => {
                button.addEventListener('click', () => {
                    const equipoId = button.getAttribute('data-equipo');
                    const pokemonId = this.modalOpciones.getAttribute('data-pokemon-id');

                    this.agregarPokemonAlEquipo(pokemonId, equipoId);

                    this.modalOpciones.classList.remove('active');
                });
            });

            this.animarBarras();
            this.animarBarraNavegacion();
            this.scrollSuave();
        }

        /******************************************************************************************************************/

        animarBarras() {
            const barras = document.querySelectorAll('.barra');
            barras.forEach(barra => {
                const porcentaje = barra.getAttribute('data-porcentaje');
                barra.style.width = `${porcentaje}%`;
            });
        }

        /******************************************************************************************************************/

        // Función para animar el llenado de las barras de estadísticas
        animarBarras() {
            const barras = document.querySelectorAll('.barra');

            barras.forEach(barra => {
                barra.style.width = '0%'; // Reiniciar el ancho a 0 antes de animar
                const objetivo = parseInt(barra.dataset.porcentaje); // Obtenemos el porcentaje objetivo de los datos del atributo
                this.animarBarraEstadisticas(barra, objetivo);
            });
        }

        /******************************************************************************************************************/

        // Función para animar una sola barra de estadísticas hasta el porcentaje objetivo
        animarBarraEstadisticas(elemento, porcentaje) {
            let anchoInicial = 0; // Ancho inicial de la barra
            let incremento = 1; // Incremento gradual para la animación
            const intervalo = setInterval(() => {
                if (anchoInicial >= porcentaje) {
                    clearInterval(intervalo);
                } else {
                    anchoInicial += incremento;
                    if (anchoInicial > porcentaje) {
                        anchoInicial = porcentaje; // Aseguramos que no pase del porcentaje objetivo
                    }
                    elemento.style.width = anchoInicial + '%';
                    // Cambiamos el color de la barra según el porcentaje
                    if (anchoInicial <= 25) {
                        elemento.style.backgroundColor = '#ff5959'; // Rojo para porcentajes menores o iguales a 50%
                    } else {
                        elemento.style.backgroundColor = '#4caf50'; // Verde para porcentajes mayores a 50%
                    }
                }
            }, 10);
        }

        /******************************************************************************************************************/

        // Función para manejar el desplazamiento suave hacia arriba
        scrollSuave() {
            const topContainer = document.querySelector('.top-container');

            // Maneja el clic en el botón para desplazarse hacia arriba suavemente
            topContainer.addEventListener('click', () => {
                window.scrollTo({
                    top: 0, // Se desplaza hasta el inicio de la página
                    behavior: 'smooth' // Desplazamiento suave
                });
            });

            // Detecta el desplazamiento hacia abajo y muestra/oculta el botón de scroll hacia arriba
            window.addEventListener('scroll', () => {
                const scrollPosition = document.documentElement.scrollTop; // Obtiene la posición de desplazamiento vertical

                // Si la posición de desplazamiento es mayor a 100 pixels
                if (scrollPosition > 100) {
                    topContainer.classList.add('show'); // Agrega la clase 'show' para mostrar el botón
                } else {
                    topContainer.classList.remove('show'); // Quita la clase 'show' para ocultar el botón
                }
            });
        }

        /******************************************************************************************************************/

        // Función para animar la barra de navegación
        animarBarraNavegacion() {
            const barraNavegacion = document.getElementById('barra-navegacion');
            barraNavegacion.style.transform = 'translateX(0)';
            barraNavegacion.style.opacity = '1';
        }
    }

    /******************************************************************************************************************/

    const pokedex = new Pokedex();

    /******************************************************************************************************************/

    // Aplicar imagen de fondo al contenedor principal de Pokémon
    const contenedorPokemon = document.getElementById('contenedor-pokemon');
    if (contenedorPokemon) {
        contenedorPokemon.style.backgroundImage = "url('./images/fondo-pokedex.jpg')";
        contenedorPokemon.style.backgroundSize = 'cover';
        contenedorPokemon.style.backgroundRepeat = 'no-repeat';
        contenedorPokemon.style.backgroundPosition = 'center';
    }

    // Aplicar imagen de fondo a la sección acompañantes
    const seccionAcompanantes = document.getElementById('seccion-acompanantes');
    if (seccionAcompanantes) {
        seccionAcompanantes.style.backgroundImage = "url('./images/fondo-pokedex.jpg')";
        seccionAcompanantes.style.backgroundSize = 'cover';
        seccionAcompanantes.style.backgroundRepeat = 'no-repeat';
        seccionAcompanantes.style.backgroundPosition = 'center';
    }
});

/******************************************************************************************************************/