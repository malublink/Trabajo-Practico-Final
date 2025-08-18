const express = require("express");
const path = require("path");
const pool = require("./data/db.js"); // conexión a PostgreSQL
const crearTablas = require("./data/initDB");

const app = express();
const PORT = process.env.PORT || 3000;

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
    console.error("❌ Error al obtener comentarios:", err);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

// 🔹 Guardar nuevo comentario
app.post("/comentarios", async (req, res) => {
  const { nombre, mensaje } = req.body;
  if (!nombre || !mensaje) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO comentarios (nombre, mensaje) VALUES ($1, $2) RETURNING *",
      [nombre, mensaje]
    );
    res.json(result.rows[0]); // devuelve el comentario recién creado
  } catch (err) {
    console.error("❌ Error al guardar comentario:", err);
    res.status(500).json({ error: "Error al guardar comentario" });
  }
});

// 🔹 Eliminar comentario
app.delete("/comentarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM comentarios WHERE id = $1", [id]);
    res.json({ success: true, id }); // ✅ respuesta JSON en vez de sendStatus
  } catch (err) {
    console.error("❌ Error al eliminar comentario:", err);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
});

// Inicializar tablas
crearTablas();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});