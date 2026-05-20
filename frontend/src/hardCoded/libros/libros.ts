export interface Apunte {
  id: string;
  titulo: string;
  link: string;
  img?: string;
}

export interface Libro {
  id: string;
  titulo: string;
  link: string;
  img?: string;
}

export interface LibroPago {
  id: string;
  titulo: string;
  descripcion: string;
  link: string;       // a dónde lleva el botón (ahora: donación Stripe)
  pdfLink?: string;   // PDF real, para entregar tras el pago cuando esté listo
  img?: string;
}

const drivePdf = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`;
const DONATION_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

export const apuntes: Apunte[] = [
  { id: "tao-fisica",          titulo: "El Tao de la física",    link: drivePdf("1XJ5RpF7Sk9Z-EgXqvV1SAa1E_l9dVS3N"), img: "/libros/img/taofisica.png" },
  { id: "proteinas",           titulo: "Las proteínas",          link: drivePdf("1lROz605oU6EEMuPgPKkDrRLMZJqsveRF"), img: "/libros/img/proteins.png" },
  { id: "filosofia",           titulo: "Filosofía",              link: drivePdf("1Fz9l-O9JkpTsoRF9qvHp585wZrAcJFsA"), img: "/libros/img/filosofia.png"  },
  { id: "neurotransmisores",   titulo: "Neurotransmisores",      link: drivePdf("1m5ecq6fKV4lsu4S1uEQL2BnxskJr4eol"), img: "/libros/img/neurotransmisores.png" },
  { id: "medicina-integral",   titulo: "Medicina Integral",      link: drivePdf("1CJKRT7n7dD_UFmokDsD7oR1WlyajADt6"), img: "/libros/img/integrativo.png" },
  { id: "sistema-inmunitario", titulo: "El Sistema Inmunitario (In a Nutshell)", link: drivePdf("1LIBkRIDy_hGabD5pLC6k96DOkHogJT06"), img: "/libros/img/inmune.png" },
  { id: "fitoterapia",         titulo: "Fitoterapia",            link: drivePdf("1HBNMD_PPvvZHe7Xgdihq2v30F5jIr2ML"), img: "/libros/img/fitoterapia.png" },
  { id: "ayurveda",            titulo: "Ayurveda",               link: drivePdf("1jjhFjyxkfXNwExBQnPYjRh_66v5O3hgn"), img: "/libros/img/ayurveda.png"  },
  { id: "anatomia-fisiologia", titulo: "Anatomía y fisiología",  link: drivePdf("1nJmZ1jRRQ7bKXYoao0t7mxbR1mrMrISz"), img: "/libros/img/anatomiayfisiologia.jpg"  },
];

export const libros: Libro[] = [
  { id: "psicologia-general",         titulo: "Psicología general",                       link: drivePdf("1--MYyxlZvYCEQ0wab1GzHJTn6_lyrvOg"), img: "/libros/img/psicologia.jpg" },
  { id: "historia-matematicas",       titulo: "Historia de las matemáticas",              link: drivePdf("1KOMOGBOr_CiIPRVPQrBs43kFIgGyIcq3"), img: "/libros/img/maths.jpg" },
  { id: "tcm-coursera",               titulo: "Medicina China (Coursera)",                link: drivePdf("1lBu9ACzSrZ-4WTav8ELpjfkz0spFZePc"), img: "/libros/img/medicina-tradicional-china.jpg" },
  { id: "la-tierra",                  titulo: "La Tierra",                                link: drivePdf("1pzT529GXniv74tqXLDoUvMzeG41koIcN"), img: "/libros/img/earth.jpg" },
  { id: "cuerpo-humano",              titulo: "El cuerpo humano",                         link: drivePdf("1dRlUlB9yz9hyWGVV0HH7AZeBe9-xT-Nv"), img: "/libros/img/cuerpohumano.jpg" },
  { id: "diagnostico-lengua",         titulo: "Diagnóstico de lengua",                    link: drivePdf("1AXPL-rOx5HbAMFAnGDsvMbYtw-mXsN4S"), img: "/libros/img/tonguediagnosis.jpg" },
  { id: "trauma",                     titulo: "Las heridas que no vemos (Begoña Aznárez)",                                   link: drivePdf("1_AjmAmh1otjLjfwrcRaLUGPl6mAyFNQ-"), img: "/libros/img/traumas.png" },
  { id: "virginia-blanes",            titulo: "Virginia Blanes",                          link: drivePdf("1bmWpebgVLlX_5E5yVfA5-GbxaPUMnhFU"), img: "/libros/img/virginiablanes.jpg" },
  { id: "el-cerebro",                 titulo: "El cerebro",                               link: drivePdf("1p5ki_-AumpW-a06zbkk_PHDyZMGdXiIE"), img: "/libros/img/brain.jpg" },
  { id: "historia-psicologia",        titulo: "Historia de la psicología",                link: drivePdf("1Ca6ns6nZxmKcKc1IPpRICt3Xr5zSjipY"), img: "/libros/img/psicologiahistoria.jpg" },
  { id: "mujer-mariposa",             titulo: "Mujer mariposa (Elena Cobos)",                           link: drivePdf("1MBvdLb38hIWWQCQFkK5neJXX-B4fTzst"), img: "/libros/img/mariposa.jpg" },
  { id: "neurociencia-medica",        titulo: "Neurociencia médica",                      link: drivePdf("1n2bb-xpEVuDE3tv2kGJXgdjIzwc6gbCr"), img: "/libros/img/neuroscience.jpg" },
  { id: "psicologia-basica",          titulo: "Psicología básica",                        link: drivePdf("1K0GBTr_OFWGo7NTmnhtroG4n1DVOen7k"), img: "/libros/img/psicologiabasica.jpg" },
  { id: "senalizacion-celular",       titulo: "Principios de señalización celular",       link: drivePdf("1etFxP6cCkAyBz66DnUItyu6p6vRtfc2k"), img: "/libros/img/señalizacioncelular.avif" },
  { id: "sistema-inmunitario-2",      titulo: "Sistema inmunitario II",                   link: drivePdf("1bq0QtTCIoFFRztsvu0HtnlUobH1qRnuc"), img: "/libros/img/sistemainmunitario.webp" },
  { id: "biologia-celular",           titulo: "Biología celular",                         link: drivePdf("1NaVLCcGXkyKU-qhmvum9cZ1zpgru0vl_"), img: "/libros/img/biocelular.jpg" },
  { id: "bioquimica-metabolismo",     titulo: "Bioquímica del metabolismo energético",    link: drivePdf("1RF4BJ3qF14ILhfpq6_8FQXsZsvr1kq5Q"), img: "/libros/img/bioquimica.jpg" },
  { id: "microbiota",                 titulo: "Microbiota",                               link: drivePdf("18FQf2eZ1C0ZzqppQBGsQbPS3R0vamUxV"), img: "/libros/img/microbiota.webp" },
  { id: "planta-sabe",                titulo: "Lo que sabe una planta",                   link: drivePdf("11R-98VI5YtlRMJXENsuG0sXeiNk_ofRv"), img: "/libros/img/planta.jpg" },
  { id: "historia-medicina",          titulo: "Historia de la medicina",                  link: drivePdf("1yZ4-V5xbJXBHCXHvmwJbpAoAsR-xZeSr"), img: "/libros/img/historiamedicina.jpg" },
  { id: "jaula-dorada",               titulo: "Jaula dorada (Anorexia)",                             link: drivePdf("1iuRjc9CmctyRRFXzpGKtMTqh98YzvcKl"), img: "/libros/img/jaula.jpg" },
  { id: "particulas-cuanticas",       titulo: "Partículas cuánticas",                     link: drivePdf("1mx4ZGiB_ShYo_LSgMc2h61qFFitrcCPC"), img: "/libros/img/particulascuanticas.webp" },
  { id: "formacion-tierra",           titulo: "La formación de la Tierra",                link: drivePdf("1_-MNtHzP138j9oc2_z_IVdfKBdtH58Ew"), img: "/libros/img/formaciondelatierra.webp" },
  { id: "anatomia-especializacion",   titulo: "Anatomía (especialización)",               link: drivePdf("1ZJz_FncAIps8t7QEGJFvPTJbxzhJJhmQ"), img: "/libros/img/anatomia.jpg" },
  { id: "nutricion-deporte",          titulo: "Nutrición en ciencias del deporte",        link: drivePdf("1VvFKEmzWBviYm03fz8le2kRyVzJYbe4g"), img: "/libros/img/nutricion.jpg" },
  { id: "magia-edad-media",           titulo: "Magia en la Edad Media",                   link: drivePdf("1SWHwB3uJpyHPnWllR-r1HhpJDFZq6_t7"), img: "/libros/img/magiaedadmedia.jpg" },
  { id: "coaching-mujeres",           titulo: "Coaching de mujeres",                      link: drivePdf("1gZ_woqTDQdY-hoFMBp65uGCt64bYmztb"), img: "/libros/img/coachingwomen.jpg" },
];

export const librosPago: LibroPago[] = [
  {
    id: "life-as-a-privilege",
    titulo: "Life as a Privilege",
    descripcion: "El libro fundacional del método. Una invitación a entender la Vida como un camino de despertar.",
    link: DONATION_LINK,
    pdfLink: drivePdf("1YKcYYSjxZudK112Ohsn4pSK449nCwLgk"),
    img: "/libros/img/book.png",
  },
  {
    id: "chinese-medicine",
    titulo: "Chinese Medicine",
    descripcion: "Una recopilación profunda de los principios de la medicina tradicional china.",
    link: DONATION_LINK,
    pdfLink: drivePdf("1lX1ahYlzjFaWvuk-tlhS3ar5f_ht7Ww3"),
    img: "/libros/img/tcm.png",
  },
  {
    id: "the-kabbalah",
    titulo: "The Kabbalah",
    descripcion: "Una introducción a los misterios de la Cábala: el árbol de la vida y las sefirot.",
    link: DONATION_LINK,
    pdfLink: drivePdf("1hFXw_92WF82V0kS6C1nlkW6ZR0zpixKX"),
    img: "/libros/img/cabala.png",
  },
  {
    id: "psicosomatica",
    titulo: "Psicosomática (Jose Luis Marín)",
    descripcion: "Cómo las emociones, los traumas y la mente nos enferman.",
    link: DONATION_LINK,
    pdfLink: drivePdf("1uzpahRZoDr47SefN83pELg4urj61GkNE"),
    img: "/libros/img/psicosomatica.png",
  },
  {
    id: "fisiologia",
    titulo: "Fisiología",
    descripcion: "Los fundamentos de cómo funciona el cuerpo humano.",
    link: DONATION_LINK,
    pdfLink: drivePdf("1vzgDPnQcuChl-5sm2Wv_iTiY2NcR_SjV"),
    img: "/libros/img/fisiologia(pago).png",
  },
];
