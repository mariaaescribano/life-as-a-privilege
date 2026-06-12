import type { ModalidadInfo } from "./cursos.type";

export type { Curso, ModalidadInfo } from "./cursos.type";

/* ─────────────────────────────────────────────────────────────────────────
 *  Catálogo de cursos. De momento NO hay cursos publicados.
 *
 *  Para añadir uno, rellena `cursosData` con clave = slug de la disciplina
 *  (el mismo que usan las tarjetas de /aprendizaje/aprendizajeHome).
 *  Una lección puede ser de vídeo o de texto (tipo: 'texto' + contenido en
 *  Markdown, que se lee en /aprendizaje/leccion/:modalidad/:curso/:leccion).
 *
 *  Plantilla de referencia (necesita importar React + los iconos/colores de
 *  la disciplina desde GlobalVariables, y renombrar el archivo si usa JSX):
 *
 *  export const cursosData: Record<string, ModalidadInfo> = {
 *    [astrologiaNom]: {
 *      nom: astrologiaNom, bgColor: astrologiaBg, color: astrologiaTxt,
 *      icon: <AstrologiaIcon size={{ base: "40px", md: "50px" }} />,
 *      cursos: [
 *        {
 *          id: "mi-curso", titulo: "...", foto: "/img/...", descripcion: "...",
 *          precio: null,            // null = gratis ("Acceder"); número = de pago ("Saber más" → Stripe)
 *          numLecciones: 2,
 *          icon: <AstrologiaIcon size={{ base: "40px", md: "48px" }} />,
 *          cursoLink: "/aprendizaje/modulosPage/Astrología/mi-curso",
 *          modulos: [{
 *            title: "Introducción", icon: AstrologiaIcon,
 *            submodules: [{
 *              id: "leccion-1", cursoId: "mi-curso", nom: "Lección 1",
 *              link: "/aprendizaje/leccion/Astrología/mi-curso/leccion-1",
 *              tipo: "texto", contenido: "# Título\n\nTexto en **Markdown**...",
 *              descripcion: "", video: "", letra: null,
 *              detalles: { color: astrologiaTxt, bgColor: astrologiaBg, icon: AstrologiaIcon },
 *              linkAnterior: "", linkNext: "", icon: null,
 *            }],
 *          }],
 *        },
 *      ],
 *    },
 *  };
 * ───────────────────────────────────────────────────────────────────────── */

export const cursosData: Record<string, ModalidadInfo> = {};
