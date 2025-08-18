const express = require("express");
const path = require("path");
const pool = require("./data/db.js"); // conexión a PostgreSQL
const crearTablas = require("./data/initDB");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../front_end")));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front_end/index.html"));
});

// 🔹 Obtener comentarios
app.get("/comentarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comentarios ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener comentarios");
  }
});

// 🔹 Guardar nuevo comentario
app.post("/comentarios", async (req, res) => {
  const { nombre, mensaje } = req.body;
  if (!nombre || !mensaje) return res.status(400).send("Faltan datos");

  try {
    const result = await pool.query(
      "INSERT INTO comentarios (nombre, mensaje) VALUES ($1, $2) RETURNING *",
      [nombre, mensaje]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al guardar comentario");
  }
});

// 🔹 Eliminar comentario
app.delete("/comentarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM comentarios WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar comentario");
  }
});

// Inicializar tablas
crearTablas();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});