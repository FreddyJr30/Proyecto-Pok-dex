// Función para animar el llenado de las barras de estadísticas
function animarBarras() {
    const barras = document.querySelectorAll('.barra');

    barras.forEach(barra => {
        barra.style.width = '0%'; // Reiniciar el ancho a 0 antes de animar
        const objetivo = parseInt(barra.dataset.porcentaje); // Obtenemos el porcentaje objetivo de los datos del atributo
        animarBarraEstadisticas(barra, objetivo);
    });
}

// Función para animar una sola barra de estadísticas hasta el porcentaje objetivo
const animarBarraEstadisticas = (elemento, porcentaje) => {
    let anchoInicial = 0; // Ancho inicial de la barra
    let incremento = 1; // Incremento gradual para la animación
    const intervalo = setInterval(() => {
        if (anchoInicial >= porcentaje) {
            clearInterval(intervalo);
        } else {
            anchoInicial += incremento;
            if (anchoInicial > porcentaje) {
                anchoInicial = porcentaje; // Aseguramos que no pase del porcentaje objetivo
            }
            elemento.style.width = anchoInicial + '%';
            // Cambiamos el color de la barra según el porcentaje
            if (anchoInicial <= 25) {
                elemento.style.backgroundColor = '#ff5959'; // Rojo para porcentajes menores o iguales a 50%
            } else {
                elemento.style.backgroundColor = '#4caf50'; // Verde para porcentajes mayores a 50%
            }
        }
    }, 10);
};

// Detecta el desplazamiento hacia abajo y muestra/oculta el botón de scroll hacia arriba
window.onscroll = function() {
    const scrollPosition = document.documentElement.scrollTop; // Obtiene la posición de desplazamiento vertical
    const topContainer = document.querySelector('.top-container'); // Selecciona el contenedor del botón

    // Si la posición de desplazamiento es mayor a 100 pixels
    if (scrollPosition > 100) {
        topContainer.classList.add('show'); // Agrega la clase 'show' para mostrar el botón
    } else {
        topContainer.classList.remove('show'); // Quita la clase 'show' para ocultar el botón
    }
};

// Maneja el clic en el botón para desplazarse hacia arriba suavemente
document.querySelector('.top-container').addEventListener('click', () => {
    window.scrollTo({
        top: 0, // Se desplaza hasta el inicio de la página
        behavior: 'smooth' // Desplazamiento suave
    });
});



// Función para animar la barra de navegación
const animarBarraNavegacion = () => {
    const barraNavegacion = document.getElementById('barra-navegacion');
    barraNavegacion.style.transform = 'translateX(0)';
    barraNavegacion.style.opacity = '1';
};

// Llamar a la animación al cargar la página
window.addEventListener('load', () => {
    animarBarraNavegacion();
});
