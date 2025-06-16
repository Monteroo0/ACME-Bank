import { obtenerUsuario } from './usuarios.js';

const form = document.getElementById('loginForm');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const tipo = document.getElementById('tipoIdentificacion').value;
    const numero = document.getElementById('numeroIdentificacion').value;
    const pass = document.getElementById('contrasena').value;

    const usuario = await obtenerUsuario(tipo, numero);

    if (usuario && usuario.contrasena === pass) {
        const clave = `${tipo}_${numero}`;

        localStorage.setItem('usuario', JSON.stringify({
            ...usuario,
            clave
        }));

        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('ventanaError').classList.remove('oculto');
    }
});

function cerrarVentana() {
    document.getElementById('ventanaError').classList.add('oculto');
}
