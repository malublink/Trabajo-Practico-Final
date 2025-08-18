document.getElementById('comentarioForm').addEventListener('submit', async (e) => { 
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const mensaje = document.getElementById('mensaje').value;

  if (!nombre || !mensaje) return;

  const res = await fetch('/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, mensaje })
  });

  const nuevoComentario = await res.json();
  agregarComentario(nuevoComentario);

  // Limpiar campos
  document.getElementById('nombre').value = '';
  document.getElementById('mensaje').value = '';
});

// Enviar con Enter
document.getElementById('mensaje').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('comentarioForm').requestSubmit();
  }
});

async function cargarComentarios() {
  const res = await fetch('/comentarios');
  const comentarios = await res.json();
  mostrarComentarios(comentarios);
}
function mostrarComentarios(comentarios) {
  const lista = document.getElementById('comentariosList');
  lista.innerHTML = '';
  comentarios.forEach(c => agregarComentario(c));
}

function agregarComentario(c) {
  const lista = document.getElementById('comentariosList');
  const div = document.createElement('div');
  div.innerHTML = `
    <strong>${c.nombre}</strong>: ${c.mensaje}
    <button onclick="eliminarComentario(${c.id}, this.parentElement)" 
      style="margin-left: 10px; color: red; background: none; border: none; cursor: pointer;">
      ❌
    </button>
  `;
  lista.prepend(div);
}

async function eliminarComentario(id, div) {
  const confirmar = confirm("¿Seguro que querés borrar este comentario?");
  if (!confirmar) return;

  await fetch(`/comentarios/${id}`, { method: 'DELETE' });
  div.remove(); // directamente borra el comentario del DOM
}
window.onload = cargarComentarios;