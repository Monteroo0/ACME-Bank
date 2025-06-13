import { db } from './firebase-config.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js';

const form = document.getElementById('registroForm');
const mensaje = document.getElementById('mensajeRegistro');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipoId = document.getElementById('tipoId').value;
  const identificacion = document.getElementById('numeroIdentificacion').value;
  const nombres = document.getElementById('nombres').value;
  const apellidos = document.getElementById('apellidos').value;
  const genero = document.getElementById('genero').value;
  const telefono = document.getElementById('telefono').value;
  const correo = document.getElementById('correo').value;
  const direccion = document.getElementById('direccion').value;
  const ciudad = document.getElementById('ciudad').value;
  const contrasena = document.getElementById('contrasena').value;

  const clave = `${tipoId}_${identificacion}`;
  const usuario = {
    tipoId,
    identificacion,
    nombres,
    apellidos,
    genero,
    telefono,
    correo,
    direccion,
    ciudad,
    contrasena,
    fechaCreacion: new Date().toLocaleDateString(),
    saldo: 0,
    numeroCuenta: `ACME${Math.floor(Math.random() * 1000000)}`
  };

  try {
    await set(ref(db, 'usuarios/' + clave), usuario);
    mensaje.textContent = '¡Registro exitoso!';
    mensaje.style.color = 'green';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (error) {
    console.error('Error al registrar:', error);
    mensaje.textContent = 'Error al registrar el usuario.';
    mensaje.style.color = 'red';
  }
});
