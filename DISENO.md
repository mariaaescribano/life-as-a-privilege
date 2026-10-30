# DISENO.md · El diseño de Life as a Privilege

Este es el documento de estilo de la casa. Recoge lo que ya está decidido en el código y en las
correcciones de María, para que cualquier página, popup o componente nuevo salga con el mismo
estilo sin que haya que repetírselo a nadie.

**Cómo usarlo:** antes de tocar nada visual, leer §1 y §2. Después, copiar la página «hermana»
más cercana (§12) en vez de inventar. Al terminar, pasar el checklist de §13.

**Fuentes de verdad en el código** (si algo de aquí contradice al código, manda el código y se
corrige este documento):

| Qué | Dónde |
|---|---|
| Paleta y iconos de cada disciplina | `frontend/src/GlobalVariables.tsx` |
| Foto de fondo de cada disciplina | `components/global/DisciplinaBgLayer.tsx` |
| Sombras de texto por disciplina | `components/global/disciplinaSombras.ts` |
| Cabecera de página | `components/metodo/MetodoStepHeader.tsx` |
| Tarjeta con foto | `components/metodo/FotoBox.tsx` (+ `glowSuave*`, `glowHeader`) |
| Botón de fin de página | `components/metodo/BotonPaso.tsx` |
| Cajas de las presentaciones | `components/metodo/presentacionUi.tsx` |
| Marca de «leído» | `components/metodo/MarcaLeido.tsx` |
| Animaciones | `components/global/Reveal.tsx`, `LetrasVivas.tsx`, `PalabrasVivas.tsx` |
| Flecha de la casa | `components/global/FlechaBonita.tsx` |
| Foco de teclado | `components/global/foco.ts` |
| Reglas globales de navegador | `frontend/src/style.css`, `frontend/index.html`, tema en `main.tsx` |
| Glow de Cábala / Psicología | `components/metodo/cabalaGlow.ts`, `psicologiaGlow.ts` |

---

## 1. La idea en cuatro líneas

1. **Serio y sereno, no recargado.** Plataforma profesional sobre temas delicados. Nada de
   adornos, estrellitas, emojis ni efectos que abaraten. «La calidad es lo que manda».
2. **Luz, no sombra.** Las cajas y los botones se definen con un **halo luminoso** (`boxShadow`
   difuso), casi nunca con una sombra oscura ni con un borde duro.
3. **Cada disciplina es un material.** Su acuarela (o su cielo) de fondo, su color de letra y su
   color de superficie. Se ve en las cajas, nunca en el fondo de la página.
4. **Todo entra con calma y respira.** Las cosas se colocan en escena (fundido + deslizamiento
   suave), no aparecen de golpe; y lo importante tiene un poco de vida después (flota, respira).

---

## 2. Lienzo y estructura de página

- **Fondo de página: SIEMPRE turquesa sólido `#008080`.** Nunca la imagen de una disciplina como
  fondo de página (ni oscurecida, ni con velo). `html, body` también van en `#008080`
  (`style.css`), para que el rebote del scroll en móvil no enseñe blanco. Única excepción
  histórica: la landing de la casa (ver memoria `landing-dos-proyectos`).
  **Bandas de mármol:** una página puede intercalar bandas a todo el ancho con el mármol
  de María (`/img/fondos/marmolfondo.webp`, 1536×1024, a resolución completa). Sobre el
  mármol la letra no es blanca: turquesa oscuro `#004f4f` (el de la casa, más hondo), oro `#b08d3f` en los filos y crema `#f2e9d9` (los de
  `LlamadaCta`). Todas las bandas usan `components/global/BandaMarmol.tsx`: bordes arriba y abajo
  desvanecidos (máscara de 70 px) y, REGLA DE ORO, **el mármol sale PRIMERO**: es el movimiento que
  sigue a la cabecera (mandala, titular, frase y línea con mandala), sin hacer scroll; si la banda aún no se
  ve, aparece (0,5 s) en cuanto asoma, y su contenido entra 0,45 s después
  (los hijos reciben `visible`). Cajas sobre mármol: transparentes, filo turquesa oscuro, halo dorado.
  Usos: portada, `/asesoria`, `/disciplinas`.
- **Mapa de disciplinas desplegable** (`/asesoria`, `components/web/MapaDisciplinas.tsx`): ocho
  disciplinas en vertical con flechas blancas que se dibujan; una abierta a la vez; cajitas con
  flechas y texto en pastilla. Sin hover. Datos y pendientes en `mapaDisciplinasData.tsx`.
- **Sin modo oscuro.** `color-scheme: only light` en `index.html` y `style.css`, y
  `darkreader-lock`. La paleta son hex fijos; si algún día hay modo oscuro será una capa propia.
- **Esqueleto de una página de recorrido** (copiar de `MetodoNutricionMitos.tsx`):

```tsx
<Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
  <SiteHeader variant="private" />
  <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
    <Flex direction="column" align="center" w="100%" maxW="820px" /* 820–1000 */ gap={{ base: 6, md: 9 }}>
      <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
        <MetodoStepHeader … nom={disciplinaNom} mb={0} />
      </Reveal>
      {/* frase de intro: blanca, cursiva, SIN sombra */}
      {/* contenido en cajas */}
    </Flex>
  </Flex>
  <Indice<Disciplina> />          {/* esquina inferior izquierda */}
  <BotonCompania … />             {/* esquina inferior derecha */}
  <SiteFooter />
</Box>
```

- **Footer anclado abajo:** `minH 100vh` + columna flex + contenido `flex=1`.
- **Esquinas fijas ocupadas:** abajo-izq «Índice / Mis notas», abajo-dcha «Agenda una llamada».
  No añadir un tercer botón fijo encima. El botón de fin de página va dentro del contenido.
- **Mientras carga:** el `*Loading` de la propia disciplina (`comicLoaders.tsx`, `RecorridoLoading`).
  Spinner blanco sobre turquesa, sin velo oscuro. Fuera del mapa: `LifeLoading`.
- Márgenes laterales móviles de 16–20 px (`px: 4–5`), nunca scroll horizontal.

---

## 3. Tipografía

- **EB Garamond** en toda la app (pesos 400, 500, 600, 700 y cursiva 400, servida con
  `@fontsource`, no desde Google). El tema de Chakra trae Times New Roman de base, así que
  **cada página raíz pone `fontFamily="'EB Garamond', serif"`**. Si un texto sale en Times,
  falta eso.
- **Títulos:** `fontWeight 700`, `letterSpacing 0.03–0.05em`, `lineHeight 1.15–1.3`.
- **Cuerpo de lectura:** `lineHeight 1.7–1.85`. En cajas `md/lg`; en el visor de cómics
  `2xl/3xl` (base/md); Cábala `lg/xl`.
- **Frase de intro bajo el header:** cursiva, `rgba(255,255,255,0.92)`, `md/lg`, centrada,
  `maxW 640px`, `lineHeight 1.7`.
- **Botones:** cursiva, `letterSpacing 0.05em`. Los botones grandes de presentación van en
  MAYÚSCULAS con `letterSpacing 0.14em`.
- **Eyebrows / rótulos pequeños:** `2xs–sm`, `uppercase`, `letterSpacing 0.16–0.3em`,
  peso 600–700.
- **Título de cabecera:** `3xl / 5xl` (base / md), una sola línea que se encoge sola hasta
  caber (nunca dos líneas ni «…»; solo `multiline` para frases de programas).
- Unidades de cifras con `toLocaleString("es-ES")`; los números que cuentan usan `Contador`.

---

## 4. Paleta por disciplina

Regla de oro: **`<disc>Txt` es la tinta (solo la letra, el icono y el acento fino) y `<disc>Bg`
es la superficie** (fondos de caja, contadores, scrollbar, botones, sombras de texto). Nunca
usar el `Txt` como relleno de superficie.

| Disciplina (`nom`) | `Bg` | `Txt` | Fondo | Sombra del texto sobre él |
|---|---|---|---|---|
| Psicología | `#daa889` | `#5e2d10` | `psciologia.webp` + velo `#ffffff33` | crema: `0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px <bg>` |
| Fisiología | `#331c35` | `#c8b5d1` | `fisio.webp` | negra (`SHADOW_BLACK`) |
| Nutrición | `#e4f8e1` | `#2b362a` | `nutri.webp` | luz natural del bg |
| Cultura | `#0c3c3c` | `#79dcd4` | `cultura.webp` | negra |
| Medicina China | `#6b0404` | `#ffa2a2` | `tcm.webp` | granate (`SHADOW_GRANATE`) |
| Astrología | `#1e296b` | `#feffe4` | cielo estrellado `StarsLayer` | luz natural del bg |
| Cábala | `#3b2612` | `#bd814d` | `cabala.webp` + velo negro 0.4 | negra (lleva el ámbar sobre marrón oscuro) |
| Hinduismo (Ayurveda) | `#ffffff` | `#853e0b` | `hinduismo.webp` + velo `#ffffff55` | luz natural del bg |
| Fitoterapia | `#0e590d` | `#d5ffd5` | — | — |

Doshas: Vata `#7c5cbf`, Pitta `#c0522a`, Kapha `#3a8a5c`. Para lo que pertenece a un elemento o
dosha, el color sale del propio elemento, no del de la disciplina.

- Para la sombra de texto sobre un fondo de disciplina: **`sombraTexto(nom, bg)`** (o
  `sombraSoloContraste(nom)` si no se quiere luz). No escribir sombras a mano.
- Colores de estado fijos: visto `#0c8710`, no visto `#cd0404`.
- Tipos de color del tema Chakra: casillas, radios, switches y sliders en `teal` (nada azul).
- Blanco translúcido sobre turquesa: `rgba(255,255,255,0.92)` texto; `0.5–0.65` secundario/pie;
  `0.15` líneas.

---

## 5. Los materiales: cajas, halos y fotos

### 5.1 Caja de disciplina
`borderRadius="2xl"` (cajas del recorrido) o `"3xl"` (presentaciones), `overflow hidden`,
`position relative`. La foto va como **capa absoluta** `<DisciplinaBgLayer nom=… borderRadius=…>`
y el contenido encima con `position relative; zIndex 1`. El radio de la capa **tiene que ser el
mismo** que el de la caja.

- **Sin filo:** las cajas se definen por su halo, no por un `border` ni por el aro `0 0 0 1px`.
  (Psicología conserva su borde fino azul `azulBorde` + `glowPanel`; Nutrición, Fisiología y
  Cultura van **sin ninguna línea**.)
- Para cajas pequeñas dentro de una caja (claves, notas): `bg` oscuro/blanco al 0.5–0.55 de
  alfa. Son tinta de legibilidad, no fondo.

### 5.2 Recetas de halo (copiar, no inventar)
- **Halo de cabecera / caja** (`glowHeader`, `glowHeaderDisciplina`, `glowComoHeader`, `CAJA_GLOW`):
  `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${txt}1a, 0 0 48px ${txt}10`
- **Tarjeta pequeña** (`glowSuave`): `0 0 14px ${txt}26, 0 0 32px ${txt}14`; hover
  `glowSuaveHover` `0 0 20px ${txt}3a, 0 0 42px ${txt}1e`; visto `glowSuaveVisto`.
  Solo con el acento de la disciplina: **sin capas blancas ni menta** (sobre el turquesa se
  funden y pintan un «box clarito»).
- **Cábala:** todas las cajas llevan exactamente el halo del header (`cabalaGlow.ts`:
  `CAJA_GLOW`, `CAJA_GLOW_FUERTE`, `CAJA_GLOW_HOVER`). Ninguna sombra oscura.
- **Nutrición:** su `Txt` es casi negro; su halo con el acento saldría como una sombra oscura,
  así que sus tarjetas usan `glowHeader` (blanco + menta).
- **Psicología:** `glowPanel`, `glowPanelSoft`, `glowHeader`, `glowBtn`, `glowBtnHover`
  (blanco + azul `#2f6fe0`).
- **Presentaciones:** caja destacada `0 0 45px ${txt}66, 0 0 90px ${txt}33`; vídeo igual.
- Nunca `0 4px 20px rgba(0,0,0,…)` en cajas del recorrido (solo el header sin fondo de disciplina
  conserva ese respaldo).

### 5.3 Fotos (la regla más estricta)
- **NUNCA `filter: blur` en una foto de fondo** (ni en Astrología ni en el ComicViewer ni en
  ningún visor). La calidad manda; lo que se atenúa es solo con un velo encima.
  **Excepción pedida por María:** las cuatro cajas de `/asesoria` llevan la foto NÍTIDA y, detrás
  de cada frase, un cristal esmerilado (`backdrop-filter: blur(12px)` + blanco al 12 %): es el
  texto el que desenfoca lo que tiene detrás, no la foto entera (`CajaFoto` en `Asesoria.tsx`).
- **Resolución completa** en `public/img/fondos/*` y `recorrido/tcm/fondos`: `adelgazar.mjs` no
  debe volver a encogerlas (en móvil con `cover` se ven borrosas).
- **Velos:** el cielo de Astrología va a `opacity 1` con velo `rgba(8,13,30,0.25)` por defecto
  (≈0.28 cajas, ≈0.38 lectura densa/popups, 0.45 formularios). **El velo oscuro del cómic
  (`veloOscuro`) es solo de Medicina China** (`ElementoComicModal`, `QigongComicModal`); en el
  resto, si el texto no se lee, se arregla con `textShadow`, no oscureciendo la foto.
- Las fotos entran con fundido (`opacity 0 → 1`, 0.7 s) y las ilustraciones «mágicas» surgen de
  una bruma (`fotoBrota`). Siempre `loading="lazy"` salvo lo de primera pantalla; precargar lo
  que se ve al entrar (`precargarImagenes`).
- Una foto que falla se reintenta una vez; nunca deja un hueco (hay color sólido debajo).

---

## 6. Reglas del texto según dónde cae

| Dónde cae el texto | Color | Sombra |
|---|---|---|
| **Fuera de las cajas**, sobre el turquesa (intro bajo el header, citas, frases sueltas) | **blanco** (`white` / `rgba(255,255,255,0.92)`), un punto más grande | **ninguna**, jamás (se ve como mancha sucia) |
| **Dentro de una caja** con foto de disciplina | `<disc>Txt` | `sombraTexto(nom, bg)` de la disciplina |
| Sobre velo oscuro propio (tarjetas de ilustración) | color de acento | ninguna |
| Títulos grandes de la web pública y del acceso | blanco | glow unificado (abajo) |

**Glow unificado de títulos** (Welcome, LogIn, SignIn, Quién soy, Contacto, Ilustraciones…):
`textShadow="0 0 <blur>px rgba(255,255,255,0.6), 0 0 <blur>px rgba(255,255,255,0.39), 0 0 <blur>px rgba(180,255,245,0.32)"`
(dos capas: 0.6 y 0.32). Cada título conserva sus radios, solo se unifican las alfas. No tocar el
hero animado de `ElMetodo.tsx`.

**Títulos de cabecera de recorrido:** sobre fondo de disciplina,
`0 1px 3px ${bg}f5, 0 0 8px ${bg}cc, 0 2px 16px ${bg}88`; sin fondo, glow blanco + `${color}55`.

**Vocabulario y tono:**
- Nada de ✦, estrellitas, emojis ni adornos en titulares o listas. Lista = rayita fina en la
  tinta de la disciplina.
- La app nunca dice «diagnóstico» de lo suyo: es **«valoración»** (EN: *assessment*).
- Los textos visibles son de María: no se cambian ni se «mejoran». Un texto nuevo se propone en
  el chat antes de meterlo. Todo texto va por `i18n` (`es` es la fuente de verdad; `en` con
  respaldo). Los nombres internos de disciplina (`*Nom`) no se traducen.
- Signos del zodíaco: siempre los iconos SVG de `signosIconos.ts`, nunca el carácter ♈.

---

## 7. Botones y controles

Todos los botones son **píldoras** (`borderRadius="full"`), con **tinta y borde de la
disciplina** y un halo propio. Nunca un `div` con `onClick`: `Box as="button"` (que reciba el
foco de teclado).

- **Botón de cabecera** (`StepBtn` en `MetodoStepHeader`): borde `1.5px solid ${c}aa`, fondo
  `${c}1a`, cursiva, `boxShadow: 0 0 10px rgba(255,255,255,0.16), 0 0 22px ${c}44, inset 0 0 12px ${c}22`;
  hover `bg ${c}2b` y halo más fuerte; active `scale(0.96)`; transición 80 ms. TCM lleva fondo
  blanco mínimo (`whiteBg`) y texto con sombra granate. En **móvil**, prev/next son **solo la
  flecha** (redonda); en escritorio llevan el nombre. Los botones del centro (Cómic,
  Ilustraciones, Cursos) conservan siempre su nombre. Una sola fila, nunca se parte en dos.
- **Botón de fin de página** (`BotonPaso`): **adelante = abajo a la derecha**, **volver = abajo a
  la izquierda**, dentro del contenido (no flotante). Fondo = foto de la disciplina, borde `${c}aa`.
- **Botones de presentación** (`BotonDisciplina`, `BotonEmpezar`, `BotonSecundario`): principal
  con relleno `${txt}1f`, borde 2 px, mayúsculas; secundario sin relleno, borde 1.5 px `${txt}88`.
- **Flecha de la casa:** `FlechaBonita` (trazo fino, punta abierta, `currentColor`). Nunca el
  chevron «‹ ›» ni «←/→» de texto como icono. El chevron de Material solo en `BotonPaso` y
  botones de presentación.
- **Marca de leído:** siempre `MarcaLeido` (círculo `Bg` + tick `Txt`, arriba a la derecha) y
  `AvisoLeida` dentro de popups. No inventar otra marca.
- **Inputs:** `focusBorderColor="currentColor"`; los de Psicología son crema translúcido
  (`rgba(255,251,243,0.38)`) con tinta marrón y cursor de la tinta.
- **Feedback al pulsar:** `_active` con escala 0.96–0.985; hover con `translateY(-2px)` y más
  halo. Sin rectángulo azul del navegador (ver §10).

---

## 8. Tarjetas con foto

Una sola pieza para casi todo: **`FotoBox`** (con `TarjetaNutri` como ejemplo de uso).

- Foto cuadrada **a sangre arriba**, línea separadora (menos en Nutrición/Cultura/Fisiología) y
  **título abajo a la izquierda**, **una sola línea** (`noOfLines={1}`) para que todas las de la
  fila midan igual (envoltorio flex + tarjeta `flex: 1`).
- **Sin botón «Ver»/«Leer»**: la tarjeta entera es el botón. Lo que invita a pulsar es el **zoom
  lento de la foto** al pasar el puntero (`scale(1.07)`, `0.55s cubic-bezier(0.22,1,0.36,1)`,
  con `role="group"` + `_groupHover`). Opción `vivo` para el resto del efecto (brillo que barre,
  título que se desplaza 3 px, tarjeta que sube 6 px).
- **Sin números** 1, 2, 3 (el orden ya se ve), salvo secuencias reales (`numero`).
- Un box con ilustración sigue la **estructura del cómic**: foto a la izquierda, texto a la
  derecha **grande y visible**, scroll vertical por dentro, **sin rayita** entre ambos.
  Reutilizar `ComicViewer` / `FichaFisioModal` / `NutrienteComic`, no duplicar markup.
- Contenido de otra disciplina aún no desbloqueado: box con candado + qué se hace + botón para ir.

---

## 9. Cómics, popups y visores

- **ComicViewer** es el visor único: misma vista, maquetación y animaciones. Modal a pantalla
  completa, `ModalOverlay bg="rgba(0,0,0,0.95)"` con `backdropFilter: blur(24px)` (el blur es
  del overlay del modal, no de las fotos), `ModalContent` transparente, `motionPreset="none"`.
- Colores del visor: `themeColor={<disc>Bg}` + `textColor={<disc>Txt}`; la X, «continuar» y
  «Saltar »» con la imagen de la disciplina de fondo, velo y letra `Txt`.
- Cómics de Psicología: sin título (`titulo: ""`), voz «nosotros» para lo general y «tú» para su
  historia, sin marca de género.
- **Popups normales:** centrados, **altura = contenido** con tope cuadrado y scroll vertical
  **dentro**; nunca una sábana a pantalla completa con el texto flotando en medio. Cabecera y
  pie `flexShrink 0`, cuerpo `flex 1 1 auto; minH 0; overflowY auto`; `overscrollBehavior: contain`.
- **Barra de scroll:** nunca la blanca del navegador. Carril transparente, pulgar de la tinta al
  ~33 % (`scrollAcuarela(tinta)`), pegada al borde derecho; en el cómic, `BarraScrollTexto`
  dibujada a mano (la del navegador no se ve en móvil). En escritorio, los visores sin barra
  (`useSinBarraDeScroll`).
- **Vídeo de María en popup inmersivo** (`VideoMateriaModal` + `useVideoMateria`, Fisiología «La
  materia»): pantalla completa, foto de la disciplina a resolución completa sin velo ni blur, reel
  de YouTube vertical 9:16 en medio con `glowHeader`, X de la casa. Los enlaces viven en
  `hardCoded/espacio/VideosMateria.ts`; sin enlace, el popup no sale.
- El cómic de entrada de cada disciplina sale **siempre** al entrar (no persiste) y es saltable
  con la X.

---

## 10. Interacción y reglas de navegador (ya están en `style.css`; no romperlas)

- **El foco con ratón/dedo nunca se ve** (`outline: none`; aro de Chakra apagado en el tema).
  **El foco de teclado sí:** `_focusVisible={focoBlanco}` (outline blanco 2 px) en todo lo
  pulsable; en las pantallas de acceso, `focoAzul`. Se usa `outline`, no `box-shadow`, para que
  no se mezcle con los halos animados.
- **Nada azul al pulsar:** `-webkit-tap-highlight-color: transparent`, sin selección en botones y
  en toda la pantalla táctil (excepto inputs/textarea). `::selection` = velo blanco 0.3; dentro
  de campos, azul suave `rgba(150,200,255,0.45)`.
- Las páginas de juegos de arrastrar llevan `noSelectSx`.
- `touch-action: manipulation` en botones (sin retardo de 300 ms).

---

## 11. Movimiento

El sistema entero vive en `Reveal.tsx`. Se **reutiliza**, no se reescribe.

- **Entrada:** `Reveal` (fundido + deslizamiento; `direction`, `distance` 16–34, `duration`
  0.6–0.8, `scaleFrom` 0.96–0.98, `blur` opcional). Curva única
  `[0.22, 1, 0.36, 1]`.
- **Orden de atención:** la **cabecera entra primero** (`direction="down"`) y el **cuerpo espera
  0,5 s** desde ahí. Lo que asoma más tarde no espera nada. Con cómic de entrada delante,
  todo espera a que se cierre (`cuandoSinComic`).
- **Cascadas:** `RevealStagger` + `RevealItem` para piezas **dentro** de una caja (stagger
  ≈0.14, `delayChildren` 0.35).
- **Rejillas y listas largas:** un **`Reveal inView once` por tarjeta** (`amount ≈0.25`,
  `distance 30`, `scaleFrom 0.96`, `duration 0.8`, `delay = 0.1 + (i % columnas) * 0.14`).
  **Nunca** `RevealStagger inView` sobre el contenedor entero: el 10 % no cabe en pantalla y todo
  se queda a opacidad 0.
- **Vida después de la entrada:** `Float` (el icono del header flota, 5 px / 5 s; lo pone el
  propio header, nunca la página), `Breathe` (escala 0.012, 6 s), `Pop` (levanta 3 px, se hunde
  al pulsar, con muelle), `Contador` (cifras que cuentan hasta su valor).
- **Texto vivo:** `LetrasVivas` (título mágico del header: letras que suben, se enfocan y se
  encienden; solo en `/metodo/…`, cursos y `/d/…`), `PalabrasVivas` (párrafo que se revela
  palabra a palabra, tope ≈1 s).
- **Solo animar cuando se ve:** lo que está bajo el pliegue no se anima con `mounted`; usar
  `inView` / `useEnPantalla`.
- **Respetar `prefers-reduced-motion`** siempre (los componentes ya lo hacen; en SVG propio,
  comprobar `useReducedMotion`).
- **Móvil:** el parpadeo viene de animaciones de `filter`/`textShadow` apiladas: se apagan en
  móvil, no se quita el dinamismo del escritorio.
- Pedir «más dinamismo» ⇒ **auditar primero** (contar `Reveal`, `Float/Breathe/Pop/Contador`) y
  actuar solo donde hay hueco. El contenido está bien; solo cambia cómo se muestra.

---

## 12. Mapa de «qué copiar» para una página nueva

| Voy a hacer… | Copiar de |
|---|---|
| Página de recorrido con rejilla de tarjetas | `app/metodo/MetodoNutricionMitos.tsx` |
| Página con un box de escribir | `app/metodo/MetodoPsicologiaProblema.tsx` |
| Frase bajo el header | `components/metodo/IntroRecorrido.tsx` |
| Caja con foto + halo (presentaciones) | `CajaLisa` / `CajaDisciplina` en `presentacionUi.tsx` |
| Título de sección sobre turquesa | `SeparadorSeccion` (rayitas a los lados, blanco, mayúsculas) |
| Tarjeta de curso / de ilustración | `CursoMiniCard` / `ComicMiniCard` |
| Visor de ilustración / lectura | `ComicViewer`, `NutrienteFichaModal`, `FichaFisioModal` |
| Botón al final de página | `BotonPaso` |
| Pop-up de pago de una disciplina | `Pago<Disciplina>Modal.tsx` más cercano |

Cuando haya duda, **la página hermana de la misma disciplina manda**.

---

## 13. Checklist antes de dar algo por terminado

- [ ] Fondo de página `#008080`; fuente EB Garamond puesta en la raíz.
- [ ] `Txt` solo en letra/icono; `Bg`/`Txt` correctos de la disciplina (no el rojo de TCM para
      algo de otro elemento).
- [ ] Texto fuera de cajas: blanco, sin sombra. Texto dentro: `sombraTexto`.
- [ ] Cajas con halo de §5.2, sin sombra oscura, sin filo; radio de la foto = radio de la caja.
- [ ] Ninguna foto con blur, ningún velo oscuro nuevo, fondos a resolución completa.
- [ ] Botones: píldora, `as="button"`, halo, `_hover`, `_active`, `_focusVisible={focoBlanco}`.
- [ ] Tarjetas con foto: zoom al hover, sin «Ver», título en una línea, mismo alto por fila.
- [ ] Entrada con `Reveal` (cabecera primero, cuerpo +0,5 s); listas largas por tarjeta; respeta
      `prefers-reduced-motion`; nada bajo el pliegue animado con `mounted`.
- [ ] Móvil probado: una sola fila de botones, solo flechas en prev/next, nada de scroll
      horizontal, popup sin huecos.
- [ ] Sin ✦ / emojis / adornos; palabra «valoración», no «diagnóstico».
- [ ] Textos: solo los existentes o los propuestos y aprobados; todo por `i18n` (es + en).
- [ ] Datos antiguos blindados (`Array.isArray`, strings) al cargar, para que el render no reviente.

---

## 14. Trampas técnicas que ya han costado tiempo

- `bgGradient` de Chakra **no acepta `rgba()`** (por las comas): usar hex con alfa `#rrggbbaa`.
- Los colores con alfa se construyen como `${hex6}1a`: el color base tiene que ser `#rrggbb`
  de 6 dígitos.
- Nada de `{/* … */}` entre `return (` y el elemento raíz: usar `//` encima del `return`.
- `style.css` hay que **importarlo** (`main.tsx` ya lo hace); no hay que volver a meter estilos
  de plantilla de Vite (fondo `#242424`, botones negros…).
- `manualChunks`: la librería base de React no puede quedar fuera de los grupos.
- Spinners: borrado el antiguo; cada disciplina usa su `*Loading`.
- Dev server propio siempre con `--port 5199`.
- Los PDFs salen de `utils/pdf/`; la EB Garamond del PDF no trae ✓, → ni hebreo.
