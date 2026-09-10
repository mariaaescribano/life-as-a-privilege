// ─────────────────────────────────────────────────────────────────────────
// «CREA TUS PROPIOS APUNTES» · MEDICINA CHINA
//
// La lista de capítulos que la persona puede marcar al final del recorrido. No
// hay texto nuevo aquí: TODO sale de los mismos archivos de contenido que pintan
// las páginas de la web, así que corregir una frase allí la corrige también en
// el PDF. Este archivo solo decide qué se agrupa en cada capítulo y con qué
// bloques del taller se compone.
//
// Los dos primeros capítulos son SUYOS (su diagnóstico y su lengua) y por eso
// pueden salir con candado: sin los tests hechos no hay nada que imprimir. El
// resto es contenido de la disciplina y está siempre disponible.
//
// Para añadir un capítulo: un objeto más en la lista, con sus fotos y su
// `pintar`. Nada más.
// ─────────────────────────────────────────────────────────────────────────
import type { ApuntesCapitulo, ApuntesLibro } from "../../../utils/pdf/apuntesTipos";
import type { Taller } from "../../../utils/pdf/atelier";
import type { FotoCache } from "../../../utils/pdf/fotos";
import { TEMA_TCM, COLOR_ELEMENTO } from "../../../utils/pdf/temas";
import { cicloWuXing } from "../../../utils/pdf/formas";
import { seguro } from "../../../utils/pdf/glifos";
import type { Vineta } from "../ComicViewer";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, diagnosticoElemento, elementoMasCargado,
  elementosTestsCompletos, type DatosTcm, type Elemento, type VeredictoBalance,
} from "../tcmRecorrido";
import { FOTO_ELEMENTO } from "../tcmElementosContenido";
import {
  DIMENSIONES_SELECCIONABLES, PATRONES, lenguaCompleta, opcionElegida, patronesPredominantes,
} from "../tcmLenguaContenido";
import { FOTO_COCINA, cocinaDe } from "../tcmCocinaContenido";
import { LEYES_TAO, FOTO_LEY, TAOISMO_INTRO, TAOISMO_CIERRE } from "../tcmTaoismoContenido";
import {
  BROCADOS, FOTO_POSTURA, QIGONG_NOTA,
  CINCO_ANIMALES_VINETAS, DAO_YIN_VINETAS, HISTORIA_QIGONG_VINETAS,
} from "../tcmQigongContenido";
import { VINETAS_ENFERMEDADES } from "../comicEnfermedades";

const ETIQUETA_VEREDICTO: Record<VeredictoBalance, string> = {
  equilibrio: "en equilibrio",
  carga: "en carga",
  recurso: "te sostiene",
};

/**
 * Rótulos SIN chino. La EB Garamond embebida no trae hanzi y se lo come sin
 * avisar (ver glifos.ts), así que un antetítulo como «虎 · Hígado» llegaría al
 * papel como « · Hígado», con el punto medio colgando de la nada. Aquí se pasa
 * el texto por el mismo filtro y se recogen los separadores que quedan sueltos.
 */
function rotulo(texto: string | undefined): string | undefined {
  if (!texto) return undefined;
  const limpio = seguro(texto)
    .replace(/\s+/g, " ")
    .replace(/·\s*·/g, "·")
    .replace(/^[\s·]+/, "")
    .replace(/[\s·]+$/, "")
    .trim();
  return limpio || undefined;
}

/** Pinta una tira de viñetas de las que ya existen en la web (los cómics). */
function pintarVinetas(t: Taller, fotos: FotoCache, vinetas: Vineta[], conFotos: boolean) {
  vinetas.forEach((v) => {
    t.vineta(conFotos ? fotos.get(v.src) : undefined, v.paragraphs, {
      titulo: rotulo(v.titulo),
      eyebrow: rotulo(v.eyebrow),
    });
  });
}

const srcsDeVinetas = (vinetas: Vineta[]) => vinetas.map((v) => v.src);

/**
 * El libro de Medicina China para ESTA persona: sus datos deciden qué capítulos
 * salen disponibles y qué se imprime en los dos personales.
 */
export function libroApuntesTcm(data: DatosTcm | null | undefined): ApuntesLibro {
  const testsHechos = elementosTestsCompletos(data);
  const lenguaHecha = lenguaCompleta(data?.observarte);

  /* ── 1 · TU DIAGNÓSTICO ───────────────────────────────────────────────── */
  const protagonista: Elemento = elementoMasCargado(data);
  const diagnostico: ApuntesCapitulo = {
    key: "diagnostico",
    titulo: "Tu diagnóstico",
    resumen: "tus cinco elementos, con su rueda dibujada, y lo que te toca cuidar",
    pordefecto: true,
    bloqueado: testsHechos ? undefined : "Termina los tests de los cinco elementos y aquí tendrás tu diagnóstico.",
    fotos: [FOTO_ELEMENTO[protagonista]],
    pintar: (t, fotos, conFotos) => {
      const tema = TEMA_TCM;
      const estados = ORDEN_ELEMENTOS.map((el) => ({
        el,
        d: diagnosticoElemento(el, data?.elementos?.[el]?.miniTest?.respuestas),
      }));

      t.capitulo(
        "Tu diagnóstico",
        "Un elemento muy cargado tira del que genera y ahoga al que controla: por eso se lee la rueda entera y no el pico más alto.",
      );

      t.lamina(
        112,
        (d, cx, cy) =>
          cicloWuXing(
            d, cx, cy, 40,
            estados.map(({ el, d: est }) => ({
              etiqueta: ELEMENTOS[el].nombre,
              color: COLOR_ELEMENTO[el],
              // El disco crece con la CARGA neta (lo que le pesa menos lo que
              // te da). Un elemento que te sostiene tira hacia el otro lado, así
              // que su disco se queda a cero: la lámina señala lo que pide
              // atención, igual que la estrella de la web.
              valor: Math.max(0, Math.round((est?.posicion ?? 0) * 100)),
            })),
            100,
            tema.apagado,
          ),
        "El anillo de fuera es el ciclo de generación; la estrella de dentro, el de control. Cada disco crece con la carga de su elemento.",
      );

      estados.forEach(({ el, d }) => {
        const E = ELEMENTOS[el];
        t.filaBarra({
          etiqueta: E.nombre,
          coletilla: d ? ETIQUETA_VEREDICTO[d.veredicto] : "sin responder",
          valor: d ? `${Math.round(d.magnitud * 100)} %` : "—",
          // La barra mide cuánto se aleja del equilibrio, hacia el lado que sea;
          // el lado lo dice la coletilla («en carga» / «te sostiene»).
          fraccion: d?.magnitud ?? 0,
          color: COLOR_ELEMENTO[el],
        });
      });

      t.divisor();

      const P = ELEMENTOS[protagonista];
      t.antetitulo("El que hoy pide atención");
      if (conFotos) t.foto(fotos.get(FOTO_ELEMENTO[protagonista]), { ancho: 96, altoMax: 74 });
      t.tarjeta({ titulo: P.nombre, cuerpo: P.significado, extra: `Órganos: ${P.organos} · Estación: ${P.estacion} · Sabor: ${P.sabor}` });
      t.antetitulo("Por dónde se te desequilibra");
      t.lista(P.desequilibrios);
      t.antetitulo("Lo que te sostiene");
      t.lista(P.habitos);
      t.parrafo(P.ejercicio, { cursiva: true, tam: 10.5 });
      t.antetitulo("En la cocina");
      t.lista(cocinaDe(protagonista).cadaDia);
      t.cierre(P.reflexion);
    },
  };

  /* ── 2 · TU LENGUA ────────────────────────────────────────────────────── */
  const lengua: ApuntesCapitulo = {
    key: "lengua",
    titulo: "Tu lengua",
    resumen: "lo que viste al mirarte, su lectura y los patrones a los que apunta",
    pordefecto: true,
    bloqueado: lenguaHecha ? undefined : "Lee tu lengua en su paso y aquí tendrás tu lectura completa.",
    fotos: DIMENSIONES_SELECCIONABLES
      .map((d) => opcionElegida(d.dim, data?.observarte)?.src)
      .filter((s): s is string => !!s),
    pintar: (t, fotos, conFotos) => {
      t.capitulo(
        "Tu lengua",
        "La lengua no miente y cambia rápido: repite esta observación dentro de unas semanas y compara con lo que aquí quedó escrito.",
      );

      DIMENSIONES_SELECCIONABLES.forEach((d) => {
        const op = opcionElegida(d.dim, data?.observarte);
        if (!op) return;
        t.vineta(conFotos ? fotos.get(op.src) : undefined, [op.lectura], {
          eyebrow: d.titulo,
          titulo: op.nombre,
        });
      });

      const patrones = patronesPredominantes(data?.observarte);
      t.divisor();
      if (patrones.length === 0) {
        t.antetitulo("Tu síntesis");
        t.parrafo(
          "Todos los signos que has marcado son los de una lengua sana: ni calor, ni frío, ni humedad, ni deficiencia. No hay nada que corregir; hay algo que mantener.",
          { capitular: true },
        );
        return;
      }
      t.antetitulo("Los patrones que apunta");
      patrones.forEach(({ patron, veces }) => {
        const info = PATRONES[patron];
        t.tarjeta({
          titulo: info.nombre,
          cuerpo: info.senal,
          extra: `${veces} ${veces === 1 ? "signo apunta" : "signos apuntan"} aquí · elemento ${ELEMENTOS[info.elemento].nombre}`,
        });
        t.lista(info.comoEquilibrar, { tam: 10.4 });
      });
    },
  };

  /* ── 3 · LOS CINCO ELEMENTOS ──────────────────────────────────────────── */
  const elementos: ApuntesCapitulo = {
    key: "elementos",
    titulo: "Los cinco elementos",
    resumen: "la ficha completa de los cinco: órganos, emoción, señales y hábitos",
    pordefecto: true,
    fotos: ORDEN_ELEMENTOS.map((el) => FOTO_ELEMENTO[el]),
    pintar: (t, fotos, conFotos) => {
      t.capitulo(
        "Los cinco elementos",
        "No son cinco cajones donde meterse: son cinco fases de una misma rueda. Esto es lo que rige cada una.",
      );
      ORDEN_ELEMENTOS.forEach((el, i) => {
        const E = ELEMENTOS[el];
        t.vineta(conFotos ? fotos.get(FOTO_ELEMENTO[el]) : undefined, [E.significado], {
          eyebrow: `${E.estacion} · sabor ${E.sabor.toLowerCase()}`,
          titulo: E.nombre,
        });
        t.glosario([
          `Órganos · ${E.organos}`,
          `Tejido · ${E.tejido}`,
          `Emoción · ${E.emocion}`,
          `Sentido · ${E.sentido}`,
        ]);
        t.antetitulo("Cuando fluye");
        t.lista(E.fortalezas, { tam: 10.4 });
        t.antetitulo("Cuando se desequilibra");
        t.lista(E.desequilibrios, { tam: 10.4 });
        t.antetitulo("Lo que lo sostiene");
        t.lista(E.habitos, { tam: 10.4 });
        t.parrafo(E.ejercicio, { cursiva: true, tam: 10.4 });
        if (i < ORDEN_ELEMENTOS.length - 1) t.divisor();
      });
    },
  };

  /* ── 4 · LAS CINCO COCINAS ────────────────────────────────────────────── */
  const cocinas: ApuntesCapitulo = {
    key: "cocinas",
    titulo: "Las cinco cocinas",
    resumen: "cómo se come y cómo se cocina para cada elemento, con sus ilustraciones",
    pordefecto: true,
    fotos: ORDEN_ELEMENTOS.flatMap((el) => cocinaDe(el).cocciones.map((_, i) => FOTO_COCINA(el, i))),
    pintar: (t, fotos, conFotos) => {
      t.capitulo(
        "Las cinco cocinas",
        "En Medicina China el alimento se elige por su sabor, su naturaleza y el órgano al que entra; y la cocción es la mitad del remedio.",
      );
      ORDEN_ELEMENTOS.forEach((el, i) => {
        const E = ELEMENTOS[el];
        const c = cocinaDe(el);
        t.antetitulo(`${E.nombre} · sabor ${c.sabor.toLowerCase()}`);
        t.parrafo(c.principio);
        t.antetitulo("Un gesto para hoy");
        t.lista(c.cadaDia, { tam: 10.4 });
        c.cocciones.forEach((coccion, j) => {
          t.vineta(conFotos ? fotos.get(FOTO_COCINA(el, j)) : undefined, [coccion.como, coccion.porque], {
            eyebrow: E.nombre,
            titulo: coccion.nombre,
          });
        });
        if (c.baja.length) {
          t.antetitulo("Lo que conviene bajar");
          t.lista(c.baja, { tam: 10.4 });
        }
        if (i < ORDEN_ELEMENTOS.length - 1) t.divisor();
      });
    },
  };

  /* ── 5 · LAS DIEZ LEYES DEL TAO ───────────────────────────────────────── */
  const taoismo: ApuntesCapitulo = {
    key: "taoismo",
    titulo: "Las diez leyes del Tao",
    resumen: "la mirada de la que nace toda la medicina, bajada al cuerpo",
    pordefecto: true,
    fotos: LEYES_TAO.map((l) => FOTO_LEY(l.key)),
    pintar: (t, fotos, conFotos) => {
      t.capitulo("Las diez leyes del Tao", TAOISMO_INTRO[0]);
      t.parrafo(TAOISMO_INTRO[1] ?? "", { cursiva: true, tam: 10.5 });
      LEYES_TAO.forEach((ley, i) => {
        // El carácter chino no sobrevive a la fuente embebida: en papel manda el
        // pinyin, que sí se lee.
        t.vineta(conFotos ? fotos.get(FOTO_LEY(ley.key)) : undefined, ley.parrafos, {
          eyebrow: rotulo(`${i + 1} · ${ley.pinyin}`),
          titulo: ley.nombre,
        });
      });
      t.parrafo(TAOISMO_CIERRE.texto, { capitular: true });
      t.cierre(`${TAOISMO_CIERRE.cita} ${TAOISMO_CIERRE.autor}`);
    },
  };

  /* ── 6 · LOS BROCADOS ─────────────────────────────────────────────────── */
  const brocados: ApuntesCapitulo = {
    key: "brocados",
    titulo: "Los Brocados",
    resumen: "la serie entera, postura a postura, con sus pasos y sus repeticiones",
    pordefecto: true,
    fotos: BROCADOS.map((p) => FOTO_POSTURA(p.key)),
    pintar: (t, fotos, conFotos) => {
      t.capitulo(
        "Los Brocados",
        "Ba Duan Jin. Se hacen seguidos y en orden, sin prisa: el estiramiento es largo, nunca brusco.",
      );
      BROCADOS.forEach((p, i) => {
        t.vineta(
          conFotos ? fotos.get(FOTO_POSTURA(p.key)) : undefined,
          [p.para, ...p.pasos.map((paso, j) => `${j + 1}. ${paso}`)],
          { eyebrow: rotulo(`${i + 1} · ${p.pinyin}`), titulo: p.nombre },
        );
        t.tarjeta({ titulo: p.repeticiones, cuerpo: p.clave, extra: p.organo });
      });
      t.parrafo(QIGONG_NOTA, { cursiva: true, tam: 10 });
    },
  };

  /* ── 7-10 · LOS CÓMICS QUE YA EXISTEN ─────────────────────────────────── */
  const deVinetas = (
    key: string,
    titulo: string,
    resumen: string,
    subtitulo: string,
    vinetas: Vineta[],
    pordefecto = false,
  ): ApuntesCapitulo => ({
    key,
    titulo,
    resumen,
    pordefecto,
    fotos: srcsDeVinetas(vinetas),
    pintar: (t, fotos, conFotos) => {
      t.capitulo(titulo, subtitulo);
      pintarVinetas(t, fotos, vinetas, conFotos);
    },
  });

  return {
    disciplina: "Medicina China",
    tema: TEMA_TCM,
    titulo: "Mis apuntes de Medicina China",
    subtitulo: "El Mapa · lo que me llevo",
    pieLamina: "Estos apuntes los has elegido tú, capítulo a capítulo.",
    archivo: "mis-apuntes-medicina-china",
    portadas: [
      { key: "acuarela", label: "La acuarela", src: "/img/fondos/tcm.webp" },
      { key: "origen", label: "El Origen", src: "/viñetas/tcm/origen/origentcm3.webp" },
      { key: "yinyang", label: "El Yin Yang", src: "/viñetas/tcm/yinyang/yinyang.webp" },
      { key: "elementos", label: "Los elementos", src: "/viñetas/tcm/elementos/portadaelementos.webp" },
    ],
    capitulos: [
      diagnostico,
      lengua,
      elementos,
      cocinas,
      taoismo,
      brocados,
      deVinetas(
        "animales", "Los Cinco Animales",
        "el tigre, el ciervo, el oso, el mono y la grulla, uno por órgano",
        "Hua Tuo miró a cinco animales y sacó de ellos una serie que trabaja los cinco órganos.",
        CINCO_ANIMALES_VINETAS, true,
      ),
      deVinetas(
        "daoyin", "El Dao Yin",
        "el nombre que esto tuvo durante dos mil años, y el rostro femenino del Dao",
        "Guiar el Qi y estirar el cuerpo: el nombre describe exactamente lo que haces mientras lo haces.",
        DAO_YIN_VINETAS,
      ),
      deVinetas(
        "historia", "De dónde viene el Qigong",
        "de la tela de Mawangdui a los ensayos clínicos de hoy",
        "Lo antiguo es la práctica; la palabra «qigong» es de anteayer.",
        HISTORIA_QIGONG_VINETAS,
      ),
      deVinetas(
        "enfermedades", "Las enfermedades",
        "Calor, Frío, Humedad, Flema, Estancamiento y Deficiencia",
        "La enfermedad no es un síntoma suelto: es un desequilibrio en cómo circula el Qi.",
        VINETAS_ENFERMEDADES,
      ),
    ],
  };
}
