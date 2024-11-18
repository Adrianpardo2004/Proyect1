// Confirmación de que charts.js está cargado
console.log('charts.js cargado');

(function () {
    /**
     * Meses en español.
     * @type {string[]}
     */
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let chartInstance; // Instancia de la gráfica

    /**
     * Carga datos desde un archivo JSON.
     * @param {string} url - URL del archivo JSON.
     * @returns {Promise<Object>} Datos JSON cargados.
     */
    async function loadData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' + response.statusText);
            }
            const data = await response.json();
            console.log('Datos cargados:', data);
            return data;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    /**
     * Genera una gráfica de ventas para un país específico.
     * @param {Object} data - Datos de ventas por país.
     * @param {string} country - Nombre del país a mostrar.
     */
    async function generateChart(data, country) {
        if (!data[country]) {
            console.error(`País no encontrado en los datos: ${country}`);
            return;
        }

        const countryData = data[country];
        const chartData = {};

        // Procesar datos del país seleccionado
        for (let i = 0; i < countryData.meses.length; i++) {
            const month = months[countryData.meses[i] - 1];
            chartData[month] = countryData.totales[i];
        }

        // Crear la gráfica
        const ctx = document.getElementById('predictionsChart').getContext('2d');

        if (chartInstance) {
            chartInstance.destroy(); // Destruir gráfica previa
        }

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData),
                datasets: [{
                    label: `Ventas Mensuales en ${country}`,
                    data: Object.values(chartData),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Ventas (en unidades o valores monetarios)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Meses'
                        }
                    }
                }
            }
        });
    }

    /**
     * Carga y muestra la gráfica inicial.
     */
    async function loadInitialChart() {
        const data = await loadData('../../Data/sales_by_country.json');
        if (data) {
            generateChart(data, 'Australia'); // País inicial
        }
    }

    /**
     * Configura los eventos de los botones para seleccionar países.
     * @param {Object} data - Datos de ventas por país.
     */
    async function setupCountryButtons(data) {
        const countrySelect = document.getElementById('countrySelect');

        countrySelect.addEventListener('change', (event) => {
            const selectedCountry = event.target.value;
            generateChart(data, selectedCountry);
        });
    }

    // Cargar los datos y configurar la funcionalidad
    async function init() {
        const data = await loadData('../../Data/sales_by_country.json');
        if (data) {
            await loadInitialChart();
            setupCountryButtons(data); // Configura los botones con los datos cargados
        }
    }

    // Llamar a la función principal
    init();
})();
