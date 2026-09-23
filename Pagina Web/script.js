const productos = [
    { 
        id: 1, 
        nombre: "Teclado Mecánico RGB", 
        precio: 45990, 
        imagen: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&q=80" 
    },
    { 
        id: 2, 
        nombre: "Mouse Gamer Inalámbrico", 
        precio: 25000, 
        imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80"
    },
    { 
        id: 3, 
        nombre: "Monitor 24 pulgadas", 
        precio: 129990, 
        imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80" 
    },
    { 
        id: 4, 
        nombre: "Audífonos con Cancelación", 
        precio: 34990, 
        imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" 
    }
];

const formatearCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
};

function renderizarProductos() {
    const contenedor = document.getElementById("contenedor-productos");
    let htmlProductos = "";

    productos.forEach(producto => {
        htmlProductos += `
            <article class="tarjeta-producto">
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;">
                <h4 class="nombre-producto">${producto.nombre}</h4>
                <p class="precio-producto">${formatearCLP(producto.precio)}</p>
                <button class="boton-primario" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
            </article>
        `;
    });

    contenedor.innerHTML = htmlProductos;
}
let carrito = JSON.parse(localStorage.getItem('carritoCompras')) || [];

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    contador.textContent = totalItems;
}

function agregarAlCarrito(idProducto) {
    const productoExistente = carrito.find(item => item.id === idProducto);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        const producto = productos.find(p => p.id === idProducto);
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carritoCompras', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert("Producto añadido al carrito exitosamente.");
}

const formularioContacto = document.getElementById("formulario-contacto");

formularioContacto.addEventListener("submit", function(evento) {
    evento.preventDefault(); 
    
    let formularioValido = true;

    const inputNombre = document.getElementById("nombre");
    const inputCorreo = document.getElementById("correo");
    const inputComentario = document.getElementById("comentario");
    
    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorComentario = document.getElementById("error-comentario");

    errorNombre.style.display = "none";
    errorCorreo.style.display = "none";
    errorComentario.style.display = "none";

    if (inputNombre.value.trim() === "") {
        errorNombre.textContent = "El nombre es obligatorio.";
        errorNombre.style.display = "block";
        formularioValido = false;
    } else if (inputNombre.value.length > 100) {
        errorNombre.textContent = "El nombre no puede exceder los 100 caracteres.";
        errorNombre.style.display = "block";
        formularioValido = false;
    }

    const correoValor = inputCorreo.value.trim();
    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    const dominioValido = dominiosPermitidos.some(dominio => correoValor.endsWith(dominio));

    if (correoValor === "") {
        errorCorreo.textContent = "El correo electrónico es obligatorio.";
        errorCorreo.style.display = "block";
        formularioValido = false;
    } else if (correoValor.length > 100) {
        errorCorreo.textContent = "El correo no puede exceder los 100 caracteres.";
        errorCorreo.style.display = "block";
        formularioValido = false;
    } else if (!dominioValido) {
        errorCorreo.textContent = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.";
        errorCorreo.style.display = "block";
        formularioValido = false;
    }

    if (inputComentario.value.trim() === "") {
        errorComentario.textContent = "El comentario es obligatorio.";
        errorComentario.style.display = "block";
        formularioValido = false;
    } else if (inputComentario.value.length > 500) {
        errorComentario.textContent = "El comentario no puede exceder los 500 caracteres.";
        errorComentario.style.display = "block";
        formularioValido = false;
    }

    if (formularioValido) {
        alert("Formulario enviado correctamente.");
        formularioContacto.reset();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    actualizarContadorCarrito();
});

// -------------------------------------------------------------
// 4. DATOS DE REGIONES Y COMUNAS (ARREGLO JS)
// -------------------------------------------------------------
const regionesYComunas = [
    {
        region: "Región Metropolitana de Santiago",
        comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"]
    },
    {
        region: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Concón"]
    },
    {
        region: "Región del Biobío",
        comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante"]
    },
    {
        region: "Región de la Araucanía",
        comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"]
    },
    {
        region: "Región de Ñuble",
        comunas: ["Chillán", "Linares", "Longaví"]
    }
];

// Cargar opciones de regiones al cargar la página
function cargarRegiones() {
    const selectRegion = document.getElementById("region");
    if (!selectRegion) return;

    regionesYComunas.forEach(item => {
        const opcion = document.createElement("option");
        opcion.value = item.region;
        opcion.textContent = item.region;
        selectRegion.appendChild(opcion);
    });

    selectRegion.addEventListener("change", function() {
        const selectComuna = document.getElementById("comuna");
        selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
        
        const regionSeleccionada = regionesYComunas.find(r => r.region === this.value);

        if (regionSeleccionada) {
            selectComuna.disabled = false;
            regionSeleccionada.comunas.forEach(comuna => {
                const opcion = document.createElement("option");
                opcion.value = comuna;
                opcion.textContent = comuna;
                selectComuna.appendChild(opcion);
            });
        } else {
            selectComuna.disabled = true;
        }
    });
}

// -------------------------------------------------------------
// 5. VALIDACIÓN FORMULARIO DE REGISTRO
// -------------------------------------------------------------
const formularioRegistro = document.getElementById("formulario-registro");

if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", function(e) {
        e.preventDefault();
        let esValido = true;

        const run = document.getElementById("run");
        const nombre = document.getElementById("nombre-registro");
        const apellidos = document.getElementById("apellidos");
        const correo = document.getElementById("correo-registro");
        const clave = document.getElementById("clave-registro");
        const claveConf = document.getElementById("clave-confirmar");
        const region = document.getElementById("region");
        const comuna = document.getElementById("comuna");
        const direccion = document.getElementById("direccion");

        // Limpiar errores
        document.querySelectorAll(".seccion-contacto .mensaje-error").forEach(span => span.style.display = "none");

        // Validar RUN (7 a 9 caracteres, sin puntos ni guion)
        const regexRun = /^[0-9]{7,8}[0-9kK]{1}$/;
        if (!regexRun.test(run.value.trim())) {
            mostrarError("error-run", "RUN inválido. Debe ingresar entre 7 y 9 caracteres sin puntos ni guion (ej: 19011022K).");
            esValido = false;
        }

        // Validar Nombre (Max 50)
        if (nombre.value.trim() === "" || nombre.value.length > 50) {
            mostrarError("error-nombre-registro", "El nombre es obligatorio y debe tener máximo 50 caracteres.");
            esValido = false;
        }

        // Validar Apellidos (Max 100)
        if (apellidos.value.trim() === "" || apellidos.value.length > 100) {
            mostrarError("error-apellidos", "Los apellidos son obligatorios y deben tener máximo 100 caracteres.");
            esValido = false;
        }

        // Validar Correo (Dominios permitidos)
        const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
        const correoValido = dominios.some(d => correo.value.trim().endsWith(d));
        if (correo.value.trim() === "" || correo.value.length > 100 || !correoValido) {
            mostrarError("error-correo-registro", "Correo obligatorio (máx 100). Dominios: @duoc.cl, @profesor.duoc.cl, @gmail.com.");
            esValido = false;
        }

        // Validar Contraseña (4 a 10 caracteres)
        if (clave.value.length < 4 || clave.value.length > 10) {
            mostrarError("error-clave-registro", "La contraseña debe tener entre 4 y 10 caracteres.");
            esValido = false;
        }

        // Validar Confirmar Contraseña
        if (claveConf.value !== clave.value || claveConf.value === "") {
            mostrarError("error-clave-confirmar", "Las contraseñas no coinciden.");
            esValido = false;
        }

        // Validar Selección Región y Comuna
        if (region.value === "") {
            mostrarError("error-region", "Debe seleccionar una región.");
            esValido = false;
        }
        if (comuna.value === "") {
            mostrarError("error-comuna", "Debe seleccionar una comuna.");
            esValido = false;
        }

        // Validar Dirección (Max 300)
        if (direccion.value.trim() === "" || direccion.value.length > 300) {
            mostrarError("error-direccion", "La dirección es obligatoria y debe tener máximo 300 caracteres.");
            esValido = false;
        }

        if (esValido) {
            alert("¡Usuario registrado con éxito!");
            formularioRegistro.reset();
            document.getElementById("comuna").disabled = true;
        }
    });
}

// -------------------------------------------------------------
// 6. VALIDACIÓN FORMULARIO INICIO DE SESIÓN
// -------------------------------------------------------------
const formularioLogin = document.getElementById("formulario-login");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", function(e) {
        e.preventDefault();
        let esValido = true;

        const correo = document.getElementById("correo-login");
        const clave = document.getElementById("clave-login");

        document.querySelectorAll("#formulario-login .mensaje-error").forEach(span => span.style.display = "none");

        const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
        const correoValido = dominios.some(d => correo.value.trim().endsWith(d));

        if (correo.value.trim() === "" || correo.value.length > 100 || !correoValido) {
            mostrarError("error-correo-login", "Correo no válido. Debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com.");
            esValido = false;
        }

        if (clave.value.length < 4 || clave.value.length > 10) {
            mostrarError("error-clave-login", "La contraseña debe contener entre 4 y 10 caracteres.");
            esValido = false;
        }

        if (esValido) {
            alert("Inicio de sesión exitoso.");
            formularioLogin.reset();
            window.location.href = "index.html";
        }
    });
}

// Función auxiliar para mostrar mensajes de error dinámicos
function mostrarError(elementId, mensaje) {
    const errorSpan = document.getElementById(elementId);
    if (errorSpan) {
        errorSpan.textContent = mensaje;
        errorSpan.style.display = "block";
    }
}

// Inicialización de selector de regiones
document.addEventListener("DOMContentLoaded", () => {
    cargarRegiones();
});

// -------------------------------------------------------------
// 7. LÓGICA DE ADMINISTRACIÓN (MANTENEDOR DE PRODUCTOS Y USUARIOS)
// -------------------------------------------------------------

// Arreglo inicial de usuarios registrados para simulación
let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosApp')) || [
    { run: "19011022K", nombre: "Juan Pérez", correo: "juan.perez@duoc.cl", rol: "Administrador" },
    { run: "182234445", nombre: "María González", correo: "m.gonzalez@gmail.com", rol: "Cliente" }
];

// Cargar tablas al iniciar vista de administración
function renderizarTablaProductosAdmin() {
    const cuerpoTabla = document.getElementById("cuerpo-tabla-productos");
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = "";

    productos.forEach((p, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>PROD-00${p.id}</td>
            <td>${p.nombre}</td>
            <td>Periféricos</td>
            <td>${formatearCLP(p.precio)}</td>
            <td>15</td>
            <td>5</td>
            <td>
                <button class="boton-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

function renderizarTablaUsuariosAdmin() {
    const cuerpoTabla = document.getElementById("cuerpo-tabla-usuarios");
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = "";

    usuariosRegistrados.forEach((u, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${u.run}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>${u.rol}</td>
            <td>
                <button class="boton-eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

function eliminarProducto(index) {
    if (confirm("¿Está seguro de que desea eliminar este producto?")) {
        productos.splice(index, 1);
        renderizarTablaProductosAdmin();
    }
}

function eliminarUsuario(index) {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
        usuariosRegistrados.splice(index, 1);
        localStorage.setItem('usuariosApp', JSON.stringify(usuariosRegistrados));
        renderizarTablaUsuariosAdmin();
    }
}

// Formulario de ingreso de productos
const formularioProducto = document.getElementById("formulario-producto");

if (formularioProducto) {
    formularioProducto.addEventListener("submit", function(e) {
        e.preventDefault();
        let esValido = true;

        const codigo = document.getElementById("prod-codigo");
        const nombre = document.getElementById("prod-nombre");
        const categoria = document.getElementById("prod-categoria");
        const precio = document.getElementById("prod-precio");
        const stock = document.getElementById("prod-stock");
        const stockCritico = document.getElementById("prod-stock-critico");
        const imagen = document.getElementById("prod-imagen");

        document.querySelectorAll("#formulario-producto .mensaje-error").forEach(s => s.style.display = "none");

        if (codigo.value.trim() === "") {
            mostrarError("error-prod-codigo", "El código es obligatorio.");
            esValido = false;
        }

        if (nombre.value.trim() === "") {
            mostrarError("error-prod-nombre", "El nombre del producto es obligatorio.");
            esValido = false;
        }

        if (categoria.value === "") {
            mostrarError("error-prod-categoria", "Debe seleccionar una categoría.");
            esValido = false;
        }

        if (precio.value <= 0) {
            mostrarError("error-prod-precio", "El precio debe ser un número mayor a cero.");
            esValido = false;
        }

        if (stock.value === "" || stock.value < 0) {
            mostrarError("error-prod-stock", "Ingrese un valor de stock válido.");
            esValido = false;
        }

        if (stockCritico.value === "" || stockCritico.value < 1) {
            mostrarError("error-prod-stock-critico", "El stock crítico debe ser de al menos 1.");
            esValido = false;
        }

        if (imagen.value.trim() === "") {
            mostrarError("error-prod-imagen", "La URL de la imagen es obligatoria.");
            esValido = false;
        }

        if (esValido) {
            const nuevoProducto = {
                id: productos.length + 1,
                nombre: nombre.value.trim(),
                precio: parseInt(precio.value),
                imagen: imagen.value.trim()
            };

            productos.push(nuevoProducto);
            renderizarTablaProductosAdmin();
            formularioProducto.reset();
            alert("Producto guardado exitosamente.");
        }
    });
}

// Ejecutar cargas dinámicas en DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    renderizarTablaProductosAdmin();
    renderizarTablaUsuariosAdmin();
});