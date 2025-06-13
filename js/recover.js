import { db } from './firebase-config.js';
import { obtenerUsuario } from './usuarios.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const verificarForm = document.getElementById('verificarForm');
const nuevaForm = document.getElementById('nuevaContrasenaForm');
const mensaje = document.getElementById('mensajeRecuperacion');

let tipoGuardado = '';
let numeroGuardado = '';

verificarForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipo = document.getElementById('tipoIdentificacion').value;
  const numero = document.getElementById('numeroIdentificacion').value;
  const correo = document.getElementById('correo').value;

  const usuario = await obtenerUsuario(tipo, numero);

  if (usuario && usuario.correo === correo) {
    tipoGuardado = tipo;
    numeroGuardado = numero;
    verificarForm.classList.add('oculto');
    nuevaForm.classList.remove('oculto');
    mensaje.textContent = 'Verificación exitosa. Asigna una nueva contraseña.';
    mensaje.style.color = 'green';
  } else {
    mensaje.textContent = 'Datos incorrectos. Verifica la información.';
    mensaje.style.color = 'red';
  }
});

nuevaForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nuevaContrasena = document.getElementById('nuevaContrasena').value;

  const ruta = `usuarios/${tipoGuardado}_${numeroGuardado}`;
  const usuarioRef = ref(db, ruta);

  try {
    await update(usuarioRef, { contrasena: nuevaContrasena });
    mensaje.textContent = '¡Contraseña actualizada exitosamente!';
    mensaje.style.color = 'green';
    nuevaForm.reset();
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (error) {
    console.error(error);
    mensaje.textContent = 'Error al actualizar la contraseña.';
    mensaje.style.color = 'red';
  }
});

window.cancelar = function () {
  window.location.href = 'index.html';
};
