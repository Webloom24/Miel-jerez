/* =============================================
   MIEL JEREZ — Filtros y renderizado del catálogo
   ============================================= */

var categoriaActiva = 'todos';
var busquedaActual = '';

// Genera el HTML de una card de producto
function htmlCard(producto, tipoPrecio) {
  var imgHtml =
    '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" loading="lazy" ' +
    'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
    '<div class="producto-placeholder" style="display:none">' +
      SVG_ABEJA_PLACEHOLDER +
      '<span>' + producto.nombre.split(' ')[0] + '</span>' +
    '</div>';

  // Producto AGOTADO con precio a cotización
  if (producto.agotado) {
    return '<article class="producto-card producto-card--agotado">' +
      '<div class="producto-card-img">' +
        '<span class="producto-badge producto-badge--agotado">Agotado</span>' +
        imgHtml +
        '<div class="producto-card-overlay" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="producto-card-info">' +
        '<h3 class="producto-nombre">' + producto.nombre + '</h3>' +
        '<p class="producto-descripcion">' + producto.descripcion + '</p>' +
        '<div class="producto-precios">' +
          '<span class="precio-cotizacion">Precio a cotización</span>' +
        '</div>' +
        '<button class="producto-card-btn producto-card-btn--disabled" disabled>' +
          'No disponible por ahora' +
        '</button>' +
      '</div>' +
    '</article>';
  }

  // Producto con VARIANTES de gramaje
  if (producto.tipo === 'variantes' && producto.variantes) {
    var variantesHtml = producto.variantes.map(function (v, idx) {
      var precio = tipoPrecio === 'mayoreo' ? v.mayoreo : v.detal;
      return '<button class="gramaje-chip' + (idx === 0 ? ' activo' : '') + '" ' +
        'data-gramaje="' + v.gramaje + '" ' +
        'data-mayoreo="' + v.mayoreo + '" ' +
        'data-detal="' + v.detal + '" ' +
        'data-nombre="' + v.nombre + '" ' +
        'onclick="seleccionarGramaje(this,\'' + tipoPrecio + '\')">' +
        v.gramaje +
      '</button>';
    }).join('');

    var varianteActiva = producto.variantes[0];
    var precioActivo = tipoPrecio === 'mayoreo' ? varianteActiva.mayoreo : varianteActiva.detal;
    var precioOtroActivo = tipoPrecio === 'mayoreo' ? varianteActiva.detal : varianteActiva.mayoreo;
    var etiquetaOtro = tipoPrecio === 'mayoreo' ? 'Detal' : 'Mayoreo';

    return '<article class="producto-card" data-id="' + producto.id + '">' +
      '<div class="producto-card-img">' +
        imgHtml +
      '</div>' +
      '<div class="producto-card-info">' +
        '<h3 class="producto-nombre">' + producto.nombre + '</h3>' +
        '<p class="producto-descripcion">' + producto.descripcion + '</p>' +
        '<div class="gramaje-selector" role="group" aria-label="Seleccionar gramaje">' +
          variantesHtml +
        '</div>' +
        '<div class="producto-precios">' +
          '<span class="precio precio-variante">' + formatearPrecio(precioActivo) + '</span>' +
          '<span class="precio-tachado precio-tachado-variante">' + etiquetaOtro + ': ' + formatearPrecio(precioOtroActivo) + '</span>' +
        '</div>' +
        '<button class="producto-card-btn" ' +
          'onclick="agregarVarianteDesdeCard(this,' + producto.id + ')">' +
          'Agregar al pedido' +
        '</button>' +
      '</div>' +
    '</article>';
  }

  // Producto estándar
  var precio = tipoPrecio === 'mayoreo' ? producto.mayoreo : producto.detal;
  var precioOtro = tipoPrecio === 'mayoreo' ? producto.detal : producto.mayoreo;
  var etiquetaOtro = tipoPrecio === 'mayoreo' ? 'Detal' : 'Mayoreo';

  var badgeHtml = producto.badge
    ? '<span class="producto-badge">' + producto.badge + '</span>'
    : '';

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

// Actualiza precio visible cuando se selecciona un gramaje
function seleccionarGramaje(chip, tipoPrecio) {
  var card = chip.closest('.producto-card');
  if (!card) return;

  card.querySelectorAll('.gramaje-chip').forEach(function (c) {
    c.classList.remove('activo');
  });
  chip.classList.add('activo');

  var precio = tipoPrecio === 'mayoreo'
    ? parseInt(chip.dataset.mayoreo, 10)
    : parseInt(chip.dataset.detal, 10);
  var precioOtro = tipoPrecio === 'mayoreo'
    ? parseInt(chip.dataset.detal, 10)
    : parseInt(chip.dataset.mayoreo, 10);
  var etiquetaOtro = tipoPrecio === 'mayoreo' ? 'Detal' : 'Mayoreo';

  var precioEl = card.querySelector('.precio-variante');
  var precioOtroEl = card.querySelector('.precio-tachado-variante');
  if (precioEl) precioEl.textContent = formatearPrecio(precio);
  if (precioOtroEl) precioOtroEl.textContent = etiquetaOtro + ': ' + formatearPrecio(precioOtro);
}

// Agrega la variante activa de un producto multi-gramaje al carrito
function agregarVarianteDesdeCard(btn, productoId) {
  var card = btn.closest('.producto-card');
  if (!card) return;

  var chipActivo = card.querySelector('.gramaje-chip.activo');
  if (!chipActivo) return;

  var tipoPrecio = obtenerTipoPrecio();
  var precio = tipoPrecio === 'mayoreo'
    ? parseInt(chipActivo.dataset.mayoreo, 10)
    : parseInt(chipActivo.dataset.detal, 10);
  var nombre = chipActivo.dataset.nombre;

  agregarProducto(productoId + '-' + chipActivo.dataset.gramaje, nombre, precio, tipoPrecio);

  btn.disabled = true;
  btn.classList.add('agregado');
  btn.textContent = '✓ Agregado';
  setTimeout(function () {
    btn.classList.remove('agregado');
    btn.textContent = 'Agregar al pedido';
    btn.disabled = false;
  }, 1400);
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
