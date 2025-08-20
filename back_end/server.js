const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

const comentariosPath = path.join(__dirname, 'comentarios.json');

// Leer comentarios guardados en el archivo
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

// 👉 Obtener comentarios
app.get('/comentarios', (req, res) => {
  res.json(comentarios);
});

// 👉 Guardar nuevo comentario
app.post('/comentarios', (req, res) => {
  const { nombre, mensaje } = req.body;
  if (nombre && mensaje) {
    const nuevoComentario = { 
      nombre, 
      mensaje, 
      fecha: new Date().toLocaleString("es-AR"),
      likes: 0  // 👍 inicial
    };
    comentarios.push(nuevoComentario);

    fs.writeFileSync(comentariosPath, JSON.stringify(comentarios, null, 2));
  }
  res.json(comentarios);
});

// 👉 Dar like a un comentario
app.post('/comentarios/:index/like', (req, res) => {
  const index = parseInt(req.params.index);

  if (!isNaN(index) && index >= 0 && index < comentarios.length) {
    comentarios[index].likes++;
    fs.writeFileSync(comentariosPath, JSON.stringify(comentarios, null, 2));
    return res.json(comentarios[index]);
  }

  res.status(400).send("Comentario no encontrado");
});

// 👉 Eliminar comentario por índice
app.delete('/comentarios/:index', (req, res) => {
  const index = parseInt(req.params.index);

  if (!isNaN(index) && index >= 0 && index < comentarios.length) {
    comentarios.splice(index, 1);
    fs.writeFileSync(comentariosPath, JSON.stringify(comentarios, null, 2));
  }

  res.json(comentarios);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});