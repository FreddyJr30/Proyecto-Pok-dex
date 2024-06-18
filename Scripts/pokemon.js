// Objeto que define la efectividad de tipos Pokémon
const typeEffectiveness = {
    normal: { weak: ["fighting"], resistant: ["ghost"], immune: [] },
    fire: { weak: ["water", "ground", "rock"], resistant: ["fire", "grass", "ice", "bug", "steel", "fairy"], immune: [] },
    water: { weak: ["electric", "grass"], resistant: ["fire", "water", "ice", "steel"], immune: [] },
    electric: { weak: ["ground"], resistant: ["electric", "flying", "steel"], immune: [] },
    grass: { weak: ["fire", "ice", "poison", "flying", "bug"], resistant: ["water", "electric", "grass", "ground"], immune: [] },
    ice: { weak: ["fire", "fighting", "rock", "steel"], resistant: ["ice"], immune: [] },
    fighting: { weak: ["flying", "psychic", "fairy"], resistant: ["rock", "bug", "dark"], immune: [] },
    poison: { weak: ["ground", "psychic"], resistant: ["grass", "fighting", "poison", "bug", "fairy"], immune: [] },
    ground: { weak: ["water", "grass", "ice"], resistant: ["poison", "rock"], immune: ["electric"] },
    flying: { weak: ["electric", "ice", "rock"], resistant: ["grass", "fighting", "bug"], immune: ["ground"] },
    psychic: { weak: ["bug", "ghost", "dark"], resistant: ["fighting", "psychic"], immune: [] },
    bug: { weak: ["fire", "flying", "rock"], resistant: ["grass", "fighting", "ground"], immune: [] },
    rock: { weak: ["water", "grass", "fighting", "ground", "steel"], resistant: ["normal", "fire", "poison", "flying"], immune: [] },
    ghost: { weak: ["ghost", "dark"], resistant: ["poison", "bug"], immune: ["normal", "fighting"] },
    dragon: { weak: ["ice", "dragon", "fairy"], resistant: ["fire", "water", "electric", "grass"], immune: [] },
    dark: { weak: ["fighting", "bug", "fairy"], resistant: ["ghost", "dark"], immune: ["psychic"] },
    steel: { weak: ["fire", "fighting", "ground"], resistant: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy"], immune: ["poison"] },
    fairy: { weak: ["poison", "steel"], resistant: ["fighting", "bug", "dark"], immune: ["dragon"] }
};

export class Pokemon {
    constructor(id, name, types, imageUrl, height, weight, abilities, stats, moves, evolutions) {
        this.id = id;
        this.name = name;
        this.height = height;
        this.weight = weight;
        this.types = types;
        this.abilities = abilities;
        this.stats = stats;
        this.moves = moves;
        this.imageUrl = imageUrl; // Usar el sprite de la API de Pokémon
        this.evolutions = evolutions;
        this.weaknesses = this.calculateWeaknesses();
    }

    // Método para calcular las debilidades del Pokémon
    calculateWeaknesses() {
        const weaknesses = new Set();
        this.types.forEach(type => {
            if (typeEffectiveness[type]) {
                typeEffectiveness[type].weak.forEach(weakType => weaknesses.add(weakType));
            }
        });
        return Array.from(weaknesses);
    }

    // Método para renderizar la tarjeta del Pokémon
    renderCard(detailed = false) {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.classList.add(`pokemon-type-${this.types[0]}`);

        // Renderizado básico de la tarjeta si no es detallado
        if (!detailed) {
            const pokeball = document.createElement('div');
            pokeball.classList.add('pokeball');

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('img-container');

            const img = document.createElement('img');
            img.src = this.imageUrl; // URL de la imagen del Pokémon
            img.alt = this.name; // Nombre del Pokémon

            imgContainer.appendChild(img);
            card.appendChild(pokeball);
            card.appendChild(imgContainer);
        }

        // Añadir título con número y nombre del Pokémon
        const title = document.createElement('h2');
        title.textContent = `#${this.id} ${this.name}`;
        card.appendChild(title);

        // Si es detallado, mostrar información adicional
        if (detailed) {
            // Detalles completos del Pokémon
            const details = document.createElement('div');
            details.classList.add('pokemon-details');

            const imgContainerDetail = document.createElement('div');
            imgContainerDetail.classList.add('img-container');
            const imgDetail = document.createElement('img');
            imgDetail.src = this.imageUrl; // URL de la imagen del Pokémon
            imgDetail.alt = this.name; // Nombre del Pokémon
            imgContainerDetail.appendChild(imgDetail);
            details.appendChild(imgContainerDetail);

            // Información detallada del Pokémon
            details.innerHTML += `
                <p><strong>Altura:</strong> ${this.height / 10} m</p>
                <p><strong>Peso:</strong> ${this.weight / 10} kg</p>
                <p><strong>Tipos:</strong> ${this.types.join(', ')}</p>
                <h3>Estadísticas:</h3>
                <ul>${this.stats.map(stat => `<li>${stat.name}: ${stat.base_stat}</li>`).join('')}</ul>
                <h3>Movimientos:</h3>
                <p>${this.moves.slice(0, 10).join(', ')}</p>
                <h3>Debilidades:</h3>
                <p>${this.weaknesses.join(', ')}</p>
            `;

            // Mostrar habilidades si existen
            if (this.abilities.length > 0) {
                details.innerHTML += `<h3>Habilidades:</h3><p>${this.abilities.join(', ')}</p>`;
            }

            // Mostrar botones de evolución si hay más de una evolución
            if (this.evolutions.length > 1) {
                const evolutionButtons = document.createElement('div');
                evolutionButtons.classList.add('evolution-buttons');
                this.evolutions.forEach(evolution => {
                    const button = document.createElement('button');
                    button.textContent = evolution;
                    button.addEventListener('click', () => {
                        const targetPokemon = window.pokedex.pokemons.find(pokemon => pokemon.name === evolution);
                        if (targetPokemon) {
                            const pokedex = document.getElementById('pokedex');
                            pokedex.innerHTML = '';
                            pokedex.appendChild(targetPokemon.renderCard(true));
                        }
                    });
                    evolutionButtons.appendChild(button);
                });
                details.appendChild(evolutionButtons);
            }

            // Botón de regreso al Pokédex
            const backButton = document.createElement('button');
            backButton.textContent = 'Regresar';
            backButton.addEventListener('click', () => {
                window.pokedex.renderPokedex();
            });

            details.appendChild(backButton);
            card.appendChild(details);
        } else {
            // Evento al hacer clic en la tarjeta para mostrar detalles completos
            card.addEventListener('click', () => {
                const pokedex = document.getElementById('pokedex');
                pokedex.innerHTML = '';
                pokedex.appendChild(this.renderCard(true));
            });
        }

        return card;
    }

    animateBasedOnStats() {
        const speedStat = this.stats.find(stat => stat.name === 'speed');
        const animationSpeed = speedStat ? speedStat.value * 0.1 + 's' : '1s';
        const card = document.querySelector('.pokemon-card img');
        if (card) {
            card.style.animationDuration = animationSpeed;
            card.style.animationName = 'movePokemonByStats';
            card.addEventListener('animationend', () => {
                card.style.animationName = '';
            });
        }
    }
}
