# Editar los textos de las Historias de Cultura fuera del código

Los textos de las seis Historias (`frontend/src/components/metodo/culturaHistoria*.ts`) se
pueden sacar a `.md`, corregir a mano en el editor y volver a meter en el código sin
retranscribir nada. La ida y vuelta está comprobada: el `.md` generado, leído otra vez,
reproduce exactamente la misma estructura.

## Sacar los textos a la raíz del proyecto

```
node tools/cultura-textos/generar-md.js
```

Deja seis archivos `CULTURA-1-historia-universal.md` … `CULTURA-6-historia-arte.md`.
Cada momento lleva su `key`, su fecha, el cuerpo, hasta dos datos curiosos y sus páginas
«Profundiza». Se puede borrar lo que sea (frases, párrafos, un dato curioso, un momento
entero) y reescribir encima.

## Volver a meterlos en el código

```
node tools/cultura-textos/leer-md.js universal CULTURA-1-historia-universal.md --escribir
```

Sin `--escribir` solo compara y avisa de si hay diferencias. Las claves de Historia son
`universal`, `religiones`, `filosofia`, `ciencia`, `medicina` y `arte`.

Después, siempre: `cd frontend && npx tsc --noEmit -p tsconfig.json`.

## Ver de un vistazo cómo está una era

```
node tools/cultura-textos/mapa.js universal edad-media
```

Lista cada párrafo con su índice y sus primeras palabras, que es lo que hace falta para
decidir qué sobra. `LARGO=30` para ver más de cada párrafo.

## Cosas que conviene no olvidar

- El **cuerpo** es lo único obligatorio. La pregunta gancho va vacía (`""`) en casi todos
  los momentos, y el dato curioso solo se pone si de verdad hay algo curioso que contar.
- Caben **dos datos curiosos**; el segundo se escribe empezando por `Dato curioso II: `.
- **No hay que dejar saltos de línea tras cada punto**: el visor (`ComicViewer` con
  `separarFrases`) parte el texto por frases él solo.
- Si un párrafo empezaba respondiendo a la pregunta gancho («La respuesta es…»), al quitar
  la pregunta se queda huérfano: hay que reescribir su arranque.
- Las eras **ya no tienen texto de `intro`**: no se pintaba en ninguna parte de la web y se
  borró (los 60 textos están en el historial de git si alguna vez se quieren recuperar).
