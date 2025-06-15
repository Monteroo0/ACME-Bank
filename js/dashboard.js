window.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Set saldo y datos
  document.getElementById("saldoCOP").textContent = usuario.saldo.toLocaleString("es-CO");
  document.getElementById("saldoUSD").textContent = (usuario.saldo / 4200).toFixed(2);
  document.getElementById("saldoEUR").textContent = (usuario.saldo / 4700).toFixed(2);

  document.getElementById("nombreUsuario").textContent = usuario.nombres;
  document.getElementById("ciudadUsuario").textContent = usuario.ciudad || "No registrada";
  document.getElementById("cuentaUsuario").textContent = usuario.numeroCuenta;
  document.getElementById("fechaCreacion").textContent = usuario.fechaCreacion;

  if (!usuario) {
    window.location.href = "index.html";
    return;
  }

  const nombre = usuario.nombres || "Usuario";

  const bienvenidaEl = document.getElementById("bienvenidaUsuario");
  const saldoEl = document.getElementById("saldoUsuario");
  const vista = document.getElementById("vistaDinamica");

  bienvenidaEl.textContent = `Bienvenido(a), ${nombre}`;
  saldoEl.textContent = `$${usuario.saldo.toLocaleString("es-CO")}`;



  const btnCerrar = document.querySelector(".logout");
  btnCerrar.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });


  document.querySelectorAll("[data-accion]").forEach(btn => {
    btn.addEventListener("click", () => {
      const accion = btn.dataset.accion;
      mostrarVista(accion);
    });
  });

  function mostrarVista(accion) {
    vista.innerHTML = "";

    if (accion === "consignar") {
      vista.innerHTML = `
        <div class="form-box">
          <h3>Consignar dinero</h3>
          <form id="formConsignar">
            <label for="valor">Monto a consignar:</label>
            <input type="number" id="valor" name="valor" min="1" required />
            <button type="submit">Consignar</button>
          </form>
        </div>
      `;

      const form = document.getElementById("formConsignar");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const valor = parseFloat(document.getElementById("valor").value);

        if (isNaN(valor) || valor <= 0) {
          alert("Ingrese un valor válido");
          return;
        }

        usuario.saldo += valor;
        localStorage.setItem("usuario", JSON.stringify(usuario));

        saldoEl.textContent = `$${usuario.saldo.toLocaleString("es-CO")}`;
        vista.innerHTML = `<p>Consignación exitosa por $${valor.toLocaleString("es-CO")}.</p>`;
      });
    }
  }
});
