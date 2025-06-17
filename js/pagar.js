import { db } from "./firebase-config.js";
import { ref, push, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  // Verifica si el usuario está autenticado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Debes iniciar sesión");
    location.href = "index.html";
    return;
  }

  // Actualiza la interfaz con los datos del usuario
  document.getElementById("bienvenidaUsuario").textContent = `Bienvenido(a), ${usuario.nombres}`;
  document.getElementById("numeroCuenta").textContent = usuario.clave;
  document.getElementById("nombreUsuario").textContent = `${usuario.nombres} ${usuario.apellidos}`;

  // Cierra sesión al hacer clic en el botón correspondiente
  document.getElementById("btnCerrarSesion")?.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    location.href = "index.html";
  });

  const form = document.getElementById("formPagoServicios");
  const resumenDiv = document.getElementById("resumenPago");
  const btnImprimir = document.getElementById("btnImprimir");

  // Procesa el pago de un servicio al enviar el formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const servicio = document.getElementById("servicio").value;
    const referencia = document.getElementById("referencia").value;
    const valor = parseInt(document.getElementById("valor").value);

    // Formatea la fecha actual para registrar la transacción
    const fecha = new Date();
    const opcionesFecha = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const opcionesHora = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const fechaStr = fecha.toLocaleDateString("es-CO", opcionesFecha);
    const horaStr = fecha.toLocaleTimeString("es-CO", opcionesHora);
    const fechaCompleta = `${fechaStr}, ${horaStr}`;

    // Crea el objeto de la transacción
    const nuevaTransaccion = {
      tipo: "pago",
      concepto: `Pago de ${servicio}`,
      referencia: referencia,
      monto: valor,
      fecha: fechaCompleta,
      timestamp: fecha.getTime()
    };

    try {
      // Registra la transacción en Firebase
      await push(ref(db, `transacciones/${usuario.clave}`), nuevaTransaccion);

      // Muestra un resumen del pago en la interfaz
      resumenDiv.innerHTML = `
        <h4>Resumen del Pago</h4>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Referencia:</strong> ${referencia}</p>
        <p><strong>Valor pagado:</strong> $${valor.toLocaleString("es-CO")}</p>
        <p><strong>Fecha:</strong> ${fechaCompleta}</p>
      `;
      resumenDiv.style.display = "block";
      btnImprimir.style.display = "inline-block";

      alert("Pago realizado exitosamente.");
    } catch (err) {
      console.error("Error al registrar el pago:", err);
      alert("Hubo un error al registrar el pago.");
    }
  });

  // Imprime el resumen del pago
  btnImprimir.addEventListener("click", () => {
    window.print();
  });
});