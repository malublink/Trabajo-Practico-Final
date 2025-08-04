const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 💾 Almacenamiento en memoria (por ahora)
let comentarios = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, '../front_end')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../front_end/index.html'));
});

app.get('/comentarios', (req, res) => {
  res.json(comentarios);
});

app.post('/comentarios', (req, res) => {
  const { nombre, mensaje } = req.body;
  if (nombre && mensaje) {
    comentarios.push({ nombre, mensaje });
  }
  res.json(comentarios);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});