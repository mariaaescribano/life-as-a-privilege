import { Injectable, Logger } from '@nestjs/common';
import * as Astronomy from 'astronomy-engine';
import { DateTime } from 'luxon';
import { find as findTimezone } from 'geo-tz';
import type {
  Aspecto,
  CartaNatal,
  CuerpoKey,
  LugarNacimiento,
  PosicionPlaneta,
  TipoAspecto,
} from './cartaNatal.types';

/* ─────────────────────── Constantes ─────────────────────── */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'LifeAsAPrivilege/1.0 (contacto@savimbo.com)';

const ZODIAC_NAMES = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
];

export interface CartaDataEntry {
  signo?: string;
  casa?: number;
  profundizadoSigno?: boolean;
  profundizadoCasa?: boolean;
}
export type CartaData = Partial<Record<CuerpoKey, CartaDataEntry>>;

interface BodyDef {
  key: CuerpoKey;
  body: Astronomy.Body;
}

const BODIES: BodyDef[] = [
  { key: 'sol',      body: Astronomy.Body.Sun     },
  { key: 'luna',     body: Astronomy.Body.Moon    },
  { key: 'mercurio', body: Astronomy.Body.Mercury },
  { key: 'venus',    body: Astronomy.Body.Venus   },
  { key: 'marte',    body: Astronomy.Body.Mars    },
  { key: 'jupiter',  body: Astronomy.Body.Jupiter },
  { key: 'saturno',  body: Astronomy.Body.Saturn  },
  { key: 'urano',    body: Astronomy.Body.Uranus  },
  { key: 'neptuno',  body: Astronomy.Body.Neptune },
  { key: 'pluton',   body: Astronomy.Body.Pluto   },
];

interface AspectoDef { tipo: TipoAspecto; angulo: number; orbe: number; }

const ASPECTOS_DEF: AspectoDef[] = [
  { tipo: 'conjuncion', angulo: 0,   orbe: 8 },
  { tipo: 'oposicion',  angulo: 180, orbe: 8 },
  { tipo: 'trigono',    angulo: 120, orbe: 7 },
  { tipo: 'cuadratura', angulo: 90,  orbe: 7 },
  { tipo: 'sextil',     angulo: 60,  orbe: 5 },
];

/* ─────────────────────── Service ─────────────────────── */

@Injectable()
export class CartaNatalService {
  private readonly logger = new Logger(CartaNatalService.name);

  /* ── Geocoding (Nominatim) ── */
  async geocode(lugar: string, region: string, pais: string): Promise<{ lat: number; lng: number } | null> {
    const q = [lugar, region, pais].filter(Boolean).join(', ');
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(q)}&format=json&limit=1`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'es,en' } });
      if (!res.ok) {
        this.logger.warn(`Nominatim ${res.status}: ${q}`);
        return null;
      }
      const arr = await res.json() as Array<{ lat: string; lon: string }>;
      if (!arr || arr.length === 0) {
        this.logger.warn(`Nominatim sin resultados: ${q}`);
        return null;
      }
      return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Geocode error: ${msg}`);
      return null;
    }
  }

  /* ── Timezone IANA a partir de lat/lng ── */
  getTimezone(lat: number, lng: number): string {
    const zones = findTimezone(lat, lng);
    return zones[0] ?? 'UTC';
  }

  /* ── Convierte fecha/hora local + tz → Date UTC ── */
  localToUtc(fecha: string, hora: string, timezone: string): Date | null {
    const dt = DateTime.fromISO(`${fecha}T${hora}`, { zone: timezone });
    if (!dt.isValid) return null;
    return dt.toUTC().toJSDate();
  }

  /**
   * Pre-llena el `data` del usuario (signos/casas de cada planeta) a partir de la carta calculada.
   * Respeta los valores que el usuario ya tenga (no sobrescribe).
   */
  mergeWithCartaData(existing: CartaData | null | undefined, carta: CartaNatal): CartaData {
    const result: CartaData = { ...(existing || {}) };
    for (const p of carta.planetas) {
      const cur: CartaDataEntry = result[p.planeta] || {};
      const signo = ZODIAC_NAMES[p.signoIdx];
      // El ascendente no tiene "casa" (es la cúspide de casa 1 por definición)
      if (p.planeta === 'ascendente') {
        result[p.planeta] = { ...cur, signo: cur.signo ?? signo };
      } else {
        result[p.planeta] = {
          ...cur,
          signo: cur.signo ?? signo,
          casa: cur.casa ?? p.casa,
        };
      }
    }
    return result;
  }

  /* ── Calcula la carta natal completa ── */
  calcular(utc: Date, lugar: LugarNacimiento): CartaNatal {
    const { lat, lng } = lugar;

    // 1) Oblicuidad eclíptica
    const eps = obliquityDeg(utc);

    // 2) Tiempo sideral local (en grados)
    const gst = Astronomy.SiderealTime(utc); // GAST en horas (0-24)
    const lstDeg = norm360(gst * 15 + lng);

    // 3) MC y ASC
    const mc = mcLongitude(lstDeg, eps);
    const asc = ascLongitude(lstDeg, eps, lat);

    // 4) Cúspides Placidus
    const cusps = placidusCusps(asc, mc, lstDeg, eps, lat);

    // 5) Posición de cada planeta (longitud eclíptica geocéntrica)
    const planetas: PosicionPlaneta[] = BODIES.map(({ key, body }) => {
      const vec = Astronomy.GeoVector(body, utc, true);
      const ecl = Astronomy.Ecliptic(vec);
      const lon = norm360(ecl.elon);
      return {
        planeta: key,
        grado: lon,
        signoIdx: Math.floor(lon / 30) % 12,
        casa: casaDe(lon, cusps),
      };
    });

    // 6) Nodo Lunar Medio (Norte) y su opuesto (Sur)
    const nodoNorte = meanLunarNode(utc);
    const nodoSur = norm360(nodoNorte + 180);
    planetas.push(
      {
        planeta: 'nodoNorte',
        grado: nodoNorte,
        signoIdx: Math.floor(nodoNorte / 30) % 12,
        casa: casaDe(nodoNorte, cusps),
      },
      {
        planeta: 'nodoSur',
        grado: nodoSur,
        signoIdx: Math.floor(nodoSur / 30) % 12,
        casa: casaDe(nodoSur, cusps),
      },
    );

    // 7) Ascendente como cuerpo (para mostrar en UI si interesa)
    planetas.unshift({
      planeta: 'ascendente',
      grado: asc,
      signoIdx: Math.floor(asc / 30) % 12,
      casa: 1,
    });

    // 7) Aspectos entre planetas (excluyendo ascendente)
    const cuerpos = planetas.filter(p => p.planeta !== 'ascendente');
    const aspectos: Aspecto[] = [];
    for (let i = 0; i < cuerpos.length; i++) {
      for (let j = i + 1; j < cuerpos.length; j++) {
        const diff = angularDiff(cuerpos[i].grado, cuerpos[j].grado);
        for (const def of ASPECTOS_DEF) {
          if (Math.abs(diff - def.angulo) <= def.orbe) {
            aspectos.push({ a: cuerpos[i].planeta, b: cuerpos[j].planeta, tipo: def.tipo });
            break;
          }
        }
      }
    }

    return { ascendente: asc, cusps, planetas, aspectos };
  }
}

/* ─────────────────────── Matemática astronómica ─────────────────────── */

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function angularDiff(a: number, b: number): number {
  const d = Math.abs(norm360(a - b));
  return d > 180 ? 360 - d : d;
}

/** Oblicuidad media de la eclíptica (IAU 1980), en grados. */
function obliquityDeg(date: Date): number {
  const T = (date.getTime() / 86400000 + 2440587.5 - 2451545.0) / 36525;
  const arcsec = 84381.448 - 46.8150 * T - 0.00059 * T * T + 0.001813 * T * T * T;
  return arcsec / 3600;
}

/** Longitud eclíptica del Nodo Lunar Medio (Norte), en grados. Fórmula Meeus 47.7. */
function meanLunarNode(date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const T = (JD - 2451545.0) / 36525;
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  return norm360(omega);
}

/** Longitud eclíptica del MC (Midheaven), grados. */
function mcLongitude(lstDeg: number, epsDeg: number): number {
  const lst = lstDeg * D2R;
  const eps = epsDeg * D2R;
  const lon = Math.atan2(Math.sin(lst), Math.cos(lst) * Math.cos(eps));
  return norm360(lon * R2D);
}

/** Longitud eclíptica del Ascendente, grados. */
function ascLongitude(lstDeg: number, epsDeg: number, latDeg: number): number {
  const lst = lstDeg * D2R;
  const eps = epsDeg * D2R;
  const lat = latDeg * D2R;
  const y = -Math.cos(lst);
  const x = Math.sin(lst) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps);
  let lon = Math.atan2(y, x) * R2D;
  lon = norm360(lon);
  return lon;
}

/** Declinación de un punto eclíptico (lon, lat=0), grados. */
function declination(lonDeg: number, epsDeg: number): number {
  const lon = lonDeg * D2R;
  const eps = epsDeg * D2R;
  return Math.asin(Math.sin(eps) * Math.sin(lon)) * R2D;
}

/** Ascensión recta de un punto eclíptico (lon, lat=0), grados. */
function rightAscension(lonDeg: number, epsDeg: number): number {
  const lon = lonDeg * D2R;
  const eps = epsDeg * D2R;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lon), Math.cos(lon)) * R2D;
  return norm360(ra);
}

/** Longitud eclíptica desde AR (asumiendo lat=0), grados. */
function eclipticFromRA(raDeg: number, epsDeg: number): number {
  const ra = raDeg * D2R;
  const eps = epsDeg * D2R;
  const lon = Math.atan2(Math.sin(ra) * Math.cos(eps) + Math.tan(0) * Math.sin(eps), Math.cos(ra)) * R2D;
  return norm360(lon);
}

/**
 * Cúspides Placidus.
 * Devuelve array de 12 longitudes eclípticas, cusps[0] = cusp 1 (ASC), cusps[3] = cusp 4 (IC), etc.
 * Para latitudes extremas (|lat| > 66°) cae a Equal House desde el ASC.
 */
function placidusCusps(
  asc: number,
  mc: number,
  lstDeg: number,
  eps: number,
  latDeg: number,
): number[] {
  const ic = norm360(mc + 180);
  const dsc = norm360(asc + 180);

  // Equal House fallback en latitudes extremas (Placidus degenera)
  if (Math.abs(latDeg) > 66) {
    return Array.from({ length: 12 }, (_, i) => norm360(asc + i * 30));
  }

  const ramc = lstDeg;
  const c11 = placidusIntermediate(11, ramc, eps, latDeg);
  const c12 = placidusIntermediate(12, ramc, eps, latDeg);
  const c2  = placidusIntermediate(2,  ramc, eps, latDeg);
  const c3  = placidusIntermediate(3,  ramc, eps, latDeg);

  // Cúspides opuestas: + 180°
  const c5 = norm360(c11 + 180);
  const c6 = norm360(c12 + 180);
  const c8 = norm360(c2 + 180);
  const c9 = norm360(c3 + 180);

  return [asc, c2, c3, ic, c5, c6, dsc, c8, c9, mc, c11, c12];
}

/**
 * Calcula una cúspide intermedia Placidus (11, 12, 2, 3) por iteración.
 *
 * Para Placidus, cada cúspide intermedia satisface que el punto eclíptico, vista
 * desde la latitud, ha cubierto una fracción `f` de su semi-arco diurno/nocturno
 * desde el meridiano. El sentido (este/oeste, arriba/abajo) varía según la cusp.
 */
function placidusIntermediate(n: 11 | 12 | 2 | 3, ramcDeg: number, epsDeg: number, latDeg: number): number {
  // Parámetros: (f = fracción del semi-arco, signo del MC, hemisferio sur del horizonte)
  // n=11: f=2/3, sign=+1 (oeste del MC, arriba)
  // n=12: f=1/3, sign=+1 (oeste del MC, arriba pero más cerca del ASC)
  // n=2:  f=1/3, sign=+1 (oeste del IC, abajo)
  // n=3:  f=2/3, sign=+1 (oeste del IC, abajo)
  // El signo del semi-arco depende de si el punto está arriba o abajo del horizonte.

  let f: number;
  let above: boolean; // true = sobre horizonte (semi-arco diurno), false = bajo (nocturno)
  switch (n) {
    case 11: f = 1 / 3; above = true;  break;  // 1/3 del semi-arco contado desde MC hacia oeste
    case 12: f = 2 / 3; above = true;  break;
    case 2:  f = 2 / 3; above = false; break;  // contado desde IC hacia oeste, bajo horizonte
    case 3:  f = 1 / 3; above = false; break;
  }

  // RA inicial: cusp n=11 → ramc + 30°, n=12 → ramc + 60°, n=2 → ramc + 120°, n=3 → ramc + 150°
  const initialOffset: Record<number, number> = { 11: 30, 12: 60, 2: 120, 3: 150 };
  let ra = norm360(ramcDeg + initialOffset[n]);
  const lat = latDeg * D2R;
  const eps = epsDeg;

  for (let iter = 0; iter < 20; iter++) {
    const lon = eclipticFromRA(ra, eps);
    const dec = declination(lon, eps);
    const tanDec = Math.tan(dec * D2R);

    // Para semi-arco diurno: cos(SA) = -tan(lat) * tan(dec)
    // Para semi-arco nocturno: cos(SA') = +tan(lat) * tan(dec)  (mismo valor absoluto, ángulo opuesto)
    const cosSA = (above ? -1 : +1) * Math.tan(lat) * tanDec;
    if (cosSA > 1 || cosSA < -1) {
      // El punto no se alza/pone visto desde esa latitud — fallback a equal house desde MC/IC
      return norm360(ramcDeg + initialOffset[n]);
    }
    const SA = Math.acos(cosSA) * R2D;

    const newRA = norm360(ramcDeg + f * SA + (above ? 0 : 180));
    if (Math.abs(angularDiff(newRA, ra)) < 0.0001) {
      return eclipticFromRA(newRA, eps);
    }
    ra = newRA;
  }
  return eclipticFromRA(ra, epsDeg);
}

/** Casa (1-12) en la que cae una longitud eclíptica, dadas las cúspides. */
function casaDe(lonDeg: number, cusps: number[]): number {
  const lon = norm360(lonDeg);
  for (let i = 0; i < 12; i++) {
    const a = cusps[i];
    const b = cusps[(i + 1) % 12];
    if (inArc(lon, a, b)) return i + 1;
  }
  return 1;
}

/** ¿Está `lon` dentro del arco antihorario desde `a` a `b`? */
function inArc(lon: number, a: number, b: number): boolean {
  const span = norm360(b - a);
  const offset = norm360(lon - a);
  return offset >= 0 && offset < span;
}
