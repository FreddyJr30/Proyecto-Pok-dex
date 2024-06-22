import { Pokedex } from "./pokedex.js";

document.addEventListener('DOMContentLoaded', () => {
    const pokedex = new Pokedex();

    // Cargar los Pokémon y entrenadores al iniciar
    pokedex.fetchPokemons();
    pokedex.loadTrainers();
    pokedex.renderTeam();
    pokedex.renderTrainerTeams();

    // Manejar el formulario para agregar entrenadores
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

    // Manejar el formulario para asignar Pokémon a entrenadores
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

    // Manejar el formulario para eliminar un Pokémon de un entrenador
    const removePokemonForm = document.getElementById('remove-pokemon-form');
    if (removePokemonForm) {
        removePokemonForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const trainerName = event.target.elements['trainer-select-remove'].value;
            const selectedPokemon = event.target.elements['pokemon-select-remove'].value;
            const pokemonId = parseInt(selectedPokemon.split('-')[0], 10); 

            pokedex.deleteTrainerPokemon(trainerName, pokemonId);
            event.target.reset();

            renderTrainerSelectRemove();
        });
    }

    // Función para agregar efecto 3D al pasar el mouse por encima de las tarjetas de Pokémon
    const add3DEffect = () => {
        const cards = document.querySelectorAll('.pokemon-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', ev => {
                const { offsetX, offsetY, target: el } = ev;
                const { offsetWidth, offsetHeight } = el;
                const rotX = (offsetHeight / 2 - offsetY) / 25;
                const rotY = (offsetWidth / 2 - offsetX) / -25;
                el.style.transform = `translate3d(0, 0, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });
            card.addEventListener('mouseout', ev => {
                ev.target.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)`;
            });
        });
    };

    // Reaplicar el efecto 3D cuando se renderice la Pokédex
    const originalRenderPokedex = pokedex.renderPokedex.bind(pokedex);
    pokedex.renderPokedex = function () {
        originalRenderPokedex();
        add3DEffect();
    };

    // Función para renderizar las opciones de selección de entrenador
    function renderTrainerSelect() {
        const trainerSelect = document.getElementById('trainer-select');
        trainerSelect.innerHTML = '<option value="">Selecciona un entrenador</option>';
        pokedex.trainers.forEach(trainer => {
            trainerSelect.innerHTML += `<option value="${trainer.name}">${trainer.name}</option>`;
        });
    }

    // Función para renderizar las opciones de selección de entrenador y Pokémon para eliminar
    function renderTrainerSelectRemove() {
        const trainerSelectRemove = document.getElementById('trainer-select-remove');
        trainerSelectRemove.innerHTML = '<option value="">Selecciona un entrenador</option>';
        pokedex.trainers.forEach(trainer => {
            trainerSelectRemove.innerHTML += `<option value="${trainer.name}">${trainer.name}</option>`;
        });

        trainerSelectRemove.addEventListener('change', () => {
            const selectedTrainer = trainerSelectRemove.value;
            const pokemonSelectRemove = document.getElementById('pokemon-select-remove');
            pokemonSelectRemove.innerHTML = '<option value="">Selecciona un Pokémon</option>';

            if (selectedTrainer) {
                const trainer = pokedex.trainers.find(t => t.name === selectedTrainer);
                trainer.team.forEach(pokemon => {
                    pokemonSelectRemove.innerHTML += `<option value="${pokemon.id}-${pokemon.name}">${pokemon.name}</option>`;
                });
            }
        });
    }


    // Llamar la función de renderizado de las opciones de selección de entrenador al inicio
    renderTrainerSelect();
    renderTrainerSelectRemove();
});
