# Portal Transaccional – Acme Bank

**Autores:**  
Juan Esteban Montero Arias  
Kennei Santiago Romero Becerra

---

## Descripción del Proyecto

El Banco Acme ha desarrollado una aplicación web que permite a los usuarios la autogestión de sus cuentas bancarias, ofreciendo funcionalidades como registro, recuperación de contraseña, visualización de movimientos, transacciones en línea, pagos de servicios y emisión de certificados.

El sistema se basa en una interfaz web responsive, compatible con dispositivos móviles, tablets y desktop.

---

## Instrucciones para instalar y ejecutar el proyecto

1. **Requisitos previos:**
    - Un navegador web moderno (Chrome, Firefox, Edge, Safari)
    - No requiere instalación de software adicional (proyecto 100% en HTML, CSS y JavaScript)

2. **Instrucciones:**
    - Clona o descarga el repositorio del proyecto.
    - Abre el archivo `index.html` en tu navegador.
    - Para pruebas completas, es recomendable habilitar el uso de almacenamiento local (localStorage) en el navegador.

---

## Funcionalidades

### Página de Inicio de sesión
- Formulario de autenticación (tipo de identificación, número de identificación, contraseña).
- Validación de credenciales con almacenamiento local.
- Redirección a Dashboard en caso de éxito.
- Mensajes de error en caso de fallo.
- Enlaces a "Crear cuenta" y "Recuperar contraseña".

### Formulario de Registro
- Formulario completo con validación de todos los campos.
- Generación automática de número de cuenta y fecha de creación.
- Resumen de registro con información generada.
- Enlace para regresar al login.

### Recuperación de Contraseña
- Formulario para recuperar contraseña basado en identificación y correo.
- Verificación de datos y habilitación de nuevo formulario para asignar contraseña.
- Botón de cancelar que redirige al login.

### Dashboard (Página principal)
- Resumen de cuenta (saldo actual, número de cuenta, fecha de creación).
- Menú lateral para navegación.
- Diseño responsive: barra de botones en dispositivos móviles.
- Botón de Cerrar sesión.

### Resumen de Transacciones
- Muestra las últimas 10 transacciones.
- Opción de imprimir el resumen.

### Consignación Electrónica
- Formulario para consignación.
- Actualización de saldo al consignar.
- Registro de transacción con referencia y detalles.
- Resumen imprimible.

### Retiro de Dinero
- Formulario para retiro.
- Actualización de saldo al retirar.
- Registro de transacción con referencia y detalles.
- Resumen imprimible.

### Pago de Servicios Públicos
- Selección de servicio público.
- Formulario de pago.
- Actualización de saldo.
- Registro de transacción con detalles.
- Resumen imprimible.

### Extracto Bancario
- Selección de año y mes.
- Generación de reporte de movimientos del periodo seleccionado.

### Certificado Bancario
- Generación de certificado de cuenta activa.
- Opción de impresión.

---

## 💾 Tecnologías usadas
- HTML
- CSS (Responsive Design con Media Queries)
- JavaScript (manejo de eventos, DOM, localStorage)

---

## Observaciones
- La persistencia de datos se maneja con `localStorage` en formato JSON.
- El número de referencia de transacciones se genera aleatoriamente.
- Todo el flujo de navegación y estados se controla desde el lado del cliente.
