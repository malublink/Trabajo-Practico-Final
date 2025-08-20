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

  const comentarios = await res.json();
  mostrarComentarios(comentarios);

  // ✅ limpiar los campos *después* de enviar
  document.getElementById('nombre').value = '';
  document.getElementById('mensaje').value = '';
});

// 👉 Enviar con Enter
document.getElementById('mensaje').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('comentarioForm').requestSubmit();
  }
});

// 👉 Cargar comentarios al inicio
async function cargarComentarios() {
  const res = await fetch('/comentarios');
  const comentarios = await res.json();
  mostrarComentarios(comentarios);
}

// 👉 Mostrar comentarios
function mostrarComentarios(comentarios) {
  const lista = document.getElementById('comentariosList');
  lista.innerHTML = '';
  comentarios.forEach((c, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${c.nombre}</strong> (${c.fecha || 'Sin fecha'}): 
      ${c.mensaje}
      <button onclick="eliminarComentario(${index})"
        style="margin-left: 10px; color: red; background: none; border: none; cursor: pointer;">
        ❌
      </button>
      <button onclick="darLike(${index}, this)" 
        style="margin-left: 10px; color: blue; background: none; border: none; cursor: pointer;">
        👍 ${c.likes || 0}
      </button>
    `;
    lista.appendChild(div);
  });
}

async function darLike(index, btn) {
  const res = await fetch(`/comentarios/${index}/like`, { method: 'POST' });
  const comentario = await res.json();
  btn.innerHTML = `👍 ${comentario.likes}`;
}

// 👉 Eliminar comentario
async function eliminarComentario(index) {
  const confirmar = confirm("¿Seguro que querés borrar este comentario?");
  if (!confirmar) return;

  const res = await fetch(`/comentarios/${index}`, {
    method: 'DELETE'
  });

  const comentarios = await res.json();
  mostrarComentarios(comentarios);
}

window.onload = cargarComentarios;