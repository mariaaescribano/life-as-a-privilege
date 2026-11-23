// ¿Estamos en la web antigua? Vive bajo /antigua/*, con su propio enrutador (basename "/antigua", ver main.tsx):
// es el proyecto grande de antes, escondido para el TFG. Solo entra la cuenta de ANTIGUA_EMAILS (backend) y no
// hay registro. Se decide por la dirección y no por contexto para poder usarlo también fuera de los componentes.
export const esAntigua = (): boolean =>
  typeof window !== "undefined" && (window.location.pathname === "/antigua" || window.location.pathname.startsWith("/antigua/"));
