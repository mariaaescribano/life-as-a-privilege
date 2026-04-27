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

const gdocView = (id: string) => `https://docs.google.com/document/d/${id}/view`;

export const apuntes: Apunte[] = [
  { id: "tao-fisica",          titulo: "El Tao de la física",    link: gdocView("1cqgJQsv2E8X5oG_vQn_uxvlq7SRkLAx-dLCzLSYtjZ0"), img: "/libros/img/taofisica.png" },
  { id: "proteinas",           titulo: "Las proteínas",          link: gdocView("1S5y_tHN-nT8zcsBRTdpWOpB2oTCgov4frfo07zk_q6I"), img: "/libros/img/proteins.png" },
  { id: "filosofia",           titulo: "Filosofía",              link: gdocView("1H5gwQOj5KPy-ajfBSb-fdv3bBhPhLCwfrXRcNsOTJL0"), img: "/libros/img/filo.png"  },
  { id: "neurotransmisores",   titulo: "Neurotransmisores",      link: gdocView("1Co2c9l2-uJekeBDvjzO2dWTjUFcCJ53Nbm9yvhGDcB4"), img: "/libros/img/neurotransmisores.png" },
  { id: "medicina-integral",   titulo: "Medicina Integral",      link: gdocView("1-LYQQ9sU-4gO9BKDFPdFnwOYPjV6pGWKJyMMU9F0KYM"), img: "/libros/img/integrativo.png" },
  { id: "sistema-inmunitario", titulo: "El Sistema Inmunitario", link: gdocView("1UOpCrxQuTTcLG0lq7V6Aos6xfCT9tZgzCEQgH6a5fpk"), img: "/libros/img/inmune.png" },
  { id: "fitoterapia",         titulo: "Fitoterapia",            link: gdocView("1JBn6dVp4KIq-c3bs9s0g9PzfquN6XBwHjCsqaESZowg"), img: "/libros/img/fitoterapia.png" },
  { id: "ayurveda",            titulo: "Ayurveda",               link: gdocView("12T_p-IaR6Do51qG3FtdxDbjrFquwqsoiVcgGFIbUEiQ"), img: "/libros/img/ayurveda.png"  },
  { id: "anatomia-fisiologia", titulo: "Anatomía y fisiología",  link: gdocView("1y72scww-IyPVD4YM4et40EvqGgSXStVtfh3KRKfKdL4"), img: "/libros/img/fisioAnatomiaLibro.png"  },
  { id: "psicosomatica",       titulo: "Psicosomática",          link: gdocView("1YwWFiVsOdNNTwsw_qJ1KqYWRFjdDDY3vTakgjhKHx6M"), img: "/libros/img/psicosomatica.png" },
  {
    id: "chinese-medicine",
    titulo: "Chinese Medicine",
    link: gdocView("1fggEor2rorUyUEdLkHzF7qAUg8TWJlutOOSOMlDzLXg"),
    img: "/libros/img/tcm.png",
  },
  {
    id: "the-kabbalah",
    titulo: "The Kabbalah",
    link: gdocView("1fHl67LYbyQeyXCmkwC3RRWCaiojxHIZJCRKP1VgOOmU"),
    img: "/libros/img/cabala.png",
  },
];

export const libros: Libro[] = [
  {
    id: "life-as-a-privilege",
    titulo: "Life as a Privilege",
    link: gdocView("10m8G4a9x-a7r4ri3UsislWH-IvBH4hzj6IBK6g_JMNA"),
    img: "/libros/img/book.png",
  },

];
