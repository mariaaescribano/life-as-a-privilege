// Lista canónica de libros de pago (servidor = fuente de verdad).
// El frontend NO puede modificar precios ni pdfLinks — solo envía el id.

export interface LibroPagoServer {
  id: string;
  titulo: string;
  precioCentimos: number; // EUR en céntimos (5€ → 500)
  pdfLink: string;
}

const drivePdf = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`;

export const librosPagoServer: LibroPagoServer[] = [
  {
    id: 'life-as-a-privilege',
    titulo: 'Life as a Privilege',
    precioCentimos: 500,
    pdfLink: drivePdf('1YKcYYSjxZudK112Ohsn4pSK449nCwLgk'),
  },
  {
    id: 'chinese-medicine',
    titulo: 'Chinese Medicine',
    precioCentimos: 500,
    pdfLink: drivePdf('1lX1ahYlzjFaWvuk-tlhS3ar5f_ht7Ww3'),
  },
  {
    id: 'the-kabbalah',
    titulo: 'The Kabbalah',
    precioCentimos: 500,
    pdfLink: drivePdf('1hFXw_92WF82V0kS6C1nlkW6ZR0zpixKX'),
  },
  {
    id: 'psicosomatica',
    titulo: 'Psicosomática (Jose Luis Marín)',
    precioCentimos: 500,
    pdfLink: drivePdf('1uzpahRZoDr47SefN83pELg4urj61GkNE'),
  },
  {
    id: 'fisiologia',
    titulo: 'Fisiología',
    precioCentimos: 500,
    pdfLink: drivePdf('1vzgDPnQcuChl-5sm2Wv_iTiY2NcR_SjV'),
  },
];

export function findLibroPago(id: string): LibroPagoServer | undefined {
  return librosPagoServer.find((l) => l.id === id);
}
