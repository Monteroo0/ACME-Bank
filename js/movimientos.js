import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Verifica si el usuario está autenticado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Debes iniciar sesión");
    location.href = "index.html";
    return;
  }

  // Actualiza el mensaje de bienvenida
  document.getElementById("bienvenidaUsuario").textContent = `Movimientos de ${usuario.nombres}`;

  // Cierra sesión al hacer clic en el botón correspondiente
  document.getElementById("btnCerrarSesion")?.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    location.href = "index.html";
  });

  try {
    // Obtiene las transacciones del usuario desde Firebase
    const snapshot = await get(ref(db, `transacciones/${usuario.clave}`));
    const data = snapshot.val();
    if (!data) return;

    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    // Función para determinar el grupo de fechas (Hoy, Ayer, o fecha específica)
    const esMismoDia = (a, b) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    const formatearGrupo = (fecha) => {
      if (esMismoDia(fecha, hoy)) return "Hoy";
      if (esMismoDia(fecha, ayer)) return "Ayer";
      const opciones = { day: "numeric", month: "long" };
      return new Intl.DateTimeFormat("es-CO", opciones).format(fecha);
    };

    // Procesa y ordena las transacciones por fecha
    const transacciones = Object.values(data)
      .map(tx => {
        let fechaReal = null;

        // Convierte la fecha según el formato disponible (timestamp o string)
        if (tx.timestamp) {
          fechaReal = new Date(tx.timestamp);
        } else if (tx.fecha) {
          const [fechaStr, horaStr] = tx.fecha.split(", ");
          const [dia, mes, anio] = fechaStr.split("/").map(Number);
          fechaReal = new Date(`${anio}-${mes}-${dia}T${horaStr.replace(" a. m.", "AM").replace(" p. m.", "PM")}`);
        }

        return fechaReal ? { ...tx, fechaObj: fechaReal } : null;
      })
      .filter(tx => tx !== null)
      .sort((a, b) => b.fechaObj - a.fechaObj);

    const lista = document.getElementById("listaMovimientos");
    let grupoActual = "";

    // Muestra las transacciones agrupadas por fecha
    transacciones.forEach(tx => {
      const grupo = formatearGrupo(tx.fechaObj);
      if (grupo !== grupoActual) {
        const separador = document.createElement("li");
        separador.innerHTML = `<h3 style="margin-top: 1em">${grupo}</h3>`;
        lista.appendChild(separador);
        grupoActual = grupo;
      }

      const li = document.createElement("li");
      let detalle = tx.concepto || tx.descripcion || "–";
      let montoTexto = `$${tx.monto.toLocaleString("es-CO")}`;
      let color = "black";

      // Ajusta el formato y color según el tipo de transacción
      if (["consignación", "envío", "retiro", "pago"].includes(tx.tipo.toLowerCase())) {
        montoTexto = `- $${tx.monto.toLocaleString("es-CO")}`;
        color = "red";
      } else if (tx.tipo.toLowerCase() === "recibido") {
        detalle = `De ${tx.remitente || "–"}`;
        montoTexto = `+ $${tx.monto.toLocaleString("es-CO")}`;
        color = "green";
      }

      li.innerHTML = `
        <strong>${tx.tipo.toUpperCase()}</strong> – ${detalle}<br>
        <span style="color: gray; font-size: 0.85rem">${tx.fecha}</span><br>
        <span style="font-weight: bold; color: ${color};">${montoTexto}</span>
      `;

      li.style.cursor = "pointer";
      // Muestra un resumen detallado al hacer clic en una transacción
      li.addEventListener("click", () => {
        const resumen = document.createElement("div");
        resumen.classList.add("resumen-transaccion");
        resumen.style.position = "fixed";
        resumen.style.top = "50%";
        resumen.style.left = "50%";
        resumen.style.transform = "translate(-50%, -50%)";
        resumen.style.backgroundColor = "#fff";
        resumen.style.padding = "20px";
        resumen.style.border = "1px solid #ccc";
        resumen.style.borderRadius = "8px";
        resumen.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        resumen.style.zIndex = "9999";
        resumen.style.width = "300px";

        resumen.innerHTML = `
          <button style="float:right; background:none; border:none; font-size:1.2em; cursor:pointer;">✖</button>
          <h3>Resumen de Transacción</h3>
          <p><strong>Fecha:</strong> ${tx.fecha}</p>
          <p><strong>Referencia:</strong> ${tx.referencia || "–"}</p>
          <p><strong>Tipo:</strong> ${tx.tipo}</p>
          <p><strong>Detalle:</strong> ${detalle}</p>
          <p><strong>Valor:</strong> ${montoTexto}</p>
          <button onclick="window.print()">Imprimir</button>
        `;

        resumen.querySelector("button").addEventListener("click", () => resumen.remove());
        document.body.appendChild(resumen);
      });

      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Error cargando movimientos:", err);
  }
});