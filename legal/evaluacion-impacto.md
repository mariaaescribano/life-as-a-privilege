# Evaluación de impacto en protección de datos (art. 35 RGPD): borrador

Documento interno. Borrador hecho a partir del código; María debe leerlo, corregirlo y firmarlo.
Hay que hacerla cuando se tratan datos de salud de forma sistemática, que es el caso del recorrido.
Si algo cambia (un proveedor nuevo, una finalidad nueva), se revisa.

**Responsable:** María Escribano · **Fecha del borrador:** 19 de octubre de 2026

## 1. Qué se trata y para qué
Respuestas, textos libres y tests del recorrido (psicología, ayurveda, medicina china,
fisiología, nutrición, cábala, astrología), que pueden revelar salud física o emocional;
datos de nacimiento; datos de familiares (genograma). Finalidad: que la persona guarde su
recorrido y que María pueda leerlo para acompañarla y preparar lecturas personalizadas.
Base: contrato + consentimiento explícito (art. 9.2.a), con casilla propia en el pago.
Detalle: `registro-actividades-tratamiento.md`, apartado 2.

## 2. ¿Es necesario y proporcionado?
- Solo se pide lo que la persona decide escribir: ningún campo es obligatorio.
- Sin perfiles ni decisiones automatizadas, sin cesión a terceros, sin uso comercial.
- Acceso humano: solo María (y «entrar como» para incidencias, con 12 h y registro).
- **A decidir:** plazo de conservación. Hoy es «mientras exista la cuenta». Propuesta: avisar por email a las cuentas sin entrar en 3 años y borrar si no responden en 30 días.

## 3. Riesgos y medidas

| Riesgo | Medida actual | Pendiente |
|---|---|---|
| Acceso no autorizado a la base de datos | RLS sin políticas, solo `service_role` desde el servidor; HTTPS; JWT; `OwnerGuard` en cada ruta de datos | Revisar cada ruta nueva con la misma guarda |
| Guardar sin consentimiento | `ConsentimientoSaludGuard` en el servidor + casilla separada + ventana en /metodo | Correr `sql/consentimiento-salud-reset.sql` tras desplegar |
| Lectura indebida por quien administra | Un solo administrador (María); «entrar como» limitado y registrado | Acuerdo de confidencialidad si algún día hay más personas |
| Datos de terceros (familiares) | Aviso en la política; la persona responde de ellos | — |
| Datos que no se borran | Borrado de cuenta de todo o nada; fotos del genograma y perfil incluidas | Probar el borrado con una cuenta real tras cada tabla nueva |
| Proveedores sin contrato | Stripe, Render: en sus condiciones | **Firmar DPA de Supabase y Google Analytics; cambiar Gmail por Brevo** (ver registro) |
| Transferencias a EE. UU. | Cláusulas tipo / Marco de Privacidad de Datos | Elegir región UE en Supabase y Render si es posible |
| Brecha de seguridad | `registro-brechas.md` | — |

## 4. Conclusión
Con las medidas de la columna «Pendiente» cerradas, el riesgo residual es asumible. Si no se
puede reducir en algún punto, habría que consultar a la AEPD antes de seguir (art. 36).

Firmado: ____________________ Fecha: ____________
