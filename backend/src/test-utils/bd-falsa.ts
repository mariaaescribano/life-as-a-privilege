// Supabase de mentira para los tests: tablas en memoria con insert / select /
// update / delete y los filtros que usa el código (.eq, .ilike, .limit).
// `.ilike` iguala sin distinguir mayúsculas y respeta los escapes \_ \% \\
// (el código no usa comodines de verdad).

type Fila = Record<string, any>;

export function bdFalsa(inicial: Record<string, Fila[]> | Fila[] = []) {
  const tablas: Record<string, Fila[]> = Array.isArray(inicial) ? { user: inicial } : inicial;
  const tabla = (nombre: string) => (tablas[nombre] ??= []);

  const consulta = (nombre: string, op: 'select' | 'insert' | 'update' | 'delete', payload?: any) => {
    const filtros: ((f: Fila) => boolean)[] = [];
    let limite = Infinity;
    const q: any = {
      eq: (c: string, v: any) => { filtros.push((f) => f[c] === v); return q; },
      ilike: (c: string, patron: string) => {
        const literal = patron.replace(/\\([\\%_])/g, '$1').toLowerCase();
        filtros.push((f) => typeof f[c] === 'string' && f[c].toLowerCase() === literal);
        return q;
      },
      limit: (n: number) => { limite = n; return q; },
      select: () => q,
      single: () => q,
      then: (ok: any, ko: any) => Promise.resolve(ejecutar()).then(ok, ko),
    };
    const casan = () => tabla(nombre).filter((f) => filtros.every((fn) => fn(f)));
    const ejecutar = () => {
      if (op === 'insert') {
        const nuevas = (Array.isArray(payload) ? payload : [payload]).map((p) => ({ ...p }));
        tabla(nombre).push(...nuevas);
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
      return { data: casan().slice(0, limite).map((f) => ({ ...f })), error: null };
    };
    return q;
  };

  const client = {
    from: (nombre: string) => ({
      select: () => consulta(nombre, 'select'),
      insert: (p: any) => consulta(nombre, 'insert', p),
      update: (p: any) => consulta(nombre, 'update', p),
      delete: () => consulta(nombre, 'delete'),
    }),
  };
  return { tablas, filas: tabla('user'), databaseService: { getClient: () => client } as any };
}
