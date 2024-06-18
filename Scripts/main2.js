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
// Clase Pokémon
class Pokemon {
    constructor(id, name, types, imageUrl, height, weight, abilities, stats, moves, evolutions) {
        this.id = id;// ID del Pokémon
        this.name = name;// Nombre del Pokémon
        this.types = types;// Tipos del Pokémon
        this.imageUrl = imageUrl;// URL de la imagen del Pokémon
        this.height = height;// Altura del Pokémon
        this.weight = weight;// Peso del Pokémon
        this.abilities = abilities;// Habilidades del Pokémon
        this.stats = stats;// Estadísticas del Pokémon
        this.moves = moves;// Movimientos del Pokémon
        this.evolutions = evolutions; // Evoluciones del Pokémon
        this.weaknesses = this.calculateWeaknesses();// Debilidades calculadas del Pokémon
    }

    // Método para calcular las debilidades del Pokémon
    calculateWeaknesses() {
        const weaknesses = new Set();
        this.types.forEach(type => {
            typeEffectiveness[type].weak.forEach(weakType => weaknesses.add(weakType));
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
            img.alt = this.name;// Nombre del Pokémon
    
            imgContainer.appendChild(img);
            card.appendChild(pokeball);
            card.appendChild(imgContainer);
        }
    
     // Añadir título con número y nombre del Pokémon
        const title = document.createElement('h2');
        title.textContent = `#${this.id} ${this.name}`;
        card.appendChild(title);
     // Si es detallado, mostrar información adicional
        if (!detailed) {
        // Evento al hacer clic en la tarjeta para mostrar detalles completos
            card.addEventListener('click', () => {
                const pokedex = document.getElementById('pokedex');
                pokedex.innerHTML = '';
                pokedex.appendChild(this.renderCard(true));
            });
        } else {
        // Detalles completos del Pokémon
            const details = document.createElement('div');
            details.classList.add('pokemon-details');
    
            const imgContainerDetail = document.createElement('div');
            imgContainerDetail.classList.add('img-container');
            const imgDetail = document.createElement('img');
            imgDetail.src = this.imageUrl;
            imgDetail.alt = this.name;
            imgContainerDetail.appendChild(imgDetail);
            details.appendChild(imgContainerDetail);
      // Información detallada del Pokémon
            details.innerHTML += `
                <p><strong>Altura:</strong> ${this.height / 10} m</p>
                <p><strong>Peso:</strong> ${this.weight / 10} kg</p>
                <p><strong>Tipos:</strong> ${this.types.join(', ')}</p>
                <h3>Estadísticas:</h3>
                <ul>${this.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}</ul>
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
        }
    
        return card;
    }
    
}
// Cuando el DOM esté cargado, inicializar y cargar la Pokédex
document.addEventListener('DOMContentLoaded', () => {
    window.pokedex = new Pokedex(); // Instanciar la Pokédex
    window.pokedex.fetchPokemons();// Obtener datos de los Pokémon desde la API

   // Funcionalidad para abrir y cerrar la barra lateral
    document.getElementById('open-sidebar').addEventListener('click', () => {
        document.getElementById('sidebar').style.width = '250px';
    });

    document.getElementById('close-sidebar').addEventListener('click', () => {
        document.getElementById('sidebar').style.width = '0';
    });

     // Alternar lista de tipos en la barra lateral
    document.getElementById('toggle-types').addEventListener('click', () => {
        const typeList = document.getElementById('type-list');
        if (typeList.classList.contains('hidden')) {
            typeList.classList.remove('hidden');
        } else {
            typeList.classList.add('hidden');
        }
    });

    // Filtrar Pokémon por tipo al hacer clic en los elementos de la barra lateral
    document.querySelectorAll('#type-list li').forEach(item => {
        item.addEventListener('click', (event) => {
            const type = event.target.getAttribute('data-type');
            window.pokedex.filterByType(type);
            document.getElementById('sidebar').style.width = '0';
        });
    });

     // Agregar efecto 3D al pasar el mouse por encima
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
    const originalRenderPokedex = window.pokedex.renderPokedex.bind(window.pokedex);
    window.pokedex.renderPokedex = function() {
        originalRenderPokedex();
        add3DEffect();
    };
});
