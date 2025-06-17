import { db } from './firebase-config.js';
import { obtenerUsuario } from './usuarios.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const verificarForm = document.getElementById('verificarForm');
const nuevaForm = document.getElementById('nuevaContrasenaForm');
const mensaje = document.getElementById('mensajeRecuperacion');

let tipoGuardado = '';
let numeroGuardado = '';

// Maneja la verificación de los datos del usuario para recuperar la contraseña
verificarForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipo = document.getElementById('tipoIdentificacion').value;
  const numero = document.getElementById('numeroIdentificacion').value;
  const correo = document.getElementById('correo').value;

  // Verifica los datos del usuario en Firebase
  const usuario = await obtenerUsuario(tipo, numero);

  if (usuario && usuario.correo === correo) {
    // Almacena los datos temporalmente y muestra el formulario para nueva contraseña
    tipoGuardado = tipo;
    numeroGuardado = numero;
    verificarForm.classList.add('oculto');
    nuevaForm.classList.remove('oculto');
    mensaje.textContent = 'Verificación exitosa. Asigna una nueva contraseña.';
    mensaje.style.color = 'green';
  } else {
    // Muestra un mensaje de error si los datos no coinciden
    mensaje.textContent = 'Datos incorrectos. Verifica la información.';
    mensaje.style.color = 'red';
  }
});

// Actualiza la contraseña del usuario
nuevaForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nuevaContrasena = document.getElementById('nuevaContrasena').value;

  // Construye la ruta del usuario en Firebase
  const ruta = `usuarios/${tipoGuardado}_${numeroGuardado}`;
  const usuarioRef = ref(db, ruta);

  try {
    // Actualiza la contraseña en la base de datos
    await update(usuarioRef, { contrasena: nuevaContrasena });
    mensaje.textContent = '¡Contraseña actualizada exitosamente!';
    mensaje.style.color = 'green';
    nuevaForm.reset();
    // Redirige al login después de 1.5 segundos
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (error) {
    console.error(error);
    mensaje.textContent = 'Error al actualizar la contraseña.';
    mensaje.style.color = 'red';
  }
});

// Cancela la recuperación y redirige al login
window.cancelar = function () {
  window.location.href = 'index.html';
};