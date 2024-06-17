export class Pokemon {
    constructor(data) {
        this.id = data.id;
        this.name = data.name || 'Desconocido';
        this.height = data.height || 0;
        this.weight = data.weight || 0;
        this.types = data.types ? data.types.map(typeInfo => typeInfo.type.name) : [];
        this.abilities = data.abilities ? data.abilities.map(abilityInfo => abilityInfo.ability.name) : [];
        this.stats = data.stats ? data.stats.map(statInfo => ({ name: statInfo.stat.name, value: statInfo.base_stat })) : [];
        this.moves = data.moves ? data.moves.map(moveInfo => moveInfo.move.name) : [];
        this.sprite = data.sprites ? data.sprites.front_default : '';
    }

    renderCard() {
        const card = document.createElement('div');
        card.className = `pokemon-card pokemon-type-${this.types[0] || 'unknown'}`;
        card.innerHTML = `
            <img src="${this.sprite}" alt="${this.name}">
            <h2>${this.name}</h2>
            <p>Altura: ${this.height}</p>
            <p>Peso: ${this.weight}</p>
            <p>Tipo: ${this.types.join(', ')}</p>
            <p>Habilidades: ${this.abilities.join(', ')}</p>
        `;
        card.addEventListener('click', () => {
            this.animateBasedOnStats();
        });
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