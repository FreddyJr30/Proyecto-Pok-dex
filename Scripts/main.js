import { Pokedex } from "./pokedex.js";

document.addEventListener('DOMContentLoaded', () => {
    const pokedex = new Pokedex();
    pokedex.fetchPokemons();
    pokedex.loadTrainers();
    pokedex.renderTeam();
    pokedex.renderTrainerTeams();

    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
        typeFilter.addEventListener('change', () => {
            pokedex.renderPokedex();
        });
    }

    const addTrainerForm = document.getElementById('add-trainer-form');
    if (addTrainerForm) {
        addTrainerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const trainerName = event.target.elements['trainer-name'].value;
            pokedex.addTrainer(trainerName);
            event.target.reset();
            renderTrainerSelect();
        });
    }

    const assignPokemonForm = document.getElementById('assign-pokemon-form');
    if (assignPokemonForm) {
        assignPokemonForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const trainerName = event.target.elements['trainer-select'].value;
            const pokemonId = parseInt(event.target.elements['pokemon-select'].value, 10);
            const pokemon = pokedex.pokemons.find(p => p.id === pokemonId);
            if (pokemon) {
                pokedex.assignPokemonToTrainer(trainerName, pokemon);
                pokedex.renderTeam();
            }
            event.target.reset();
        });
    }

    function renderTrainerSelect() {
        const trainerSelect = document.getElementById('trainer-select');
        trainerSelect.innerHTML = '<option value="">Selecciona un entrenador</option>';
        pokedex.trainers.forEach(trainer => {
            trainerSelect.innerHTML += `<option value="${trainer.name}">${trainer.name}</option>`;
        });
    }

    renderTrainerSelect();
});