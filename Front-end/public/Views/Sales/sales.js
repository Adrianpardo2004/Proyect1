// sales.js

// Confirmación de que sales.js está cargado
console.log('sales.js cargado');

(function() {
    // Definición del arreglo de meses
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let salesChart; // Variable para almacenar la instancia de la gráfica

    // Función para cargar datos desde el archivo JSON
    async function loadData() {
        try {
            const response = await fetch('../../Data/sales_by_country.json');
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' + response.statusText);
            }
            const data = await response.json();
            console.log('Datos de ventas:', data);
            return data;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    // Función para cargar datos del archivo JSON de predicciones
    async function loadPredictions() {
        try {
            const response = await fetch('../../Data/predictions_2024.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar predictions_2024.json');
            }
            const data = await response.json();
            console.log('Predicciones de ventas:', data);
            return Object.values(data); // Devuelve los valores del JSON en un array
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    // Función para cargar datos del archivo JSON de sumas totales
    async function loadTotalSales() {
        try {
            const response = await fetch('../../Data/predictions_2024_ajustadas.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar predictions_2024_ajustadas.json: ' + response.statusText);
            }
            const data = await response.json();
            console.log('Suma total de ventas:', data);

            // Verificar que el JSON tenga los datos esperados
            if (Array.isArray(data)) {
                return data; // Si es un array, lo devuelve tal cual
            } else if (typeof data === 'object') {
                return Object.values(data); // Si es un objeto, convierte a array
            } else {
                throw new Error('El formato de datos no es válido. Se esperaba un array u objeto.');
            }
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            alert('Hubo un problema al cargar los datos. Revisa la consola para más detalles.');
        }
    }

    // Función para generar la tabla y la gráfica
    async function generateTableAndChart(data) {
        const salesTableBody = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
        salesTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
        const maxSales = {};
        const chartData = {}; // Para la gráfica

        // Procesar los datos para encontrar el máximo por mes
        for (const [countryCode, info] of Object.entries(data)) {
            for (let i = 0; i < info.meses.length; i++) {
                const monthIndex = info.meses[i] - 1; // Asegúrate de que el índice esté entre 0 y 11
                const month = months[monthIndex]; // Obtener el nombre del mes
                const total = info.totales[i];

                // Actualizar los datos para la tabla
                if (!maxSales[month] || total > maxSales[month].total) {
                    maxSales[month] = { countryCode, total };
                }

                // Actualizar los datos para la gráfica
                if (!chartData[month]) {
                    chartData[month] = 0;
                }
                chartData[month] += total; // Sumar las ventas totales por mes
            }
        }

        // Agregar los máximos a la tabla
        for (const [month, info] of Object.entries(maxSales)) {
            const row = salesTableBody.insertRow();
            row.insertCell(0).textContent = month;
            row.insertCell(1).textContent = info.countryCode;
            row.insertCell(2).textContent = info.total.toLocaleString(); // Formatear el total
        }

        // Destruir la gráfica anterior si existe
        if (salesChart) {
            salesChart.destroy();
        }

        // Crear la gráfica de ventas
        const ctx = document.getElementById('salesChart').getContext('2d');
        salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData), // Usar los nombres de los meses
                datasets: [{
                    label: 'Ventas Totales 2023',
                    data: Object.values(chartData), // Ventas totales por mes
                    backgroundColor: 'rgba(0, 123, 255, 0.5)', // Color de las barras
                    borderColor: 'rgba(0, 123, 255, 1)', // Borde de las barras
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

    // Función para crear la gráfica de predicciones de ventas
    async function createPredictionsChart() {
        const data = await loadPredictions();
        if (!data) return;

        // Destruir la gráfica anterior si existe
        if (salesChart) {
            salesChart.destroy();
        }

        const ctx = document.getElementById('salesChart').getContext('2d');
        salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Predicciones de Ventas 2024',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
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

        // Generar la tabla con las predicciones
        const salesTableBody = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
        salesTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
        for (let i = 0; i < months.length; i++) {
            const row = salesTableBody.insertRow();
            row.insertCell(0).textContent = months[i];
            row.insertCell(1).textContent = 'N/A'; // No hay datos de país para las predicciones
            row.insertCell(2).textContent = data[i].toLocaleString(); // Formatear el total
        }
    }

    async function createTotalSalesChart() {
        const data = await loadTotalSales();
        if (!data) return;

        // Destruir la gráfica anterior si existe
        if (salesChart) {
            salesChart.destroy();
        }

        const ctx = document.getElementById('salesChart').getContext('2d');
        salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Suma Ventas 2023 y Predicción Ventas 2024',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
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

        // Generar la tabla con las sumas totales
        const salesTableBody = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
        salesTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
        for (let i = 0; i < months.length; i++) {
            const row = salesTableBody.insertRow();
            row.insertCell(0).textContent = months[i];
            row.insertCell(1).textContent = 'N/A'; // No hay datos de país para las sumas totales
            row.insertCell(2).textContent = data[i].toLocaleString(); // Formatear el total
        }
    }

    // Función para manejar el evento del botón de filtro
    async function showGraph(filter) {
        console.log('Filtro seleccionado:', filter);
        if (filter === 'predictions') {
            await createPredictionsChart();
        } else if (filter === 'total_sales') {
            await createTotalSalesChart();
        } else {
            const data = await loadData();
            if (!data) return;
            await generateTableAndChart(data);
        }
    }

    // Asignar los eventos a los botones
    document.getElementById('btnAll').addEventListener('click', () => showGraph('all'));
    document.getElementById('btnPredictions').addEventListener('click', () => showGraph('predictions'));
    document.getElementById('btnTotalSales').addEventListener('click', () => showGraph('total_sales'));

})();