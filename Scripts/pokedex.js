import { Pokemon } from './pokemon.js';
import { Trainer } from './trainer.js';

export class Pokedex {
    constructor() {
        this.pokemons = [];
        this.team = JSON.parse(localStorage.getItem('team'))?.map(pokemonData => {
            try {
                return new Pokemon(pokemonData);
            } catch (error) {
                console.error('Error creating Pokemon from localStorage data:', pokemonData, error);
                return null;
            }
        }).filter(p => p !== null) || [];

        this.trainers = JSON.parse(localStorage.getItem('trainers'))?.map(trainerData => {
            const trainer = new Trainer(trainerData.name);
            trainer.team = trainerData.team.map(pokemonData => {
                try {
                    return new Pokemon(pokemonData);
                } catch (error) {
                    console.error('Error creating Pokemon for trainer from localStorage data:', pokemonData, error);
                    return null;
                }
            }).filter(p => p !== null);
            return trainer;
        }) || [];
    }

    async fetchPokemons() {
        for (let i = 1; i <= 150; i++) {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
                const pokemon = new Pokemon(response.data);
                this.pokemons.push(pokemon);
            } catch (error) {
                console.error(`Error fetching Pokémon with ID ${i}:`, error);
            }
        }
        this.renderPokedex();
        await this.renderPokemonSelect();
    }


    renderPokedex() {
        const pokedexContainer = document.getElementById('pokedex');
        const typeFilter = document.getElementById('type-filter').value.toLowerCase();
        pokedexContainer.innerHTML = '';

        this.pokemons.forEach(pokemon => {
            if (!typeFilter || pokemon.types.includes(typeFilter)) {
                pokedexContainer.appendChild(pokemon.renderCard());
            }
        });
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
            pokemonElement.innerHTML = `
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
                <h2>${pokemon.name}</h2>
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
                    return new Pokemon(pokemonData);
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
                    <img src="${pokemon.sprite}" alt="${pokemon.name}">
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