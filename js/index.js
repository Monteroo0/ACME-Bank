const form = document.getElementById('loginForm');
const mensajeError = document.getElementById('mensajeError');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const tipo = document.getElementById('tipoIdentificacion').value;
    const numero = document.getElementById('numeroIdentificacion').value;
    const pass = document.getElementById('contrasena').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
    const usuario = usuarios[numero];

    if (usuario && usuario.tipoIdentificacion === tipo && usuario.contrasena === pass) {
        localStorage.setItem('usuarioActivo', numero);
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('ventanaError').classList.remove('oculto');
    }
});

function cerrarVentana() {
    document.getElementById('ventanaError').classList.add('oculto');
}
