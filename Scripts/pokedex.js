class Pokedex {
    constructor() {
        this.pokemons = [];
        this.filteredPokemons = [];
    }

    async fetchPokemons() {
        for (let i = 1; i <= 150; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemon = await response.json();
            this.pokemons.push(pokemon);
        }
        this.filteredPokemons = this.pokemons;
        this.renderPokedex();
    }

    renderPokedex() {
        const pokedexElement = document.getElementById('pokedex');
        pokedexElement.innerHTML = '';
        this.filteredPokemons.forEach(pokemon => {
            const pokemonCard = this.createPokemonCard(pokemon);
            pokedexElement.appendChild(pokemonCard);
        });
    }

    createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.classList.add(`pokemon-type-${pokemon.types[0].type.name}`);

        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        card.appendChild(img);

        const name = document.createElement('h2');
        name.textContent = pokemon.name;
        card.appendChild(name);

        return card;
    }

    filterByType(type) {
        if (type === 'all') {
            this.filteredPokemons = this.pokemons;
        } else {
            this.filteredPokemons = this.pokemons.filter(pokemon => 
                pokemon.types.some(t => t.type.name === type)
            );
        }
        this.renderPokedex();
    }
}
