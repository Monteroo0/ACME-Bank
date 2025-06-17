import { obtenerUsuario } from './usuarios.js';

// Obtiene el formulario de login
const form = document.getElementById('loginForm');

// Maneja el envío del formulario de login
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipo = document.getElementById('tipoIdentificacion').value;
  const numero = document.getElementById('numeroIdentificacion').value;
  const pass = document.getElementById('contrasena').value;

  // Obtiene los datos del usuario desde Firebase
  const usuario = await obtenerUsuario(tipo, numero);

  // Verifica las credenciales y autentica al usuario
  if (usuario && usuario.contrasena === pass) {
    const clave = `${tipo}_${numero}`;

    // Almacena los datos del usuario en localStorage
    localStorage.setItem('usuario', JSON.stringify({
      ...usuario,
      clave
    }));

    // Redirige al dashboard
    window.location.href = 'dashboard.html';
  } else {
    // Muestra una ventana de error si las credenciales son incorrectas
    document.getElementById('ventanaError').classList.remove('oculto');
  }
});

// Cierra la ventana de error
function cerrarVentana() {
  document.getElementById('ventanaError').classList.add('oculto');
}