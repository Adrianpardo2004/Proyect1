// Cargar y procesar datos del archivo JSON
async function loadData() {
    try {
        const response = await fetch('/Data/sales_by_country.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar sales_by_country.json');
        }
        const data = await response.json();
        console.log('Datos cargados:', data); // Verificar datos cargados en la consola
        return data; // Devuelve el objeto completo de datos
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Inicializar gráfico
let predictionsChart;

// Crear gráfico para un país específico
async function createChart(countryData, labels) {
    const ctx = document.getElementById('predictionsChart').getContext('2d');

    // Destruir gráfico anterior si existe
    if (predictionsChart) {
        predictionsChart.destroy();
    }

    predictionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas Mensuales de ' + countryData.pais,
                data: countryData.totales,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
}

// Filtrar y mostrar gráfico de un país
async function showGraph(country) {
    const data = await loadData();
    if (!data || !data[country]) return; // Verificar si los datos están cargados correctamente

    const countryData = {
        pais: country,
        totales: data[country].totales
    };

    // Crear el gráfico para el país seleccionado
    createChart(countryData, [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]);
}

// Mostrar datos de un país específico al cargar la página
window.onload = () => showGraph('Australia'); // Cambia 'Australia' según el país inicial que desees mostrar
