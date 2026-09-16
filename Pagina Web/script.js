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
        imagen: "https://images.unsplash.com/photo-1527814050087-379381547942?w=400&q=80" 
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

// Inicializar funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    actualizarContadorCarrito();
});
