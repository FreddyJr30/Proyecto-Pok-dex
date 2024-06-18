class Pokedex {
    constructor() {
        this.pokemons = []; // Array que almacenará todos los Pokémon obtenidos
        this.filteredPokemons = []; // Array que almacenará los Pokémon filtrados según tipo
    }

    async fetchPokemons() {
        try {
            // Ciclo para obtener datos de los primeros 150 Pokémon
            for (let i = 1; i <= 150; i++) {
                // Obtener datos básicos del Pokémon desde la API PokeAPI
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                const data = await response.json();

                // Obtener datos adicionales como la cadena de evolución del Pokémon
                const speciesResponse = await fetch(data.species.url);
                const speciesData = await speciesResponse.json();
                const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
                const evolutionChainData = await evolutionChainResponse.json();

                // Obtener la lista de evoluciones del Pokémon
                const evolutions = this.getEvolutions(evolutionChainData.chain);

                // Crear objeto Pokémon con los datos obtenidos
                const pokemon = new Pokemon(
                    data.id,
                    data.name,
                    data.types.map(type => type.type.name),
                    data.sprites.front_default,
                    data.height,
                    data.weight,
                    data.abilities.map(ability => ability.ability.name),
                    data.stats,
                    data.moves.map(move => move.move.name),
                    evolutions
                );

                // Agregar el Pokémon creado al array de pokemons
                this.pokemons.push(pokemon);
            }

            // Almacenar todos los Pokémon en filteredPokemons y renderizar el Pokédex
            this.filteredPokemons = this.pokemons;
            this.renderPokedex();
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    // Función para obtener la lista de nombres de evolución de una cadena de evolución dada
    getEvolutions(chain) {
        const evolutions = [];
        const queue = [chain];

        while (queue.length > 0) {
            const current = queue.shift();
            evolutions.push(current.species.name);

            current.evolves_to.forEach(evolution => {
                queue.push(evolution);
            });
        }

        return evolutions;
    }

    // Método para renderizar todos los Pokémon en el Pokédex
    renderPokedex() {
        const pokedexElement = document.getElementById('pokedex');
        pokedexElement.innerHTML = ''; // Limpiar el contenido previo del Pokédex

        // Agregar cada Pokémon filtrado como una tarjeta renderizada al Pokédex
        this.filteredPokemons.forEach(pokemon => {
            pokedexElement.appendChild(pokemon.renderCard());
        });
    }

    // Método para filtrar Pokémon por tipo
    filterByType(type) {
        if (type === 'all') {
            // Mostrar todos los Pokémon si el tipo seleccionado es 'all'
            this.filteredPokemons = this.pokemons;
        } else {
            // Filtrar los Pokémon según el tipo seleccionado
            this.filteredPokemons = this.pokemons.filter(pokemon =>
                pokemon.types.includes(type)
            );
        }
        
        // Renderizar el Pokédex con los Pokémon filtrados
        this.renderPokedex();
    }
}
