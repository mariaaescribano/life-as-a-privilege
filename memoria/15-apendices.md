# Apéndice I — Recursos en línea

Todo apéndice debe estar citado en el cuerpo de la memoria. Estos recursos se referencian desde los capítulos 9 y 11.

## A.I.1. Repositorio del proyecto

El código completo del proyecto —cliente, servidor, esquemas de base de datos y herramientas de apoyo— está publicado en:

**https://github.com/mariaaescribano/life-as-a-privilege**

<!-- COMPROBAR antes de entregar:
     · Que el repositorio es PÚBLICO y accesible sin cuenta.
     · Que la rama principal contiene la versión final entregada.
     · Que existe un README.md en la raíz explicando cómo instalar y arrancar
       el proyecto: requisitos, variables de entorno necesarias y comandos.
       Hoy el repositorio NO tiene README propio en la raíz, y es lo primero
       que abre un tribunal. -->

[FIGURA 14: repositorio del proyecto]

*Figura 14. Repositorio del proyecto en GitHub.*
*(Fuente propia)*

## A.I.2. Plataforma desplegada

La plataforma está publicada y accesible en:

**[DIRECCIÓN DE LA PLATAFORMA EN PRODUCCIÓN]**

Para que el tribunal pueda recorrer una disciplina completa sin necesidad de realizar un pago, se facilitan credenciales de acceso con disciplinas concedidas mediante el panel de administración:

- Usuario: `[CORREO DE PRUEBA]`
- Contraseña: `[CONTRASEÑA DE PRUEBA]`

<!-- IMPORTANTE: crear esta cuenta y concederle acceso a las ocho disciplinas
     desde /admin/accesos antes de entregar. Rellenarla además con datos de
     ejemplo en al menos dos recorridos, para que el tribunal vea el producto
     con contenido y no vacío. -->

## A.I.3. Vídeo de demostración

<!-- MUY RECOMENDABLE: grabar un recorrido completo de una disciplina
     (Astrología es la más demostrativa: entrada de datos de nacimiento →
     cálculo de la carta → lectura → PDF descargado) y publicarlo como vídeo
     no listado. Es lo que se proyecta en la defensa. -->

**[ENLACE AL VÍDEO DE DEMOSTRACIÓN]**

## A.I.4. Cuestionario de validación

**[ENLACE AL FORMULARIO DE VALIDACIÓN CON USUARIOS]**

---

# Apéndice II — Guía de despliegue y arranque del proyecto

Este apéndice recoge los pasos necesarios para poner el sistema en marcha desde cero, tanto en un entorno local como en producción.

## A.II.1. Requisitos previos

- Node.js (versión 20 o superior) y npm.
- Una cuenta en el proveedor de base de datos gestionada, con un proyecto creado.
- Una cuenta en la pasarela de pago, con las claves en modo de pruebas.
- Una cuenta de correo saliente para las notificaciones.

## A.II.2. Base de datos

El esquema completo está versionado en el repositorio, en la carpeta `backend/sql`, como ficheros SQL ejecutables y comentados. Deben ejecutarse una vez en el editor SQL del proveedor. Cada fichero documenta, además del `CREATE TABLE`, la forma esperada del documento JSONB que la tabla almacena.

<!-- NOTA TÉCNICA que conviene incluir en la memoria porque costó tiempo
     descubrirla: las migraciones deben ejecutarse a través del conector
     agrupado (pooler) del proveedor, porque la conexión directa solo está
     disponible sobre IPv6. Si una tabla `metodo_*` no se ha creado, el
     recorrido correspondiente no guarda y devuelve al usuario al paso
     anterior, sin ningún mensaje de error evidente. -->

## A.II.3. Variables de entorno

El servidor requiere, como mínimo, las variables correspondientes a: conexión a la base de datos y clave de servicio, secreto de firma de la credencial de sesión, credenciales del proveedor de identidad externo, claves de la pasarela de pago y del secreto de verificación de sus avisos, credenciales del correo saliente, dirección del cliente para las direcciones de retorno del pago, lista de orígenes permitidos y lista de correos con acceso concedido.

<!-- COMPLETAR con la lista literal de nombres de variables, tomándola del
     código. Conviene incluir también un fichero `.env.example` en el
     repositorio, sin valores reales. NUNCA incluir claves en la memoria. -->

## A.II.4. Arranque local

```
# Servidor
cd backend
npm install
npm run start:dev

# Cliente
cd frontend
npm install
npm run dev
```

## A.II.5. Publicación

El cliente se publica como sitio estático y el servidor como servicio web, ambos conectados al repositorio de forma que cada envío a la rama principal desencadena una publicación automática.

**Punto crítico documentado:** al estrenar dominio hay que actualizar cuatro sitios, y olvidar uno deja la plataforma cargando pero con todas sus peticiones rechazadas: la lista de orígenes permitidos del servidor, la dirección del cliente usada en los retornos de pago, las etiquetas de la página principal del cliente, y el mapa del sitio junto con el fichero de exclusión de rastreadores. A ello se añade la redirección configurada en el panel de la pasarela de pago.

---

# Apéndice III — Herramientas de apoyo

El repositorio incluye, en la carpeta `scripts`, las herramientas de línea de comandos desarrolladas durante el proyecto y descritas en el apartado 9.9. Este apéndice documenta su uso.

<!-- COMPLETAR con la sintaxis de invocación de cada herramienta. Basta con
     una tabla de dos columnas: comando y qué hace. -->

---

# Apéndice IV — Diccionario de datos

<!-- OPCIONAL pero muy valorado. Recoge, para cada tabla y para cada documento
     JSONB, el nombre de cada campo, su tipo y su significado. Buena parte de
     esta información ya está escrita como comentarios en los ficheros SQL del
     repositorio, así que es en gran medida un trabajo de copiar y ordenar. -->
