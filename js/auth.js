import { db } from './firebase-config.js';
import { obtenerUsuario } from './usuarios.js';

const form = document.getElementById('loginForm');
const mensajeError = document.getElementById('mensajeError');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipo = document.getElementById('tipoIdentificacion').value;
  const numero = document.getElementById('numeroIdentificacion').value;
  const pass = document.getElementById('contrasena').value;

  const usuario = await obtenerUsuario(tipo, numero);

  if (usuario && usuario.contrasena === pass) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    window.location.href = 'dashboard.html';
  } else {
    mensajeError.textContent = 'Credenciales incorrectas. No se pudo validar su identidad.';
  }
});
