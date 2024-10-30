document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('.nav a');
    const content = document.getElementById('content');

    // Función para cargar contenido
    const loadPage = (page) => {
        fetch(`Front-end/public/views/${page}`) // Ajusta esta ruta según tu estructura de carpetas
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar la página: ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                content.innerHTML = html; // Cargar HTML en el contenedor
                // Cargar el JS correspondiente si es necesario
                const script = document.createElement('script');
                script.src = `views/${page.replace('.html', '.js')}`; // Ajusta la ruta
                document.body.appendChild(script);
            })
            .catch(error => console.error('Error al cargar el contenido:', error));
    };

    // Cargar la sección inicial
    loadPage('../navegation-bar/navegation.html'); // Cargar la página inicial

    // Escuchar eventos de clic en los enlaces
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
            const page = link.getAttribute('data-section'); // Obtener el atributo data-section
            loadPage(page); // Cargar la página correspondiente
        });
    });
});
