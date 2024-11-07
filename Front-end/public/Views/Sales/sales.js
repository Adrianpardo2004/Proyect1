// Confirmación de que sales.js está cargado
console.log('sales.js cargado');

(function() {
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
            return data;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            alert('Hubo un problema al cargar los datos. Revisa la consola para más detalles.');
        }
    }

    // Función para actualizar la gráfica y la tabla
    async function updateTableAndChart(data, chartData, chartTitle) {
        // Limpiar la tabla y crear nueva
        const salesTableBody = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
        salesTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        // Generar la tabla con los totales de ventas
        for (const [month, total] of Object.entries(chartData)) {
            const row = salesTableBody.insertRow();
            row.insertCell(0).textContent = month;
            row.insertCell(1).textContent = total.toLocaleString(); // Formatear el total
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
                    label: chartTitle,
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

    // Función para generar la tabla y la gráfica con datos de ventas
    async function generateTableAndChart(data) {
        const chartData = {}; // Para la gráfica

        // Procesar los datos para sumar las ventas por mes
        for (const info of Object.values(data)) {
            for (let i = 0; i < info.meses.length; i++) {
                const monthIndex = info.meses[i] - 1;
                const month = months[monthIndex]; // Obtener el nombre del mes
                const total = info.totales[i];

                // Actualizar los datos para la gráfica
                if (!chartData[month]) {
                    chartData[month] = 0;
                }
                chartData[month] += total;
            }
        }

        await updateTableAndChart(data, chartData, 'Ventas Totales 2023');
    }

    // Función para crear la gráfica de predicciones de ventas
    async function createPredictionsChart() {
        const data = await loadPredictions();
        if (!data) return;

        const chartData = {}; // Para la gráfica
        data.forEach((value, index) => {
            chartData[months[index]] = value;
        });

        await updateTableAndChart(data, chartData, 'Predicciones de Ventas 2024');
    }

    // Función para crear la gráfica de predicciones de ventas totales ajustadas
    async function createTotalSalesChart() {
        const data = await loadTotalSales();
        if (!data) return;

        const chartData = {}; // Para la gráfica
        const monthsInOrder = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Procesar los datos del archivo de predicciones 2024 ajustadas
        monthsInOrder.forEach(month => {
            if (data[month]) {
                chartData[months[monthsInOrder.indexOf(month)]] = data[month];
            }
        });

        await updateTableAndChart(data, chartData, 'Suma Ventas 2023 y Predicción Ventas 2024');
    }

    // Función para cargar automáticamente la primera gráfica al cargar la página
    async function loadInitialChart() {
        const data = await loadData();
        generateTableAndChart(data);
    }

    // Llamar a la función para cargar la primera gráfica cuando se carga la página
    loadInitialChart();

    // Eventos de los botones para cambiar entre las gráficas
    document.getElementById('btnAll').addEventListener('click', async () => {
        const data = await loadData();
        generateTableAndChart(data);
    });

    document.getElementById('btnPredictions').addEventListener('click', createPredictionsChart);
    document.getElementById('btnTotalSales').addEventListener('click', createTotalSalesChart);

})();
