import { Pokemon } from "./pokemon.js";

export class Trainer {
    constructor(name) {
        this.name = name;
        this.team = [];
    }

    addPokemon(pokemon) {
        if (this.team.length < 6 && !this.team.some(p => p.id === pokemon.id)) {
            this.team.push(pokemon);
        }
    }

    removePokemon(pokemonId) {
        this.team = this.team.filter(p => p.id !== pokemonId);
    }
}


