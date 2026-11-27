import { useLocation } from "react-router-dom";
import { limpiarRastroDeLectura } from "../../api/persona";

/**
 * Al entrar en la plataforma pública, borra el rastro de una cuenta de lectura (ver `limpiarRastroDeLectura`).
 * Se ejecuta durante el render, ANTES de que las páginas (que van después en el árbol) pinten su header, para que
 * ese header nunca llegue a leer el nombre de otra persona. Es idempotente.
 */
export default function LimpiarRastroLectura() {
  useLocation(); // se vuelve a ejecutar en cada cambio de página
  limpiarRastroDeLectura();
  return null;
}
