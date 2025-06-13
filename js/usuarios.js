import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

export async function obtenerUsuario(tipo, numero) {
  const dbRef = ref(getDatabase());

  try {
    const snapshot = await get(child(dbRef, `usuarios/${numero}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.tipoIdentificacion === tipo) {
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}
