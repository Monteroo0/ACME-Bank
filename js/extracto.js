import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  // Verifica si el usuario está autenticado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const cuentaInput = document.getElementById("cuentaUsuario");
  const nombreInput = document.getElementById("nombreUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  const bienvenida = document.getElementById("bienvenidaUsuario");
  const btnGenerar = document.getElementById("btnGenerar");

  if (!usuario) {
    alert("No has iniciado sesión.");
    window.location.href = "index.html";
    return;
  }

  // Rellena los campos de la interfaz con datos del usuario
  cuentaInput.value = usuario.numeroCuenta;
  nombreInput.value = `${usuario.nombres} ${usuario.apellidos}`;
  bienvenida.textContent = `Bienvenido(a), ${usuario.nombres}`;

  // Cierra sesión al hacer clic en el botón correspondiente
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });

  // Genera un extracto bancario al hacer clic en el botón
  btnGenerar.addEventListener("click", async () => {
    const anio = document.getElementById("anio").value;
    const mes = document.getElementById("mes").value;

    // Valida que se hayan seleccionado año y mes
    if (!anio || !mes) {
      alert("Por favor ingresa el año y mes para el extracto.");
      return;
    }

    try {
      // Obtiene las transacciones del usuario desde Firebase
      const snapshot = await get(ref(db, `transacciones/${usuario.clave}`));
      const transacciones = snapshot.val();
      const movimientosFiltrados = [];

      // Filtra transacciones por el año y mes seleccionados
      for (const key in transacciones) {
        const tx = transacciones[key];
        const [dia, mesTx, anioTx] = tx.fecha.split(",")[0].split("/");

        if (mesTx === mes && anioTx === anio) {
          movimientosFiltrados.push(tx);
        }
      }

      if (movimientosFiltrados.length === 0) {
        alert("No se encontraron movimientos para ese período.");
        return;
      }

      // Crea el contenido del extracto en formato texto
      let contenido = `Extracto Bancario - ${nombreInput.value} (${cuentaInput.value})\n\n`;
      contenido += `Fecha\t\tReferencia\tTipo\t\tConcepto\t\tValor\n`;
      contenido += `-----------------------------------------------------------------\n`;

      movimientosFiltrados.forEach(tx => {
        contenido += `${tx.fecha}\t${tx.referencia}\t${tx.tipo}\t${tx.concepto}\t$${tx.monto.toLocaleString("es-CO")}\n`;
      });

      // Genera y descarga el archivo de texto
      const blob = new Blob([contenido], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Extracto_${mes}_${anio}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando extracto:", error);
      alert("Error al generar el extracto.");
    }
  });
});