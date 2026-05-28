/* =============================================
   MIEL JEREZ — Navegación
   ============================================= */

(function () {
  'use strict';

  // Marcar página activa en el navbar
  function marcarPaginaActiva() {
    const pagina = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.navbar-links a');
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (
        href === pagina ||
        (pagina === '' && href === 'index.html') ||
        (pagina === 'index.html' && href === 'index.html')
      ) {
        link.classList.add('activo');
      } else {
        link.classList.remove('activo');
      }
    });
  }

  // Toggle menú hamburguesa
  function iniciarHamburguesa() {
    const hamburguesa = document.querySelector('.navbar-hamburguesa');
    const links = document.querySelector('.navbar-links');
    if (!hamburguesa || !links) return;

    hamburguesa.addEventListener('click', function () {
      const abierto = links.classList.toggle('abierto');
      hamburguesa.classList.toggle('abierto', abierto);
      hamburguesa.setAttribute('aria-expanded', abierto);
    });

    // Cerrar al hacer click en un link
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('abierto');
        hamburguesa.classList.remove('abierto');
        hamburguesa.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar')) {
        links.classList.remove('abierto');
        hamburguesa.classList.remove('abierto');
        hamburguesa.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Actualizar badge del carrito desde localStorage
  function actualizarBadgeNavbar() {
    const carrito = JSON.parse(localStorage.getItem('mieljerez_carrito') || '[]');
    const total = carrito.reduce(function (acc, item) {
      return acc + (item.cantidad || 0);
    }, 0);

    const badges = document.querySelectorAll('.carrito-badge');
    badges.forEach(function (badge) {
      badge.textContent = total;
      if (total > 0) {
        badge.classList.add('visible');
      } else {
        badge.classList.remove('visible');
      }
    });
  }

  // Escuchar cambios en el carrito (entre funciones JS de la misma página)
  document.addEventListener('carritoActualizado', actualizarBadgeNavbar);

  // Escuchar cambios en localStorage (entre páginas)
  window.addEventListener('storage', function (e) {
    if (e.key === 'mieljerez_carrito') {
      actualizarBadgeNavbar();
    }
  });

  // Inicializar al cargar el DOM
  document.addEventListener('DOMContentLoaded', function () {
    marcarPaginaActiva();
    iniciarHamburguesa();
    actualizarBadgeNavbar();
  });
})();
