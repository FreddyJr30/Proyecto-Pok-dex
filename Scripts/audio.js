class AudioPlayer {
    constructor(musicUrl) {
        this.musicUrl = musicUrl; // Almacena la URL de la música
        this.audio = document.createElement('audio'); // Crea un elemento de audio
        this.audio.src = this.musicUrl; // Asigna la URL de la música al elemento de audio
        this.audio.autoplay = true; // Configura el audio para que se reproduzca automáticamente
        this.audio.loop = true; // Esto hará que la música se repita automáticamente
        this.audio.style.display = 'none'; // Esto oculta el reproductor de audio en la página
        document.body.appendChild(this.audio); // Añade el elemento de audio al cuerpo del documento

        // Asegura que el audio se reproduzca correctamente en algunos navegadores modernos
        this.audio.addEventListener('canplaythrough', () => {
            this.audio.play().catch(error => {
                // Si el autoplay es prevenido por el navegador, se captura y muestra el error en la consola
                console.error('Auto-play was prevented:', error);
            });
        });
    }
}

// Instancia de la clase AudioPlayer cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const player = new AudioPlayer('audio/Choose.mp3'); 
    // Crea un nuevo reproductor de audio con la ruta 'audio/Choose.mp3'
});
