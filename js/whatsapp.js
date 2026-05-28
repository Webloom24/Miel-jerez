/* =============================================
   MIEL JEREZ — Integración WhatsApp
   ============================================= */

var WA_NUMERO_1 = '573013223701';
var WA_NUMERO_2 = '573202325371';

// Formatea número colombiano: 27000 → "$27.000"
function formatearPrecio(numero) {
  return '$' + numero.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Genera el mensaje de WhatsApp con el detalle del pedido
function generarMensajeWhatsApp(carrito, tipoPrecio) {
  if (!carrito || carrito.length === 0) {
    return '🍯 *Pedido Miel Jerez*\n\nHola, me gustaría obtener información sobre sus productos. 🐝';
  }

  var lineas = carrito.map(function (item) {
    var subtotal = item.precio * item.cantidad;
    return '• ' + item.cantidad + 'x ' + item.nombre +
      ' — ' + formatearPrecio(item.precio) + ' c/u = *' + formatearPrecio(subtotal) + '*';
  });

  var total = carrito.reduce(function (acc, item) {
    return acc + (item.precio * item.cantidad);
  }, 0);

  var tipoTexto = (tipoPrecio === 'mayoreo') ? 'Mayoreo' : 'Detal';

  var mensaje =
    '🍯 *Pedido Miel Jerez*\n\n' +
    lineas.join('\n') +
    '\n\n💰 *Total: ' + formatearPrecio(total) + '*' +
    '\n📦 Precio: ' + tipoTexto +
    '\n\n¡Gracias por su pedido! 🐝';

  return mensaje;
}

// Abre WhatsApp con el mensaje codificado
function abrirWhatsApp(numero, mensaje) {
  var url = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje);
  window.open(url, '_blank', 'noopener');
}

// Envía el pedido actual al número indicado
function enviarPedidoWhatsApp(numero) {
  var carrito = (typeof obtenerCarrito === 'function') ? obtenerCarrito() : [];
  var tipoPrecio = (typeof obtenerTipoPrecio === 'function') ? obtenerTipoPrecio() : 'detal';

  if (carrito.length === 0) {
    if (typeof mostrarToast === 'function') {
      mostrarToast('Tu carrito está vacío. Agrega productos primero.', 'error');
    }
    return;
  }

  var mensaje = generarMensajeWhatsApp(carrito, tipoPrecio);
  abrirWhatsApp(numero, mensaje);
}

// Enviar formulario de contacto vía WhatsApp
function enviarFormularioWhatsApp(nombre, telefono, mensaje) {
  var texto =
    '👋 *Contacto desde Miel Jerez*\n\n' +
    '• Nombre: *' + nombre + '*\n' +
    '• Teléfono: *' + telefono + '*\n\n' +
    '💬 ' + mensaje + '\n\n' +
    '📍 Bucaramanga, Colombia';

  abrirWhatsApp(WA_NUMERO_1, texto);
}

// ── Inicializar botones de envío WhatsApp ──────

document.addEventListener('DOMContentLoaded', function () {
  // Botones de envío de pedido
  var btn1 = document.getElementById('btn-wa-1');
  var btn2 = document.getElementById('btn-wa-2');

  if (btn1) {
    btn1.addEventListener('click', function (e) {
      e.preventDefault();
      enviarPedidoWhatsApp(WA_NUMERO_1);
    });
  }

  if (btn2) {
    btn2.addEventListener('click', function (e) {
      e.preventDefault();
      enviarPedidoWhatsApp(WA_NUMERO_2);
    });
  }

  // Formulario de contacto
  var formContacto = document.getElementById('form-contacto');
  if (formContacto) {
    formContacto.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre   = document.getElementById('contacto-nombre').value.trim();
      var telefono = document.getElementById('contacto-telefono').value.trim();
      var mensaje  = document.getElementById('contacto-mensaje').value.trim();

      if (!nombre || !mensaje) {
        if (typeof mostrarToast === 'function') {
          mostrarToast('Por favor completa nombre y mensaje.', 'error');
        }
        return;
      }

      enviarFormularioWhatsApp(nombre, telefono || 'No indicado', mensaje);
    });
  }
});
