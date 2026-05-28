/* =============================================
   MIEL JEREZ — Datos de productos
   Variable global accesible desde cualquier página
   ============================================= */

var PRODUCTOS = [
  {
    id: 1,
    nombre: "Miel Pura 450g",
    categoria: "mieles",
    mayoreo: 27000,
    detal: 30000,
    imagen: "img/productos/miel-450.webp",
    descripcion: "Miel multifloral 100% pura, cosechada artesanalmente. Tarro de vidrio 450g.",
    badge: "Más vendido"
  },
  {
    id: 2,
    nombre: "Miel Pura 250g",
    categoria: "mieles",
    mayoreo: 18000,
    detal: 20000,
    imagen: "img/productos/miel-250.webp",
    descripcion: "Miel multifloral 100% pura. Presentación ideal para el hogar.",
    badge: null
  },
  {
    id: 3,
    nombre: "Miel Pura 150g",
    categoria: "mieles",
    mayoreo: 13500,
    detal: 15000,
    imagen: "img/productos/miel-150.webp",
    descripcion: "Miel multifloral 100% pura. Perfecta para regalo o llevar.",
    badge: null
  },
  {
    id: 4,
    nombre: "Polen 170g",
    categoria: "polen",
    mayoreo: 22500,
    detal: 25000,
    imagen: "img/productos/polen-170.webp",
    descripcion: "Polen de abejas 100% natural, recolectado fresco. Frasco de vidrio 170g.",
    badge: null
  },
  {
    id: 5,
    nombre: "Polen 80g",
    categoria: "polen",
    mayoreo: 12600,
    detal: 14000,
    imagen: "img/productos/polen-80.webp",
    descripcion: "Polen de abejas natural. Presentación pequeña, ideal para comenzar.",
    badge: null
  },
  {
    id: 6,
    nombre: "Granola 250g",
    categoria: "granola",
    mayoreo: 13000,
    detal: 15000,
    imagen: "img/productos/granola-250.webp",
    descripcion: "Granola artesanal con avena, frutos secos y miel de abejas Jerez.",
    badge: null
  },
  {
    id: 7,
    nombre: "Palitos Mieleros",
    categoria: "accesorios",
    mayoreo: 4000,
    detal: 5000,
    imagen: "img/productos/palitos.webp",
    descripcion: "Palitos de madera para servir miel. Paquete artesanal.",
    badge: null
  },
  {
    id: 8,
    nombre: "Bálsamo Hidratante 40g",
    categoria: "balsamos",
    mayoreo: 63000,
    detal: 70000,
    imagen: "img/productos/balsamo-40.webp",
    descripcion: "Bálsamo hidratante de cera de abejas. Producto natural 40g.",
    badge: "Premium"
  },
  {
    id: 9,
    nombre: "Bálsamo Hidratante 15g",
    categoria: "balsamos",
    mayoreo: 22500,
    detal: 25000,
    imagen: "img/productos/balsamo-15.webp",
    descripcion: "Bálsamo hidratante de cera de abejas. Presentación bolsillo 15g.",
    badge: null
  },
  {
    id: 10,
    nombre: "Bálsamo Labial",
    categoria: "balsamos",
    mayoreo: 13500,
    detal: 15000,
    imagen: "img/productos/balsamo-labial.webp",
    descripcion: "Bálsamo labial de cera de abeja 100% natural.",
    badge: null
  }
];

// SVG de abeja inline para placeholders de imagen
var SVG_ABEJA_PLACEHOLDER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="38" rx="14" ry="18" fill="#F5C842" stroke="#C8861A" stroke-width="2"/><ellipse cx="20" cy="38" rx="6" ry="8" fill="#9A6412" opacity=".18"/><ellipse cx="44" cy="38" rx="6" ry="8" fill="#9A6412" opacity=".18"/><rect x="27" y="32" width="10" height="4" rx="2" fill="#9A6412"/><rect x="27" y="40" width="10" height="4" rx="2" fill="#9A6412"/><ellipse cx="32" cy="20" rx="8" ry="7" fill="#C8861A"/><circle cx="29" cy="19" r="1.5" fill="#2C1A0E"/><circle cx="35" cy="19" r="1.5" fill="#2C1A0E"/><path d="M27 13 Q24 8 20 10" stroke="#6B3A1F" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M37 13 Q40 8 44 10" stroke="#6B3A1F" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>';
