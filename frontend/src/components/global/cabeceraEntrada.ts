import { useSyncExternalStore } from "react";

/**
 * Señal compartida entre la cabecera de las páginas (WelcomeCabecera) y las bandas de
 * mármol (BandaMarmol): mientras la cabecera no ha terminado de escribir su titular,
 * NADA más de la página entra. El orden es siempre el mismo: primero el titular, y
 * solo después lo demás. Sin cabecera en la página, la señal está apagada y no
 * espera nada.
 */
let escribiendo = false;
const oyentes = new Set<() => void>();

export const marcarCabeceraEscribiendo = (valor: boolean) => {
  if (escribiendo === valor) return;
  escribiendo = valor;
  oyentes.forEach((f) => f());
};

export const useCabeceraEscribiendo = () =>
  useSyncExternalStore(
    (cb) => { oyentes.add(cb); return () => { oyentes.delete(cb); }; },
    () => escribiendo,
    () => false,
  );
