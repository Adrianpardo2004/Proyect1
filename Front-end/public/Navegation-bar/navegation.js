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
            if (pageUrl.includes('dashboard.html')) {
                initializeDashboard();
                initializeParticles(); // Inicializar partículas al cargar el dashboard
            }
            // Inicializar lógica específica si es sales.html
            else if (pageUrl.includes('sales.html')) {
                console.log("Sales page loaded");
            }
        })
        .catch(error => {
            console.error('Error al cargar el contenido:', error);
            alert('Error al cargar la página. Verifica la ruta o intenta nuevamente.');
        });
}

// Inicializar funciones específicas del dashboard
function initializeDashboard() {
    fetch('/Data/data_2023.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Preparar los datos para la gráfica
            const labels = data.meses;
            const salesData = data.totales;

            // Crear la gráfica circular
            const ctx = document.getElementById('salesChart').getContext('2d');
            const salesChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ventas Mensuales',
                        data: salesData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],
                        borderColor: 'rgba(255, 255, 255, 1)',
                        borderWidth: 1,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Composición de Ventas Mensuales' }
                    }
                }
            });

            // Actualizar la lista de "Warehouse Detail"
            updateWarehouseList(salesData);

            // Configurar las barras de progreso
            configureProgressBars(salesData);
        })
        .catch(error => console.error('Error cargando el archivo JSON:', error));
}

// Actualizar la lista "Warehouse Detail"
function updateWarehouseList(salesData) {
    const warehouseList = document.getElementById('warehouse-list');
    const totalPrimerSemestre = salesData.slice(0, 6).reduce((acc, curr) => acc + curr, 0);
    const totalSegundoSemestre = salesData.slice(6, 12).reduce((acc, curr) => acc + curr, 0);

    warehouseList.innerHTML = `
        <li><span>Enero a junio</span><span>${totalPrimerSemestre.toLocaleString()} Ventas del semestre</span></li>
        <li><span>Julio a diciembre</span><span>${totalSegundoSemestre.toLocaleString()} Ventas del semestre</span></li>
    `;
}

// Configurar barras de progreso
function configureProgressBars(salesData) {
    const progressBars = document.querySelectorAll('.progress');
    const totalSales = Math.max(...salesData);

    progressBars.forEach((bar, index) => {
        const progress = salesData[index];
        const percentage = (progress / totalSales) * 100;

        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, 100);

        const spanValue = bar.previousElementSibling;
        spanValue.innerText = progress.toLocaleString();
    });
}

// Inicializar partículas
function initializeParticles() {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ff0000" },
            "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
            "opacity": { "value": 0.5, "random": false },
            "size": { "value": 5, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": false },
                "onclick": { "enable": false },
                "resize": true
            },
            "modes": {
                "repulse": { "distance": 200 },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true
    });
}

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
    document.body.appendChild(script);
}

// Configuración del menú de usuario
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById("logoutButton");
    const userProfileImg = document.querySelector('.user-profile img');
    const dropdownContent = document.querySelector('.dropdown-content');

    userProfileImg.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
    });

    logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "../SING_UP/index.html";
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.user-profile img')) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });
});
