let productos = [
    { id: 1, nombre: "Teclado Mecánico RGB satis-factory", precio: 49990, imagen: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
    { id: 2, nombre: "Mouse Wireless Ultralight 4K", precio: 32990, imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80" },
    { id: 3, nombre: "Monitor Gaming 27' 165Hz QHD", precio: 189990, imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
    { id: 4, nombre: "Audífonos Hi-Fi Noise Cancelling", precio: 45990, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" }
];

let regionesComunas = [
    { region: "Región Metropolitana", comunas: ["Santiago", "Huechuraba", "Maipú", "Providencia", "Las Condes"] },
    { region: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Concón", "Quilpué"] }
];

let carrito = JSON.parse(localStorage.getItem('sf_carrito')) || [];
let usuariosRegistrados = JSON.parse(localStorage.getItem('sf_usuarios')) || [
    { run: "19011022K", nombre: "Admin satis-factory", correo: "admin@duoc.cl", pass: "1234", rol: "Administrador" }
];

// Usuario activo en sesión (null o un objeto usuario)
let usuarioAutenticado = JSON.parse(localStorage.getItem('sf_sesion_activa')) || null;
let productoSeleccionadoModal = null;
let cantidadModalTemp = 1;

const formatearCLP = (monto) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto);

// -------------------------------------------------------------
//ENRUTADOR Y CONTROL DE ROL ADMIN
// -------------------------------------------------------------
function cambiarVista(idVista) {
    // Protección de Ruta Admin
    if (idVista === 'vista-admin') {
        if (!usuarioAutenticado || usuarioAutenticado.rol !== 'Administrador') {
            alert("Acceso denegado: Esta área está reservada exclusivamente para administradores autenticados.");
            cambiarVista('vista-login');
            return;
        }
    }

    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => v.classList.remove('activa'));

    const vistaDestino = document.getElementById(idVista);
    if (vistaDestino) {
        vistaDestino.classList.add('activa');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (idVista === 'vista-carrito') renderizarCarritoDetallado();
    if (idVista === 'vista-admin') {
        renderizarTablaProductosAdmin();
        renderizarTablaUsuariosAdmin();
    }
}

function actualizarEstadoSesionUI() {
    const navAdmin = document.getElementById("nav-item-admin");
    const bloqueInvitado = document.getElementById("bloque-invitado");
    const bloqueSesion = document.getElementById("bloque-sesion");
    const labelUsuario = document.getElementById("label-usuario-actual");

    if (usuarioAutenticado) {
        bloqueInvitado.style.display = "none";
        bloqueSesion.style.display = "flex";
        labelUsuario.textContent = `👤 ${usuarioAutenticado.nombre.split(' ')[0]} (${usuarioAutenticado.rol})`;

        // Solo si el rol es Administrador mostramos la vista Admin en la barra superior
        if (usuarioAutenticado.rol === 'Administrador') {
            navAdmin.style.display = "inline-block";
        } else {
            navAdmin.style.display = "none";
        }
    } else {
        bloqueInvitado.style.display = "flex";
        bloqueSesion.style.display = "none";
        navAdmin.style.display = "none";
    }
}

function cerrarSesion() {
    usuarioAutenticado = null;
    localStorage.removeItem('sf_sesion_activa');
    actualizarEstadoSesionUI();
    alert("Sesión cerrada correctamente.");
    cambiarVista('vista-home');
}

function irAProductos() {
    cambiarVista('vista-home');
    setTimeout(() => {
        document.getElementById('seccion-catalogo-scroll')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
}

// -------------------------------------------------------------
//CATALOGO E INTERACCIÓN CON MODAL DE PRODUCTO
// -------------------------------------------------------------
function renderizarProductos() {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    productos.forEach(p => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-producto";
        // Al hacer clic sobre la tarjeta abrimos el Modal de Detalle
        tarjeta.onclick = () => abrirModalProducto(p.id);

        tarjeta.innerHTML = `
            <span class="badge-hover-click">🔍 Inspeccionar</span>
            <img src="${p.imagen}" alt="${p.nombre}">
            <div>
                <h4 class="nombre-producto">${p.nombre}</h4>
                <p class="precio-producto">${formatearCLP(p.precio)}</p>
            </div>
            <button class="boton-primario ancho-completo" onclick="event.stopPropagation(); agregarAlCarritoDirecto(${p.id})">Añadir al Carrito +</button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// Abrir Modal Interactivo
function abrirModalProducto(idProducto) {
    const prod = productos.find(p => p.id === idProducto);
    if (!prod) return;

    productoSeleccionadoModal = prod;
    cantidadModalTemp = 1;

    document.getElementById("modal-img").src = prod.imagen;
    document.getElementById("modal-titulo").textContent = prod.nombre;
    document.getElementById("modal-precio").textContent = formatearCLP(prod.precio);
    document.getElementById("cant-modal").textContent = cantidadModalTemp;

    const btnAgregar = document.getElementById("btn-modal-agregar");
    btnAgregar.onclick = () => {
        agregarAlCarrito(prod.id, cantidadModalTemp);
        cerrarModalProductoDirecto();
    };

    document.getElementById("modal-producto").classList.add("activo");
}

function cambiarCantModal(delta) {
    cantidadModalTemp += delta;
    if (cantidadModalTemp < 1) cantidadModalTemp = 1;
    document.getElementById("cant-modal").textContent = cantidadModalTemp;
}

function cerrarModalProducto(e) {
    if (e.target.id === "modal-producto") {
        cerrarModalProductoDirecto();
    }
}

function cerrarModalProductoDirecto() {
    document.getElementById("modal-producto").classList.remove("activo");
}

// -------------------------------------------------------------
//CARRITO DE COMPRAS
// -------------------------------------------------------------
function agregarAlCarritoDirecto(id) {
    agregarAlCarrito(id, 1);
}

function agregarAlCarrito(id, cantidad = 1) {
    const prod = productos.find(p => p.id === id);
    const item = carrito.find(i => i.id === id);

    if (item) {
        item.cantidad += cantidad;
    } else {
        carrito.push({ ...prod, cantidad: cantidad });
    }

    guardarYActualizarCarrito();
}

function actualizarContadorCarrito() {
    const badge = document.getElementById("contador-carrito");
    if (badge) {
        badge.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    }
}

function renderizarCarritoDetallado() {
    const tbody = document.getElementById("cuerpo-tabla-carrito");
    const vacio = document.getElementById("contenedor-carrito-vacio");
    const detalle = document.getElementById("contenedor-detalle-carrito");
    const totalEl = document.getElementById("monto-total-carrito");

    if (carrito.length === 0) {
        vacio.style.display = "block";
        detalle.style.display = "none";
        return;
    }

    vacio.style.display = "none";
    detalle.style.display = "block";
    tbody.innerHTML = "";

    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.nombre}</strong></td>
            <td>${formatearCLP(item.precio)}</td>
            <td>
                <button class="btn-secundario" style="padding: 2px 8px;" onclick="modificarCantidad(${item.id}, -1)">-</button>
                <span style="margin: 0 8px;">${item.cantidad}</span>
                <button class="btn-secundario" style="padding: 2px 8px;" onclick="modificarCantidad(${item.id}, 1)">+</button>
            </td>
            <td>${formatearCLP(subtotal)}</td>
            <td><button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">✕</button></td>
        `;
        tbody.appendChild(tr);
    });

    totalEl.textContent = formatearCLP(total);
}

function modificarCantidad(id, cambio) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
    } else {
        guardarYActualizarCarrito();
        renderizarCarritoDetallado();
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(i => i.id !== id);
    guardarYActualizarCarrito();
    renderizarCarritoDetallado();
}

function vaciarCarrito() {
    carrito = [];
    guardarYActualizarCarrito();
    renderizarCarritoDetallado();
}

function finalizarCompra() {
    alert("¡Orden procesada con éxito! Gracias por comprar en satis-factory.");
    vaciarCarrito();
    cambiarVista('vista-home');
}

function guardarYActualizarCarrito() {
    localStorage.setItem('sf_carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// -------------------------------------------------------------
//VALIDACIONES DINÁMICAS EN TIEMPO REAL CON SPAN
// -------------------------------------------------------------
function actualizarSpan(idInput, idSpan, esValido, mensajeError, textoSugerenciaBase) {
    const input = document.getElementById(idInput);
    const span = document.getElementById(idSpan);
    if (!input || !span) return;

    if (input.value.trim() === "") {
        span.textContent = textoSugerenciaBase;
        span.className = "sugerencia-span";
        input.classList.remove("input-error", "input-exito");
        return;
    }

    if (esValido) {
        span.textContent = "✓ Formato correcto.";
        span.className = "sugerencia-span exito";
        input.classList.remove("input-error");
        input.classList.add("input-exito");
    } else {
        span.textContent = "✕ " + mensajeError;
        span.className = "sugerencia-span error";
        input.classList.remove("input-exito");
        input.classList.add("input-error");
    }
}

// Asignar listeners dinámicos al formulario de registro
function configurarValidacionesRegistro() {
    const runInput = document.getElementById("reg-run");
    runInput?.addEventListener("input", function() {
        const regexRun = /^[0-9]{7,8}[0-9kK]{1}$/;
        actualizarSpan("reg-run", "sug-reg-run", regexRun.test(this.value.trim()), "RUN inválido. Ingrese 7 u 8 números y letra/dígito K sin puntos ni guión.", "Sugerencia: Sin puntos ni guión (Ej: 19011022K).");
    });

    const correoInput = document.getElementById("reg-correo");
    correoInput?.addEventListener("input", function() {
        const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
        const esVal = dominios.some(d => this.value.trim().endsWith(d));
        actualizarSpan("reg-correo", "sug-reg-correo", esVal, "Debe finalizar en @duoc.cl, @profesor.duoc.cl o @gmail.com", "Sugerencia: Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com");
    });

    const passInput = document.getElementById("reg-password");
    passInput?.addEventListener("input", function() {
        const esVal = this.value.length >= 4 && this.value.length <= 10;
        actualizarSpan("reg-password", "sug-reg-password", esVal, "La clave debe tener entre 4 y 10 caracteres.", "Sugerencia: De 4 a 10 caracteres.");
    });

    const confirmInput = document.getElementById("reg-confirm-password");
    confirmInput?.addEventListener("input", function() {
        const pass = document.getElementById("reg-password").value;
        const esVal = this.value === pass && this.value.length >= 4;
        actualizarSpan("reg-confirm-password", "sug-reg-confirm-password", esVal, "Las contraseñas no coinciden.", "Sugerencia: Debe coincidir exactamente con la clave anterior.");
    });
}

function cargarRegiones() {
    const selRegion = document.getElementById("reg-region");
    if (!selRegion) return;
    regionesComunas.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.region;
        opt.textContent = r.region;
        selRegion.appendChild(opt);
    });
}

document.getElementById("reg-region")?.addEventListener("change", function() {
    const selComuna = document.getElementById("reg-comuna");
    selComuna.innerHTML = `<option value="">-- Seleccionar --</option>`;
    const rObj = regionesComunas.find(r => r.region === this.value);
    
    if (rObj) {
        selComuna.disabled = false;
        rObj.comunas.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = c;
            selComuna.appendChild(opt);
        });
    } else {
        selComuna.disabled = true;
    }
});

// Submit Registro
document.getElementById("formulario-registro")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const run = document.getElementById("reg-run").value.trim();
    const nombre = document.getElementById("reg-nombre").value.trim();
    const correo = document.getElementById("reg-correo").value.trim();
    const pass = document.getElementById("reg-password").value;
    const confirmPass = document.getElementById("reg-confirm-password").value;

    if (!/^[0-9]{7,8}[0-9kK]{1}$/.test(run) || pass.length < 4 || pass !== confirmPass) {
        alert("Por favor revise las sugerencias en rojo y corrija los campos antes de enviar.");
        return;
    }

    usuariosRegistrados.push({ run, nombre, correo, pass, rol: "Cliente" });
    localStorage.setItem('sf_usuarios', JSON.stringify(usuariosRegistrados));
    alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
    this.reset();
    cambiarVista('vista-login');
});

// Submit Login con Verificación de Rol
document.getElementById("formulario-login")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const correo = document.getElementById("login-correo").value.trim();
    const pass = document.getElementById("login-password").value;

    const usuarioEncontrado = usuariosRegistrados.find(u => u.correo.toLowerCase() === correo.toLowerCase() && u.pass === pass);

    if (usuarioEncontrado) {
        usuarioAutenticado = usuarioEncontrado;
        localStorage.setItem('sf_sesion_activa', JSON.stringify(usuarioAutenticado));
        actualizarEstadoSesionUI();

        alert(`Bienvenido de vuelta, ${usuarioEncontrado.nombre}. (Rol: ${usuarioEncontrado.rol})`);
        
        if (usuarioEncontrado.rol === 'Administrador') {
            cambiarVista('vista-admin');
        } else {
            cambiarVista('vista-home');
        }
        this.reset();
    } else {
        alert("Credenciales incorrectas. Verifique su correo y clave.");
    }
});

// -------------------------------------------------------------
//MANTENEDOR ADMIN
// -------------------------------------------------------------
function renderizarTablaProductosAdmin() {
    const tbody = document.getElementById("cuerpo-tabla-productos");
    if (!tbody) return;
    tbody.innerHTML = "";
    productos.forEach((p, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>PROD-00${p.id}</td>
            <td>${p.nombre}</td>
            <td>Periféricos</td>
            <td>${formatearCLP(p.precio)}</td>
            <td><button class="btn-eliminar" onclick="eliminarProductoAdmin(${idx})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarTablaUsuariosAdmin() {
    const tbody = document.getElementById("cuerpo-tabla-usuarios");
    if (!tbody) return;
    tbody.innerHTML = "";
    usuariosRegistrados.forEach((u, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.run}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td><strong style="color: ${u.rol === 'Administrador' ? 'var(--accent-orange)' : 'var(--accent-cyan)'}">${u.rol}</strong></td>
            <td><button class="btn-eliminar" onclick="eliminarUsuarioAdmin(${idx})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarProductoAdmin(idx) {
    if (confirm("¿Eliminar este producto del inventario?")) {
        productos.splice(idx, 1);
        renderizarTablaProductosAdmin();
        renderizarProductos();
    }
}

function eliminarUsuarioAdmin(idx) {
    if (confirm("¿Eliminar usuario registrado?")) {
        usuariosRegistrados.splice(idx, 1);
        localStorage.setItem('sf_usuarios', JSON.stringify(usuariosRegistrados));
        renderizarTablaUsuariosAdmin();
    }
}

document.getElementById("formulario-producto")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const codigo = document.getElementById("prod-codigo").value.trim();
    const nombre = document.getElementById("prod-nombre").value.trim();
    const precio = parseInt(document.getElementById("prod-precio").value);
    const imagen = document.getElementById("prod-imagen").value.trim();

    if (!codigo || !nombre || isNaN(precio) || precio <= 0 || !imagen) {
        alert("Complete los campos del producto con datos válidos.");
        return;
    }

    productos.push({ id: productos.length + 1, nombre, precio, imagen });
    renderizarProductos();
    renderizarTablaProductosAdmin();
    this.reset();
    alert("Producto registrado correctamente.");
});

// -------------------------------------------------------------
//INICIALIZACIÓN
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    actualizarContadorCarrito();
    cargarRegiones();
    configurarValidacionesRegistro();
    actualizarEstadoSesionUI();
});