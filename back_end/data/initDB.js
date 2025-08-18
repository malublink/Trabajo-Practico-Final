const pool = require("./db");

async function crearTablas() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comentarios (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        mensaje TEXT NOT NULL
      )
    `);
    console.log("✅ Tabla 'comentarios' verificada/creada");
    } catch (err) {
    console.error("❌ Error creando la tabla:", err);
    }
}

module.exports = crearTablas;