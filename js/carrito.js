/* =============================================
   MIEL JEREZ — Carrito de compras
   Persistencia via localStorage
   ============================================= */

var CARRITO_KEY = 'mieljerez_carrito';
var TIPO_PRECIO_KEY = 'mieljerez_tipoPrecio';

// ── Lectura / escritura ────────────────────────

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarBadge();
  document.dispatchEvent(new CustomEvent('carritoActualizado', { detail: { carrito: carrito } }));
}

function obtenerTipoPrecio() {
  return localStorage.getItem(TIPO_PRECIO_KEY) || 'detal';
}

function guardarTipoPrecio(tipo) {
  localStorage.setItem(TIPO_PRECIO_KEY, tipo);
}

// ── Operaciones del carrito ────────────────────

function agregarProducto(id, nombre, precio, tipoPrecio) {
  var carrito = obtenerCarrito();
  var idx = carrito.findIndex(function (item) { return item.id === id; });

  if (idx >= 0) {
    carrito[idx].cantidad += 1;
    carrito[idx].precio = precio;
    carrito[idx].tipoPrecio = tipoPrecio;
  } else {
    carrito.push({
      id: id,
      nombre: nombre,
      precio: precio,
      tipoPrecio: tipoPrecio,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  animarCarritoFlotante();
  mostrarToast(nombre + ' agregado al pedido 🍯', 'exito');
}

function eliminarProducto(id) {
  var carrito = obtenerCarrito().filter(function (item) { return item.id !== id; });
  guardarCarrito(carrito);
  if (typeof renderizarCarrito === 'function') renderizarCarrito();
}

function cambiarCantidad(id, cantidad) {
  cantidad = parseInt(cantidad, 10);
  if (isNaN(cantidad) || cantidad < 1) return;

  var carrito = obtenerCarrito();
  var idx = carrito.findIndex(function (item) { return item.id === id; });
  if (idx >= 0) {
    carrito[idx].cantidad = cantidad;
    guardarCarrito(carrito);
    if (typeof renderizarCarrito === 'function') renderizarCarrito();
  }
}

function vaciarCarrito() {
  guardarCarrito([]);
  if (typeof renderizarCarrito === 'function') renderizarCarrito();
}

function calcularTotal(carrito) {
  carrito = carrito || obtenerCarrito();
  return carrito.reduce(function (acc, item) {
    return acc + (item.precio * item.cantidad);
  }, 0);
}

// ── Badge del navbar ───────────────────────────

function actualizarBadge() {
  var carrito = obtenerCarrito();
  var total = carrito.reduce(function (acc, item) { return acc + item.cantidad; }, 0);

  var badges = document.querySelectorAll('.carrito-badge, .carrito-flotante-badge');
  badges.forEach(function (badge) {
    badge.textContent = total;
    if (total > 0) {
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
  });
}

// ── Animación carrito flotante ─────────────────

function animarCarritoFlotante() {
  var btn = document.querySelector('.carrito-flotante');
  if (!btn) return;
  btn.classList.remove('pulse');
  // Forzar reflow para reiniciar la animación
  void btn.offsetWidth;
  btn.classList.add('pulse');
  btn.addEventListener('animationend', function () {
    btn.classList.remove('pulse');
  }, { once: true });
}

// ── Renderizado del carrito (página carrito.html) ──

function renderizarCarrito() {
  var contenedor = document.getElementById('carrito-lista');
  var contenedorVacio = document.getElementById('carrito-vacio');
  var contenedorResumen = document.getElementById('carrito-resumen');
  if (!contenedor) return;

  var carrito = obtenerCarrito();
  var tipoPrecio = obtenerTipoPrecio();

  // Actualizar toggle visual si existe
  var toggleBtns = document.querySelectorAll('.toggle-precio-btn');
  toggleBtns.forEach(function (btn) {
    btn.classList.toggle('activo', btn.dataset.tipo === tipoPrecio);
  });

  if (carrito.length === 0) {
    contenedor.innerHTML = '';
    if (contenedorVacio) contenedorVacio.style.display = 'flex';
    if (contenedorResumen) contenedorResumen.style.display = 'none';
    return;
  }

  if (contenedorVacio) contenedorVacio.style.display = 'none';
  if (contenedorResumen) contenedorResumen.style.display = 'block';

  // Actualizar precios según tipo seleccionado
  var carritoActualizado = carrito.map(function (item) {
    var producto = (typeof PRODUCTOS !== 'undefined')
      ? PRODUCTOS.find(function (p) { return p.id === item.id; })
      : null;
    if (producto) {
      item.precio = tipoPrecio === 'mayoreo' ? producto.mayoreo : producto.detal;
      item.tipoPrecio = tipoPrecio;
    }
    return item;
  });

  guardarCarrito(carritoActualizado);

  contenedor.innerHTML = carritoActualizado.map(function (item) {
    // Buscar imagen real del producto
    var prod = (typeof PRODUCTOS !== 'undefined')
      ? PRODUCTOS.find(function (p) { return p.id === item.id; })
      : null;
    var imgContenido = prod
      ? '<img src="' + prod.imagen + '" alt="' + item.nombre + '" ' +
        'style="width:100%;height:100%;object-fit:cover;border-radius:calc(var(--radio-m) - 2px);" ' +
        'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" style="display:none;width:36px;height:36px;opacity:.4;color:var(--miel)"><ellipse cx="32" cy="38" rx="14" ry="18" fill="#F5C842" stroke="#C8861A" stroke-width="2"/><rect x="27" y="32" width="10" height="4" rx="2" fill="#9A6412"/><rect x="27" y="40" width="10" height="4" rx="2" fill="#9A6412"/><ellipse cx="32" cy="20" rx="8" ry="7" fill="#C8861A"/><circle cx="29" cy="19" r="1.5" fill="#2C1A0E"/><circle cx="35" cy="19" r="1.5" fill="#2C1A0E"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" style="width:36px;height:36px;opacity:.4;color:var(--miel)"><ellipse cx="32" cy="38" rx="14" ry="18" fill="#F5C842" stroke="#C8861A" stroke-width="2"/><rect x="27" y="32" width="10" height="4" rx="2" fill="#9A6412"/><rect x="27" y="40" width="10" height="4" rx="2" fill="#9A6412"/><ellipse cx="32" cy="20" rx="8" ry="7" fill="#C8861A"/><circle cx="29" cy="19" r="1.5" fill="#2C1A0E"/><circle cx="35" cy="19" r="1.5" fill="#2C1A0E"/></svg>';

    return '<div class="carrito-item" data-id="' + item.id + '">' +
      '<div class="carrito-item-img">' +
        imgContenido +
      '</div>' +
      '<div>' +
        '<div class="carrito-item-nombre">' + item.nombre + '</div>' +
        '<div class="carrito-item-tipo">' + (item.tipoPrecio === 'mayoreo' ? 'Precio mayoreo' : 'Precio detal') + '</div>' +
        '<div class="carrito-item-cantidad">' +
          '<button class="cantidad-btn" onclick="cambiarCantidad(' + item.id + ',' + (item.cantidad - 1) + ')">−</button>' +
          '<input class="cantidad-input" type="number" min="1" value="' + item.cantidad + '" onchange="cambiarCantidad(' + item.id + ',this.value)">' +
          '<button class="cantidad-btn" onclick="cambiarCantidad(' + item.id + ',' + (item.cantidad + 1) + ')">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="carrito-item-accion">' +
        '<div class="carrito-item-subtotal">' + formatearPrecio(item.precio * item.cantidad) + '</div>' +
        '<button class="btn-eliminar" onclick="eliminarProducto(' + item.id + ')" title="Eliminar">×</button>' +
      '</div>' +
    '</div>';
  }).join('');

  // Actualizar resumen
  var total = calcularTotal(carritoActualizado);
  var totalEl = document.getElementById('resumen-total');
  var itemsEl = document.getElementById('resumen-items');

  if (totalEl) totalEl.textContent = formatearPrecio(total);
  if (itemsEl) {
    var totalItems = carritoActualizado.reduce(function (a, i) { return a + i.cantidad; }, 0);
    itemsEl.textContent = totalItems + ' producto' + (totalItems !== 1 ? 's' : '');
  }
}

// ── Toast notifications ────────────────────────

function mostrarToast(mensaje, tipo) {
  var contenedor = document.querySelector('.toast-container');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.className = 'toast-container';
    document.body.appendChild(contenedor);
  }

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + (tipo || 'exito');
  toast.textContent = mensaje;
  contenedor.appendChild(toast);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });
  });

  setTimeout(function () {
    toast.classList.add('saliendo');
    toast.addEventListener('transitionend', function () {
      toast.remove();
    }, { once: true });
  }, 2800);
}

// ── Inicializar en DOMContentLoaded ───────────

document.addEventListener('DOMContentLoaded', function () {
  actualizarBadge();

  // Toggle mayoreo/detal en la página carrito
  document.querySelectorAll('.toggle-precio-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tipo = btn.dataset.tipo;
      guardarTipoPrecio(tipo);
      renderizarCarrito();
    });
  });

  // Renderizar carrito si estamos en carrito.html
  if (document.getElementById('carrito-lista')) {
    renderizarCarrito();
  }

  // Botón vaciar
  var btnVaciar = document.getElementById('btn-vaciar');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', function () {
      vaciarCarrito();
      mostrarToast('Carrito vaciado', 'exito');
    });
  }
});
