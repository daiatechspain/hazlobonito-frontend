const BASE_URL = 'https://hazlobonit-o-backend.onrender.com';

// REGISTRO
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.error || 'Error al registrarse');
    }
  });
}

// LOGIN
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.error || 'Error al iniciar sesión');
    }
  });
}

// DASHBOARD – IA
if (document.getElementById('texto')) {
  document.getElementById('resultado').innerText = "";

  document.querySelector('button').addEventListener('click', async () => {
    const estilo = document.getElementById("estilo").value;
    const texto = document.getElementById("texto").value;
    const token = localStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/api/rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ estilo, texto })
    });

    const data = await res.json();
    document.getElementById('resultado').innerText = data.resultado || data.error;
  });
}

// CERRAR SESIÓN
function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// VER HISTORIAL
async function verHistorial() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/rewrite/history`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  const contenedor = document.getElementById("historial");
  contenedor.innerHTML = "";

  if (data.historial.length === 0) {
    contenedor.innerHTML = "<p>No tienes historial aún.</p>";
    return;
  }

  data.historial.forEach((item, i) => {
    const bloque = document.createElement("div");
    bloque.style.border = "1px solid #ccc";
    bloque.style.padding = "10px";
    bloque.style.margin = "10px 0";
    bloque.innerHTML = `
      <strong>Estilo:</strong> ${item.estilo}<br/>
      <strong>Original:</strong> ${item.original}<br/>
      <strong>Reescrito:</strong> ${item.rewritten}<br/>
      <small>${new Date(item.created_at).toLocaleString()}</small>
    `;
    contenedor.appendChild(bloque);
  });
}
