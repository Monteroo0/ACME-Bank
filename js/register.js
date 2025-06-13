const form = document.getElementById('registroForm');
const mensaje = document.getElementById('mensajeRegistro');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Capturar datos del formulario
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

  // Cargar usuarios actuales desde localStorage o crear objeto vacío
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

  // Verificar si ya existe
  if (usuarios[identificacion]) {
    mensaje.textContent = 'Este usuario ya está registrado.';
    mensaje.style.color = 'orange';
    return;
  }

  // Guardar nuevo usuario
  usuarios[identificacion] = {
    tipoIdentificacion: tipoId,
    nombres,
    apellidos,
    genero,
    telefono,
    correo,
    direccion,
    ciudad,
    contrasena
  };

  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  mensaje.textContent = '¡Registro exitoso!';
  mensaje.style.color = 'green';

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
});
