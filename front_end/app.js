const form = document.getElementById('comentarioForm');

form.addEventListener('submit', async (e) => {
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
  comentarios.forEach(c => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${c.nombre}</strong>: ${c.mensaje}`;
    lista.appendChild(div);
  });
}

window.onload = cargarComentarios;