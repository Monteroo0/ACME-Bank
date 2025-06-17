import { ref, onValue, update, push, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  // Obtiene referencias a elementos del DOM
  const cuentaDestinoInput = document.getElementById("cuentaDestino");
  const sugerenciasDiv = document.getElementById("sugerencias");
  const nombreDestinoInput = document.getElementById("nombreDestino");
  const montoInput = document.getElementById("valor");
  const btnConsignar = document.querySelector("button[type='submit']");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  // Verifica si el usuario está autenticado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("No has iniciado sesión. Redirigiendo al login.");
    window.location.href = "index.html";
    return;
  }

  // Muestra mensaje de bienvenida con el nombre del usuario
  if (usuario?.nombres) {
    const bienvenida = document.getElementById("bienvenidaUsuario");
    if (bienvenida) bienvenida.textContent = `Bienvenido(a), ${usuario.nombres}`;
  }

  // Cierra sesión al hacer clic en el botón correspondiente
  btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });

  // Implementa autocompletado para la cuenta destino
  cuentaDestinoInput.addEventListener("input", () => {
    const valor = cuentaDestinoInput.value.trim().toUpperCase();
    if (valor.length < 3) {
      sugerenciasDiv.innerHTML = "";
      sugerenciasDiv.style.display = "none";
      return;
    }

    // Consulta usuarios en Firebase para buscar coincidencias en el número de cuenta
    const usuariosRef = ref(db, "usuarios");
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      sugerenciasDiv.innerHTML = "";

      // Filtra usuarios según el número de cuenta ingresado
      const sugerencias = Object.values(data).filter(user =>
        user.numeroCuenta && user.numeroCuenta.includes(valor)
      );

      if (sugerencias.length === 0) {
        sugerenciasDiv.style.display = "none";
        return;
      }

      // Muestra sugerencias en la interfaz
      sugerencias.forEach(user => {
        const div = document.createElement("div");
        div.classList.add("sugerencia-item");
        // Corrección: Usa comillas invertidas para interpolación
        div.innerHTML = `<strong>${user.nombres} ${user.apellidos}</strong><br><span style="color: gray;">${user.numeroCuenta}</span>`;
        div.addEventListener("click", () => {
          cuentaDestinoInput.value = user.numeroCuenta;
          // Corrección: Usa comillas invertidas
          nombreDestinoInput.value = `${user.nombres} ${user.apellidos}`;
          sugerenciasDiv.style.display = "none";
        });
        sugerenciasDiv.appendChild(div);
      });
      sugerenciasDiv.style.display = "block";
    }, { onlyOnce: true });
  });

  // Procesa la consignación al hacer clic en el botón
  btnConsignar.addEventListener("click", async (e) => {
    e.preventDefault();

    const cuenta = cuentaDestinoInput.value.trim();
    const nombre = nombreDestinoInput.value.trim();
    const monto = parseFloat(montoInput.value.trim());

    // Valida que los campos sean correctos
    if (!cuenta || !nombre || isNaN(monto) || monto <= 0) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    try {
      // Busca la cuenta destino en la base de datos
      const snapshot = await get(ref(db, "usuarios"));
      const data = snapshot.val();
      let claveDestino = null;
      let usuarioDestino = null;

      for (const clave in data) {
        if (data[clave].numeroCuenta === cuenta) {
          claveDestino = clave;
          usuarioDestino = data[clave];
          break;
        }
      }

      if (!claveDestino) {
        alert("Cuenta de destino no encontrada.");
        return;
      }

      // Verifica si el remitente tiene saldo suficiente
      if ((usuario.saldo || 0) < monto) {
        alert("Saldo insuficiente.");
        return;
      }

      // Actualiza los saldos de ambas cuentas
      const nuevoSaldoDestino = (usuarioDestino.saldo || 0) + monto;
      await update(ref(db, `usuarios/${claveDestino}`), { saldo: nuevoSaldoDestino });

      const nuevoSaldoRemitente = (usuario.saldo || 0) - monto;
      await update(ref(db, `usuarios/${usuario.clave}`), { saldo: nuevoSaldoRemitente });

      // Actualiza el saldo en localStorage
      usuario.saldo = nuevoSaldoRemitente;
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Genera una referencia única y registra la transacción
      const referencia = crypto.randomUUID();
      const ahora = new Date();
      const fechaFormateada = ahora.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      const timestamp = ahora.getTime();

      // Registra la transacción para el remitente
      await push(ref(db, `transacciones/${usuario.clave}`), {
        referencia,
        tipo: "consignación",
        concepto: "Consignación por canal electrónico",
        monto,
        fecha: fechaFormateada,
        timestamp,
        destinatario: nombre,
        cuentaDestino: cuenta
      });

      // Registra la transacción para el destinatario
      await push(ref(db, `transacciones/${claveDestino}`), {
        referencia,
        tipo: "recibido",
        monto,
        fecha: fechaFormateada,
        timestamp,
        remitente: `${usuario.nombres} ${usuario.apellidos}`,
        cuentaOrigen: usuario.numeroCuenta
      });
      
      // Muestra un resumen de la transacción en la interfaz
      const resumen = document.createElement("div");
      resumen.classList.add("resumen-transaccion");
      resumen.innerHTML = `
        <button class="cerrar-resumen">✖</button>
        <h3>Recibo de Consignación</h3>
        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
        <p><strong>Referencia:</strong> ${referencia}</p>
        <p><strong>Tipo:</strong> Consignación</p>
        <p><strong>Concepto:</strong> Consignación por canal electrónico</p>
        <p><strong>Valor:</strong> $${monto.toLocaleString("es-CO")}</p>
        <button onclick="window.print()">Imprimir</button>
      `;
      document.body.appendChild(resumen);
      resumen.querySelector(".cerrar-resumen").addEventListener("click", () => resumen.remove());

      // Notifica al usuario y limpia los campos
      alert(`Consignación de $${monto.toLocaleString("es-CO")} realizada exitosamente ✅`);
      cuentaDestinoInput.value = "";
      nombreDestinoInput.value = "";
      montoInput.value = "";
    } catch (error) {
      console.error("Error detallado al consignar:", error.message, error);
      alert("Error al realizar la consignación: " + error.message);
    }
  });
});