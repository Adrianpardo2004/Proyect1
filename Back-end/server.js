const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Usa CORS
app.use(cors());

// Middleware para servir archivos estáticos desde la carpeta 'public'

app.use(express.static(path.join(__dirname, '..', 'Front-end','public')));
app.use(express.static(path.join(__dirname, '..', 'Front-end','public', 'Login-Menu')));
app.use(express.static(path.join(__dirname, '..', 'Front-end','public', 'DashBoard')));
app.use(express.static(path.join(__dirname, '..', 'Front-end','public', 'Views','Sales')));
app.use(express.static(path.join(__dirname, '..', 'Front-end','public', 'Views','About')));
app.use(express.static(path.join(__dirname, '..', 'Front-end','public', 'Views','Charts')));
app.use(express.static(path.join(__dirname, 'public', 'app.js')));
// Ruta para el index.html (login) desde la carpeta SING_UP
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'Login-Menu', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});