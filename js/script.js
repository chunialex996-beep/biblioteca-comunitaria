
// 1. INICIALIZACIÓN Y PERSISTENCIA (LOCALSTORAGE)

let biblioteca = JSON.parse(localStorage.getItem('biblioteca')) || [
    { codigo: "LIB-001", titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "literatura", estado: "Disponible" },
    { codigo: "LIB-004", titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "literatura", estado: "Prestado" },
    { codigo: "LIB-003", titulo: "Matemática básica", autor: "Laura Méndez", categoria: "educacion", estado: "Prestado" }
];

let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [
    { codigo: "LIB-004", titulo: "El principito", solicitante: "Ana Morales", fecha: "2026-11-15", estado: "Activo" },
    { codigo: "LIB-001", titulo: "El principito", solicitante: "Luis García", fecha: "2026-11-07", estado: "Devuelto" },
    { codigo: "LIB-003", titulo: "Matemática básica", solicitante: "Pedro Ramírez", fecha: "2026-11-06", estado: "Vencido" }
];

function guardarDatos() {
    localStorage.setItem('biblioteca', JSON.stringify(biblioteca));
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
}

// 2. FUNCIONALIDAD DE LOS DIÁLOGOS (MODALES)

document.addEventListener("DOMContentLoaded", () => {
    const dialogoLibro = document.getElementById("dialogo-registrar-libro");
    const btnRegistrarLibro = document.getElementById("btn-registrar-libro");
    const btnCancelarLibro = document.getElementById("btn-cancelar-libro");
    const formRegistrarLibro = document.getElementById("form-registrar-libro");

    // Abrir modal de registrar libro
    if (btnRegistrarLibro) {
        btnRegistrarLibro.addEventListener("click", () => dialogoLibro.showModal());
    }
    // Cerrar modal
    if (btnCancelarLibro) {
        btnCancelarLibro.addEventListener("click", () => dialogoLibro.close());
    }

    // Guardar nuevo libro desde el formulario
    if (formRegistrarLibro) {
        formRegistrarLibro.addEventListener("submit", (e) => {
            e.preventDefault();
            const titulo = document.getElementById("titulo-libro").value;
            const autor = document.getElementById("autor-libro").value;
            const categoria = document.getElementById("categoria-libro").value;

            // Generar código automático basado en cantidad
            const nuevoCodigo = `LIB-00${biblioteca.length + 1}`;

            biblioteca.push({
                codigo: nuevoCodigo,
                titulo: titulo,
                autor: autor,
                categoria: categoria,
                estado: "Disponible"
            });

            guardarDatos();
            formRegistrarLibro.reset();
            dialogoLibro.close();
            actualizarVistaCatalogo();
        });
    }

    actualizarVistaCatalogo();
});

// 3. ACTUALIZAR TABLAS Y CONTADORES

function actualizarVistaCatalogo() {
    const cuerpoCatalogo = document.getElementById("cuerpo-catalogo");
    if (!cuerpoCatalogo) return;

    cuerpoCatalogo.innerHTML = "";

    let totalDisponibles = 0;
    let totalPrestados = 0;

    biblioteca.forEach(libro => {
        if (libro.estado === "Disponible") totalDisponibles++;
        else totalPrestados++;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${libro.codigo}</td>
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.categoria.charAt(0).toUpperCase() + libro.categoria.slice(1)}</td>
            <td>${libro.estado}</td>
            <td>
                <button type="button" class="btn-prestar" data-libro-id="${libro.codigo}" ${libro.estado === "Prestado" ? "disabled" : ""}>
                    ${libro.estado === "Prestado" ? "No disponible" : "Prestar"}
                </button>
            </td>
        `;
        cuerpoCatalogo.appendChild(tr);
    });

    // Actualizar contadores del HTML
    document.getElementById("total-ejemplares").textContent = biblioteca.length;
    document.getElementById("total-disponibles").textContent = totalDisponibles;
    document.getElementById("total-prestados").textContent = totalPrestados;
}