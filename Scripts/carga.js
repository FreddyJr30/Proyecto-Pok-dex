// Clase para gestionar la pantalla de carga
class LoadingScreenManager {
    constructor(loadingScreenId, baseSelector, loadingScreenTime, baseLoadingTime) {
        // Inicialización de propiedades con los parámetros recibidos
        this.loadingScreen = document.getElementById(loadingScreenId); // Elemento de la pantalla de carga
        this.base = document.querySelector(baseSelector); // Elemento base que contiene la animación
        this.loadingScreenTime = loadingScreenTime; // Tiempo de duración de la pantalla de carga (milisegundos)
        this.baseLoadingTime = baseLoadingTime; // Tiempo de duración de la animación de la clase base (milisegundos)
    }

    // Método para mostrar la pantalla de carga
    showLoadingScreen() {
        this.loadingScreen.style.display = "flex"; // Mostrar la pantalla de carga
        this.base.style.display = "none"; // Ocultar la animación de la clase base
    }

    // Método para ocultar la pantalla de carga
    hideLoadingScreen() {
        this.loadingScreen.style.display = "none"; // Ocultar la pantalla de carga
        this.base.style.display = "flex"; // Mostrar la animación de la clase base
    }

    // Método para iniciar el proceso de carga
    start() {
        this.showLoadingScreen(); // Mostrar la pantalla de carga al iniciar

        // Mostrar la pantalla de carga durante loadingScreenTime milisegundos (5 segundos)
        setTimeout(() => {
            // Ocultar la pantalla de carga después de loadingScreenTime milisegundos
            this.hideLoadingScreen();

            // Mostrar el loading de la clase base durante baseLoadingTime milisegundos (20 segundos)
            setTimeout(() => {
                // Redirigir al index.html después de baseLoadingTime milisegundos (20 segundos)
                window.location.href = 'princinpal.html'; // Ajusta la ruta si es necesario
            }, this.baseLoadingTime);
        }, this.loadingScreenTime);
    }
}

// Evento que se dispara cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Crear una instancia de LoadingScreenManager con los parámetros específicos
    const loadingScreenManager = new LoadingScreenManager("loadingScreen", ".base", 5000, 20000);
    // loadingScreenTime se ajusta a 5000 para 5 segundos
    // baseLoadingTime se ajusta a 20000 para 20 segundos

    // Iniciar el proceso de carga al cargar completamente el DOM
    loadingScreenManager.start();
});
