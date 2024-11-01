// Cargar y procesar datos del archivo JSON
async function loadData() {
    try {
        const response = await fetch('/Data/predictions_2024.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar predictions_2024.json');
        }
        const data = await response.json();
        console.log('Datos cargados:', data); // Verificar datos cargados en la consola
        return Object.values(data); // Devuelve los valores del JSON en un array
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Definir meses para las etiquetas del gráfico
const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Inicializar gráfico
let predictionsChart;
async function createChart(data, labels) {
    const ctx = document.getElementById('predictionsChart').getContext('2d');

    // Destruir gráfico anterior si existe
    if (predictionsChart) {
        predictionsChart.destroy();
    }

    console.log('Creando gráfico con datos:', data); // Verificar datos en la consola

    predictionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Predicciones de Ventas 2024',
                data: data,
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

// Filtrar datos y mostrar gráficos
async function showGraph(filter) {
    const data = await loadData();
    if (!data) return; // Verificar si los datos están cargados correctamente

    let filteredData;
    let filteredLabels;

    switch(filter) {
        case 'even':
            filteredData = data.filter((_, index) => (index + 1) % 2 === 0);
            filteredLabels = months.filter((_, index) => (index + 1) % 2 === 0);
            break;
        case 'odd':
            filteredData = data.filter((_, index) => (index + 1) % 2 !== 0);
            filteredLabels = months.filter((_, index) => (index + 1) % 2 !== 0);
            break;
        default:
            filteredData = data;
            filteredLabels = months;
    }

    createChart(filteredData, filteredLabels);
}

// Mostrar todos los datos al cargar la página
window.onload = () => showGraph('all');
