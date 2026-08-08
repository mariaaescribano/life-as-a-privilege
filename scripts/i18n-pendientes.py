"""Busca texto visible que TODAVÍA no pasa por el traductor.

   python scripts/i18n-pendientes.py                  → los sitios de siempre
   python scripts/i18n-pendientes.py app/metodo       → solo esa carpeta

Se ejecuta desde `frontend/src`, o desde la raíz (él solo se coloca).

Por qué existe: mirar si un archivo «usa useT()» no vale para nada — un archivo
puede traducir tres frases y dejarse veinte. Esto da por sospechoso TODO el
texto de JSX y toda cadena en una prop de texto, y solo descarta lo que es
claramente técnico. Sale ruido (los genéricos de TypeScript parecen etiquetas
JSX), pero es preferible: lo que no salga aquí es que de verdad no está.

Lo que aparece y NO hay que traducir: nombres propios (María Escribano, Life as
a Privilege, TikTok…), las páginas de `app/legal` (son documentos que obligan y
van solo en español, a propósito) y los `nombre=` de los glifos dibujados.
"""
import io, os, re, sys

POR_DEFECTO = ["app/web", "app/home", "app/auth", "app/aprendizaje", "app/espacio",
               "components/global", "components/welcome", "components/aprendizaje",
               "components/espacio", "app/metodo", "components/metodo"]

# Ruido: genéricos de TS, ternarios y fragmentos de código que el regex de JSX
# confunde con texto.
RUIDO = re.compile(r"useState|useRef|=>|Set<|Record<|Promise<|NonNullable|\bconst\b|\breturn\b|\bnavigate\(|window\.|\?\s*\(|\)\s*:")
TECNICO = re.compile(
    r"^(https?://|/|#[0-9a-fA-F]{3,8}$|\.|rgba?\(|linear|blur|EB Garamond|serif|sans|currentColor|none|auto|center|left|right|"
    r"[\d\s%.,:/·|—+-]+$|[a-z]+([A-Z][a-z]+)+$|[a-z-]+$)")
PROPS = r"(title|label|aria-label|placeholder|alt|texto|titulo|resumen|descripcion|subtitulo|mensaje|etiqueta|pie|lema|encabezado)"


def limpiar(src: str) -> str:
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"^\s*//.*$", "", src, flags=re.M)
    src = re.sub(r"\{/\*.*?\*/\}", "", src, flags=re.S)
    src = re.sub(r'\bt\(\s*"[^"]*"(\s*,\s*\{[^}]*\})?\s*\)', "T()", src)   # ya traducido
    src = re.sub(r'\btraducir\(\s*"[^"]*"', "T(", src)
    return src


def sospechosas(src: str):
    for m in re.finditer(r">([^<>{}]{3,})<", src):
        s = " ".join(m.group(1).split())
        if re.search(r"[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}", s) and not TECNICO.match(s) and not RUIDO.search(s):
            yield "jsx", s
    for m in re.finditer(rf'\b{PROPS}\s*=\s*[{{"]?\s*"([^"]{{3,}})"', src):
        s = m.group(2).strip()
        if not TECNICO.match(s) and not RUIDO.search(s):
            yield m.group(1), s


def main() -> int:
    if os.path.isdir("frontend/src"):
        os.chdir("frontend/src")
    dirs = sys.argv[1:] or POR_DEFECTO
    total = 0
    for d in dirs:
        for base, _, files in os.walk(d):
            for f in sorted(files):
                if not f.endswith((".tsx", ".ts")):
                    continue
                p = os.path.join(base, f).replace(os.sep, "/")
                hits = list(sospechosas(limpiar(io.open(p, encoding="utf-8").read())))
                if hits:
                    total += len(hits)
                    print(f"\n== {p}  ({len(hits)})")
                    for clave, s in hits:
                        print(f"   [{clave}] {s[:120]}")
    print(f"\nTOTAL sospechosas: {total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
