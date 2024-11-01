document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('.nav a');
    const content = document.getElementById('content');

    // Función para cargar contenido
    let chartScriptLoaded = false;

const loadPage = (page) => {
    fetch(`/views/${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la página: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            content.innerHTML = html; // Cargar HTML en el contenedor

            // Cargar el script solo si no se ha cargado antes
            if (page === 'dashboard.html' && !chartScriptLoaded) {
                const script = document.createElement('script');
                script.src = '/views/dashboard.js';
                document.body.appendChild(script);
                chartScriptLoaded = true; // Marca que el script ha sido cargado
            }
        })
        .catch(error => console.error('Error al cargar el contenido:', error));
};


    // Cargar la sección inicial
    loadPage('Navegation-bar/navegation.html'); // Cargar la página inicial

    // Escuchar eventos de clic en los enlaces
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
            const page = link.getAttribute('data-section'); // Obtener el atributo data-section
            loadPage(page); // Cargar la página correspondiente
        });
    });
});
