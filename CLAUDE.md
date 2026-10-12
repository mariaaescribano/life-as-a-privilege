# Life as a Privilege · instrucciones para Claude

## Diseño: leer ANTES de tocar nada visual

El estilo de la casa está documentado en **[DISENO.md](DISENO.md)**. Cualquier página, popup,
tarjeta, botón o animación nueva (o retocada) tiene que seguirlo. No inventes estilos: copia la
página «hermana» más cercana (tabla de §12) y reutiliza los componentes que ya existen.

Lo esencial, por si no abres el documento:

- Fondo de página **siempre `#008080`**; la foto de la disciplina solo dentro de las cajas
  (`DisciplinaBgLayer`). Sin modo oscuro. Fuente **EB Garamond** puesta en la raíz de cada página.
- **Luz, no sombra:** las cajas se definen con halo (`glowHeader` y compañía), sin sombras negras
  ni filos. Texto fuera de cajas: **blanco y sin sombra**; dentro: `<disc>Txt` + `sombraTexto()`.
- `Txt` = solo letra/icono; `Bg` = superficie. Colores en `GlobalVariables.tsx`, nunca a mano.
- **Fotos: nunca blur, nunca velo oscuro nuevo** (el `veloOscuro` es solo de Medicina China),
  fondos a resolución completa.
- Botones: píldora, `Box as="button"`, halo, `_focusVisible={focoBlanco}`; adelante abajo-dcha,
  volver abajo-izq (`BotonPaso`); en móvil prev/next solo flecha (`FlechaBonita`).
- Tarjetas con foto = `FotoBox`: zoom al hover, **sin botón «Ver»**, título en una línea.
- Animación con `Reveal` (cabecera primero, cuerpo +0,5 s); listas largas un `Reveal inView` por
  tarjeta; respetar `prefers-reduced-motion`.
- Sin ✦/emojis/adornos. Di «valoración», no «diagnóstico».
- **Los textos visibles son de María:** no los cambies ni los «mejores»; si hace falta uno nuevo,
  propónselo en el chat. Todo por `i18n` (es + en).

Al acabar una tarea visual, repasa el checklist de §13 de DISENO.md.

## Otros documentos de la casa

- `PAGINAS.md`: flujos y textos literales de cada página (sin nada técnico).
- `PAGINAS-tecnico.md`: lo técnico de esas páginas.
- Si cambias una decisión de diseño, **actualiza DISENO.md** en el mismo cambio.
