// Supabase de mentira para los tests: tablas en memoria con insert / select /
// update / delete y los filtros que usa el código (.eq, .ilike, .limit).
// `.ilike` iguala sin distinguir mayúsculas y respeta los escapes \_ \% \\
// (el código no usa comodines de verdad).

type Fila = Record<string, any>;

export function bdFalsa(inicial: Record<string, Fila[]> | Fila[] = []) {
  const tablas: Record<string, Fila[]> = Array.isArray(inicial) ? { user: inicial } : inicial;
  const tabla = (nombre: string) => (tablas[nombre] ??= []);

  const consulta = (
    nombre: string,
    op: 'select' | 'insert' | 'update' | 'delete' | 'upsert',
    payload?: any,
    opciones?: any,
  ) => {
    const filtros: ((f: Fila) => boolean)[] = [];
    let limite = Infinity;
    let unaSola = false; // maybeSingle: una fila o null
    let orden: { col: string; asc: boolean } | null = null;
    const q: any = {
      eq: (c: string, v: any) => { filtros.push((f) => f[c] === v); return q; },
      in: (c: string, vs: any[]) => { filtros.push((f) => vs.includes(f[c])); return q; },
      not: (c: string, operador: string, v: any) => {
        // Solo lo que usa el código: .not(col, 'is', null) → col != null
        if (operador === 'is' && v === null) filtros.push((f) => f[c] != null);
        return q;
      },
      ilike: (c: string, patron: string) => {
        const literal = patron.replace(/\\([\\%_])/g, '$1').toLowerCase();
        filtros.push((f) => typeof f[c] === 'string' && f[c].toLowerCase() === literal);
        return q;
      },
      order: (c: string, o?: { ascending?: boolean }) => { orden = { col: c, asc: o?.ascending !== false }; return q; },
      limit: (n: number) => { limite = n; return q; },
      select: () => q,
      single: () => q,
      maybeSingle: () => { unaSola = true; return q; },
      then: (ok: any, ko: any) => Promise.resolve(ejecutar()).then(ok, ko),
    };
    const casan = () => tabla(nombre).filter((f) => filtros.every((fn) => fn(f)));
    const ejecutar = () => {
      if (op === 'insert') {
        const nuevas = (Array.isArray(payload) ? payload : [payload]).map((p) => ({ ...p }));
        tabla(nombre).push(...nuevas);
        return { data: nuevas.map((f) => ({ ...f })), error: null };
      }
      if (op === 'upsert') {
        // Como en Supabase: si ya hay fila con el mismo valor en la columna de
        // onConflict, se actualizan las columnas que vienen; si no, se inserta.
        const clave = opciones?.onConflict ?? 'id';
        const nuevas = (Array.isArray(payload) ? payload : [payload]).map((p) => ({ ...p }));
        for (const p of nuevas) {
          const existente = tabla(nombre).find((f) => f[clave] === p[clave]);
          if (existente) Object.assign(existente, p);
          else tabla(nombre).push(p);
        }
        return { data: nuevas.map((f) => ({ ...f })), error: null };
      }
      if (op === 'update') {
        const tocadas = casan();
        tocadas.forEach((f) => Object.assign(f, payload));
        return { data: tocadas.map((f) => ({ ...f })), error: null };
      }
      if (op === 'delete') {
        const borrar = new Set(casan());
        tablas[nombre] = tabla(nombre).filter((f) => !borrar.has(f));
        return { data: [...borrar], error: null };
      }
      let filas = casan();
      if (orden) {
        const { col, asc } = orden;
        filas = [...filas].sort((a, b) => (a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0) * (asc ? 1 : -1));
      }
      const copia = filas.slice(0, limite).map((f) => ({ ...f }));
      if (unaSola) return { data: copia[0] ?? null, error: null };
      return { data: copia, error: null };
    };
    return q;
  };

  const client = {
    from: (nombre: string) => ({
      select: () => consulta(nombre, 'select'),
      insert: (p: any) => consulta(nombre, 'insert', p),
      upsert: (p: any, o?: any) => consulta(nombre, 'upsert', p, o),
      update: (p: any) => consulta(nombre, 'update', p),
      delete: () => consulta(nombre, 'delete'),
    }),
  };
  return { tablas, filas: tabla('user'), databaseService: { getClient: () => client } as any };
}
