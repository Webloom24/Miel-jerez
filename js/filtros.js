/* =============================================
   MIEL JEREZ — Filtros y renderizado del catálogo
   ============================================= */

var categoriaActiva = 'todos';
var busquedaActual = '';

// Genera el HTML de una card de producto
function htmlCard(producto, tipoPrecio) {
  var precio = tipoPrecio === 'mayoreo' ? producto.mayoreo : producto.detal;
  var precioOtro = tipoPrecio === 'mayoreo' ? producto.detal : producto.mayoreo;
  var etiquetaOtro = tipoPrecio === 'mayoreo' ? 'Detal' : 'Mayoreo';

  var badgeHtml = producto.badge
    ? '<span class="producto-badge">' + producto.badge + '</span>'
    : '';

  var imgHtml =
    '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" loading="lazy" ' +
    'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
    '<div class="producto-placeholder" style="display:none">' +
      SVG_ABEJA_PLACEHOLDER +
      '<span>' + producto.nombre.split(' ')[0] + '</span>' +
    '</div>';

  return '<article class="producto-card">' +
    '<div class="producto-card-img">' +
      badgeHtml +
      imgHtml +
    '</div>' +
    '<div class="producto-card-info">' +
      '<h3 class="producto-nombre">' + producto.nombre + '</h3>' +
      '<p class="producto-descripcion">' + producto.descripcion + '</p>' +
      '<div class="producto-precios">' +
        '<span class="precio">' + formatearPrecio(precio) + '</span>' +
        '<span class="precio-tachado">' + etiquetaOtro + ': ' + formatearPrecio(precioOtro) + '</span>' +
      '</div>' +
      '<button class="producto-card-btn" onclick="agregarDesdeCard(' + producto.id + ',this)">' +
        'Agregar al pedido' +
      '</button>' +
    '</div>' +
  '</article>';
}

// Renderiza la lista de productos en el DOM con fade y actualiza el contador
function renderizarProductos(lista, tipoPrecio) {
  var grid = document.getElementById('productos-grid');
  if (!grid) return;

  tipoPrecio = tipoPrecio || obtenerTipoPrecio();

  grid.style.opacity = '0';
  grid.style.transition = 'opacity 0.2s ease';

  setTimeout(function () {
    if (lista.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--cafe)">' +
        '<p>No se encontraron productos.</p></div>';
    } else {
      grid.innerHTML = lista.map(function (p) { return htmlCard(p, tipoPrecio); }).join('');
    }
    grid.style.opacity = '1';
    actualizarContador(lista.length);
  }, 200);
}

// Actualiza el contador de productos mostrado
function actualizarContador(cantidad) {
  var el = document.getElementById('productos-count');
  if (!el) return;
  el.textContent = cantidad + ' producto' + (cantidad !== 1 ? 's' : '');
}

// Agrega producto con feedback visual en el botón de la card
function agregarDesdeCard(id, btn) {
  var tipoPrecio = obtenerTipoPrecio();
  var producto = PRODUCTOS.find(function (p) { return p.id === id; });
  if (!producto) return;

  var precio = tipoPrecio === 'mayoreo' ? producto.mayoreo : producto.detal;
  agregarProducto(id, producto.nombre, precio, tipoPrecio);

  if (btn) {
    btn.disabled = true;
    btn.classList.add('agregado');
    btn.textContent = '✓ Agregado';
    setTimeout(function () {
      btn.classList.remove('agregado');
      btn.textContent = 'Agregar al pedido';
      btn.disabled = false;
    }, 1400);
  }
}

// Retorna la lista filtrada según categoría y búsqueda actuales
function obtenerListaFiltrada() {
  var lista = categoriaActiva === 'todos'
    ? PRODUCTOS
    : PRODUCTOS.filter(function (p) { return p.categoria === categoriaActiva; });

  if (busquedaActual) {
    var q = busquedaActual.toLowerCase();
    lista = lista.filter(function (p) {
      return p.nombre.toLowerCase().indexOf(q) >= 0 ||
             p.descripcion.toLowerCase().indexOf(q) >= 0;
    });
  }

  return lista;
}

// Aplica filtro por categoría
function filtrarPorCategoria(categoria) {
  categoriaActiva = categoria;
  document.querySelectorAll('.filtro-btn').forEach(function (btn) {
    btn.classList.toggle('activo', btn.dataset.categoria === categoria);
  });
  renderizarProductos(obtenerListaFiltrada(), obtenerTipoPrecio());
}

// ── Inicializar filtros ────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('productos-grid');
  if (!grid) return;

  // Render inicial con preferencia guardada
  var tipoGuardado = obtenerTipoPrecio();
  renderizarProductos(PRODUCTOS, tipoGuardado);

  // Marcar toggle activo según localStorage
  document.querySelectorAll('.toggle-precio-btn').forEach(function (btn) {
    btn.classList.toggle('activo', btn.dataset.tipo === tipoGuardado);
  });

  // Botones de categoría
  document.querySelectorAll('.filtro-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      filtrarPorCategoria(btn.dataset.categoria);
    });
  });

  // Toggle mayoreo/detal
  document.querySelectorAll('.toggle-precio-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tipo = btn.dataset.tipo;
      guardarTipoPrecio(tipo);
      document.querySelectorAll('.toggle-precio-btn').forEach(function (b) {
        b.classList.toggle('activo', b.dataset.tipo === tipo);
      });
      renderizarProductos(obtenerListaFiltrada(), tipo);
    });
  });

  // Búsqueda en tiempo real
  var inputBusqueda = document.getElementById('busqueda-input');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function () {
      busquedaActual = this.value.trim();
      renderizarProductos(obtenerListaFiltrada(), obtenerTipoPrecio());
    });
  }
});
