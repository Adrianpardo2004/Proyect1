document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('countrySelect');

    // Cargar archivo JSON
    fetch('/Data/predictions_2024.json')
        .then(response => response.json())
        .then(data => {
            // Obtener y mostrar países únicos en el selector
            const countries = [...new Set(Object.values(data).map(entry => entry.country))];
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });

            // Crear gráficos iniciales
            createCharts(data, 'all');

            // Filtrar gráficos según el país seleccionado
            countrySelect.addEventListener('change', (event) => {
                createCharts(data, event.target.value);
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});

// Función para crear gráficos filtrados por país
function createCharts(data, country) {
    const filteredData = country === 'all' 
        ? data 
        : Object.fromEntries(Object.entries(data).filter(([_, value]) => value.country === country));

    const labels = Object.keys(filteredData);
    const values = labels.map(key => filteredData[key].value);

    // Destruir gráficos existentes
    if (window.lineChart) window.lineChart.destroy();
    if (window.barChart) window.barChart.destroy();

    // Gráfico de línea
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    window.lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Predicción',
                data: values,
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78, 115, 223, 0.1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Mes' } },
                y: { title: { display: true, text: 'Valor' } }
            }
        }
    });

    // Gráfico de barras
    const barCtx = document.getElementById('barChart').getContext('2d');
    window.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Predicción',
                data: values,
                backgroundColor: '#4e73df'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Mes' } },
                y: { title: { display: true, text: 'Valor' } }
            }
        }
    });
}
