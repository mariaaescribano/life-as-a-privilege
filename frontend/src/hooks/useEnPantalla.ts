import { useEffect, useState } from "react";

/**
 * ¿Ha asomado ya este elemento en pantalla? Dispara UNA vez y se desconecta.
 *
 * Para qué: las entradas que se disparan al cargar la página (un `mounted` que
 * se pone a true y ya) animan aunque el elemento esté metros más abajo. Cuando
 * el usuario baja hasta él, la animación ya ocurrió y se lo encuentra quieto —
 * o sea, el efecto no lo ve nadie. Con esto la entrada espera a que el elemento
 * asome de verdad.
 *
 * Se usa como callback ref (`ref={ref}`), no como objeto ref, para que funcione
 * aunque el nodo aparezca en el DOM más tarde (páginas que primero muestran una
 * pantalla de carga y luego el contenido).
 *
 * @param rootMargin margen del observador. Por defecto sube el borde inferior de
 * la pantalla un 25% (`0px 0px -25% 0px`), de modo que no cuenta como visto
 * hasta que el elemento ha entrado de verdad, no cuando solo asoma su borde por
 * abajo. Es importante: con un umbral normal, un bloque que asoma un poco al
 * cargar la página dispara su entrada ahí mismo — mientras se mira la cabecera —
 * y al bajar hasta él ya está colocado. Al ir en porcentaje se comporta igual en
 * pantallas grandes y pequeñas.
 */
export function useEnPantalla(rootMargin = "0px 0px -25% 0px") {
  const [visto, setVisto] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node || visto) return;
    const obs = new IntersectionObserver(
      ([entrada]) => { if (entrada.isIntersecting) { setVisto(true); obs.disconnect(); } },
      { rootMargin },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node, visto, rootMargin]);

  return { ref: setNode, visto };
}
