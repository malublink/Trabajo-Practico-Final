document.getElementById('comentarioForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const mensaje = document.getElementById('mensaje').value;

  const res = await fetch('/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, mensaje })
  });

  const comentarios = await res.json();
  mostrarComentarios(comentarios);
});

async function cargarComentarios() {
  const res = await fetch('/comentarios');
  const comentarios = await res.json();
  mostrarComentarios(comentarios);
}

function mostrarComentarios(comentarios) {
  const lista = document.getElementById('comentariosList');
  lista.innerHTML = '';
  comentarios.forEach((c, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${c.nombre}</strong>: ${c.mensaje}
      <button onclick="eliminarComentario(${index})" style="margin-left: 10px; color: red; background: none; border: none; cursor: pointer;">❌</button>
    `;
    lista.appendChild(div);
  });
}

async function eliminarComentario(index) {
  const confirmar = confirm("¿Seguro que querés borrar este comentario?");
  
  if (!confirmar) return; // Si el usuario cancela, no hace nada

  const res = await fetch(`/comentarios/${index}`, {
    method: 'DELETE'
  });

  const comentarios = await res.json();
  mostrarComentarios(comentarios);
}


window.onload = cargarComentarios;

