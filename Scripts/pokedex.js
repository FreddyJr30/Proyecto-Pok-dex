import { Pokemon } from './pokemon.js';
import { Trainer } from './trainer.js';

export class Pokedex {
    constructor() {
        this.pokemons = [];
        this.team = JSON.parse(localStorage.getItem('team'))?.map(pokemonData => {
            try {
                return new Pokemon(
                    pokemonData.id,
                    pokemonData.name,
                    pokemonData.types,
                    pokemonData.imageUrl,
                    pokemonData.height,
                    pokemonData.weight,
                    pokemonData.abilities,
                    pokemonData.stats,
                    pokemonData.moves,
                    pokemonData.evolutions
                );
            } catch (error) {
                console.error('Error creating Pokemon from localStorage data:', pokemonData, error);
                return null;
            }
        }).filter(p => p !== null) || [];

        this.trainers = JSON.parse(localStorage.getItem('trainers'))?.map(trainerData => {
            const trainer = new Trainer(trainerData.name);
            trainer.team = trainerData.team.map(pokemonData => {
                try {
                    return new Pokemon(
                        pokemonData.id,
                        pokemonData.name,
                        pokemonData.types,
                        pokemonData.imageUrl,
                        pokemonData.height,
                        pokemonData.weight,
                        pokemonData.abilities,
                        pokemonData.stats,
                        pokemonData.moves,
                        pokemonData.evolutions
                    );
                } catch (error) {
                    console.error('Error creating Pokemon for trainer from localStorage data:', pokemonData, error);
                    return null;
                }
            }).filter(p => p !== null);
            return trainer;
        }) || [];
    }

    async fetchPokemons() {
        try {
            for (let i = 1; i <= 150; i++) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                const data = await response.json();

                const speciesResponse = await fetch(data.species.url);
                const speciesData = await speciesResponse.json();
                const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
                const evolutionChainData = await evolutionChainResponse.json();

                const evolutions = this.getEvolutions(evolutionChainData.chain);

                const pokemon = new Pokemon(
                    data.id,
                    data.name,
                    data.types.map(type => type.type.name),
                    data.sprites.front_default,
                    data.height,
                    data.weight,
                    data.abilities.map(ability => ability.ability.name),
                    data.stats.map(stat => ({ name: stat.stat.name, base_stat: stat.base_stat })),
                    data.moves.map(move => move.move.name),
                    evolutions
                );

                this.pokemons.push(pokemon);
            }

            this.renderPokedex();
            this.renderPokemonSelect();
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }
    
    renderPokedex() {
        const pokedexElement = document.getElementById('pokedex');
        pokedexElement.innerHTML = '';

        this.pokemons.forEach(pokemon => {
            pokedexElement.appendChild(pokemon.renderCard());
        });
    }

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

    addPokemonToTeam(pokemon) {
        if (this.team.length < 6 && !this.team.some(p => p.id === pokemon.id)) {
            this.team.push(pokemon);
            this.saveTeam();
            this.renderTeam();
        } else {
            alert('Tu equipo está lleno o este Pokémon ya está en tu equipo.');
        }
    }

    saveTeam() {
        localStorage.setItem('team', JSON.stringify(this.team));
    }

    renderTeam() {
        const teamContainer = document.getElementById('team');
        teamContainer.innerHTML = '';

        this.team.forEach(pokemon => {
            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'pokemon-card';

            const imageUrl = pokemon.imageUrl || '';
            const name = pokemon.name || 'Desconocido';

            pokemonElement.innerHTML = `
                <img src="${imageUrl}" alt="${name}">
                <h2>${name}</h2>
            `;
            teamContainer.appendChild(pokemonElement);
        });
    }

    addTrainer(name) {
        const trainer = new Trainer(name);
        this.trainers.push(trainer);
        this.saveTrainers();
        this.renderTrainerTeams();
    }

    saveTrainers() {
        localStorage.setItem('trainers', JSON.stringify(this.trainers));
    }

    loadTrainers() {
        this.trainers = JSON.parse(localStorage.getItem('trainers'))?.map(trainerData => {
            const trainer = new Trainer(trainerData.name);
            trainer.team = trainerData.team.map(pokemonData => {
                try {
                    return new Pokemon(
                        pokemonData.id,
                        pokemonData.name,
                        pokemonData.types,
                        pokemonData.imageUrl,
                        pokemonData.height,
                        pokemonData.weight,
                        pokemonData.abilities,
                        pokemonData.stats,
                        pokemonData.moves,
                        pokemonData.evolutions
                    );
                } catch (error) {
                    console.error('Error creating Pokemon for trainer from localStorage data:', pokemonData, error);
                    return null;
                }
            }).filter(p => p !== null);
            return trainer;
        }) || [];
    }

    assignPokemonToTrainer(trainerName, pokemon) {
        const trainer = this.trainers.find(t => t.name === trainerName);
        if (trainer) {
            if (pokemon instanceof Pokemon) {
                trainer.addPokemon(pokemon);
                this.saveTrainers();
                this.renderTrainerTeams();
            } else {
                console.error('Error: El objeto pokemon no es una instancia válida de Pokemon.');
            }
        }
    }

    deleteTrainerPokemon(trainerName, pokemonId) {
        const trainer = this.trainers.find(t => t.name === trainerName);
        if (trainer) {
            trainer.removePokemon(pokemonId);
            this.saveTrainers();
            this.renderTrainerTeams();
        }
    }

    renderTrainerTeams() {
        const trainerTeamsContainer = document.getElementById('trainer-teams');
        trainerTeamsContainer.innerHTML = '';

        this.trainers.forEach(trainer => {
            const trainerTeamSection = document.createElement('div');
            trainerTeamSection.className = 'trainer-team';

            const trainerHeader = document.createElement('h2');
            trainerHeader.textContent = `Equipo de ${trainer.name}`;
            trainerTeamSection.appendChild(trainerHeader);

            const teamContainer = document.createElement('div');
            teamContainer.className = 'team-container';

            trainer.team.forEach(pokemon => {
                const pokemonCard = document.createElement('div');
                pokemonCard.className = 'pokemon-card';
                pokemonCard.innerHTML = `
                    <img src="${pokemon.imageUrl}" alt="${pokemon.name}">
                    <h2>${pokemon.name}</h2>
                `;
                teamContainer.appendChild(pokemonCard);
            });

            trainerTeamSection.appendChild(teamContainer);
            trainerTeamsContainer.appendChild(trainerTeamSection);
        });
    }

    renderPokemonSelect() {
        const pokemonSelect = document.getElementById('pokemon-select');
        pokemonSelect.innerHTML = '';
        pokemonSelect.innerHTML += '<option value="">Selecciona un Pokémon</option>';
        this.pokemons.forEach(pokemon => {
            pokemonSelect.innerHTML += `<option value="${pokemon.id}">${pokemon.name}</option>`;
        });
    }


    
}
