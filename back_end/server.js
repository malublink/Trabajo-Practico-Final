const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

const comentariosPath = path.join(__dirname, 'comentarios.json');

// 🧠 Leer los comentarios guardados en el archivo
let comentarios = [];
if (fs.existsSync(comentariosPath)) {
  const data = fs.readFileSync(comentariosPath, 'utf-8');
  comentarios = JSON.parse(data);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, '../front_end')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../front_end/index.html'));
});

// Obtener comentarios
app.get('/comentarios', (req, res) => {
  res.json(comentarios);
});

// Guardar nuevo comentario
app.post('/comentarios', (req, res) => {
  const { nombre, mensaje } = req.body;
  if (nombre && mensaje) {
    const nuevoComentario = { nombre, mensaje };
    comentarios.push(nuevoComentario);

    const fs = require('fs'); 


app.delete('/comentarios/:index', (req, res) => {
  const index = parseInt(req.params.index);

  if (!isNaN(index) && index >= 0 && index < comentarios.length) {
    comentarios.splice(index, 1);
    fs.writeFileSync(comentariosPath, JSON.stringify(comentarios, null, 2));
  }

  res.json(comentarios);
});

    // 💾 Guardar en el archivo
    fs.writeFileSync(comentariosPath, JSON.stringify(comentarios, null, 2));
  }
  res.json(comentarios);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});