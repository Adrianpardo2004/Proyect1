// Función para cargar secciones dinámicamente en el contenedor #content
function loadPage(pageUrl) {
    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar la página: ${response.statusText}`);
            }
            return response.text();
        })
        .then(content => {
            const contentContainer = document.getElementById('content');
            contentContainer.innerHTML = content;

            // Cargar CSS y JS del archivo cargado
            loadAdditionalResources(pageUrl);

            // Inicializar el gráfico si es el dashboard
            if (pageUrl.includes('../DashBoard/dashboard.html')) {
                // Llamar a la función para cargar datos y dibujar el gráfico
                loadSalesDataAndDrawChart(); // Asegúrate de que la función esté disponible
            } else if (pageUrl.includes('../Views/Sales/sales.html')) {
                console.log("Sales page loaded");
            }
        })
        .catch(error => {
            console.error('Error al cargar el contenido:', error);
            alert('Error al cargar la página. Verifica la ruta o intenta nuevamente.');
        });
}


// navigation.js
document.addEventListener('DOMContentLoaded', () => {
    // Verifica si la función existe antes de llamarla
    if (typeof loadSalesDataAndDrawChart === 'function') {
        loadSalesDataAndDrawChart(); // Llamar a la función para cargar datos y dibujar el gráfico
    } else {
        console.error('La función loadSalesDataAndDrawChart no está definida.');
    }
});

// Cargar CSS y JS adicionales
function loadAdditionalResources(pageUrl) {
    const cssFile = pageUrl.replace('.html', '.css');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssFile;
    document.head.appendChild(link);

    const jsFile = pageUrl.replace('.html', '.js');
    const script = document.createElement('script');
    script.src = jsFile;
    
    // Aquí se asegura de que el gráfico se cargue después de que el script se haya cargado
    script.onload = () => {
        // Llamar a la función para cargar datos y dibujar el gráfico si es el dashboard
        if (pageUrl.includes('dashboard.html')) {
            loadSalesDataAndDrawChart(); // Asegúrate de que la función esté disponible
        }
    };
    
    document.body.appendChild(script);
}

    const nav = document.querySelector('.nav');

    window.addEventListener('scroll',function(){
        nav.classList.toggle('active',window.scrollY >0)

    })


// Configuración del menú de usuario
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById("logoutButton");
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownContent = document.getElementById("dropdownContent");

    // Mostrar el menú desplegable al hacer clic en el botón ▼
    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el clic se propague
        dropdownContent.classList.toggle('show');
    });

    // Ocultar el menú desplegable al hacer clic fuera del menú
    document.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Acción para cerrar sesión
    logoutButton.addEventListener("click", (event) => {
        event.preventDefault(); // Evita la acción predeterminada del botón
        sessionStorage.removeItem("authenticated");

        // Reemplaza el estado actual en el historial del navegador
        history.replaceState(null, null, "../Login-Menu/index.html");

        // Redirecciona al login
        window.location.href = "../Login-Menu/index.html";
    });
});









