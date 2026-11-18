// 1. INICIALIZACIÓN Y PERSISTENCIA (LOCALSTORAGE)

let biblioteca = JSON.parse(localStorage.getItem("biblioteca")) || [
  {
    codigo: "LIB-001",
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    categoria: "literatura",
    estado: "Disponible",
  },
  {
    codigo: "LIB-004",
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    categoria: "literatura",
    estado: "Prestado",
  },
  {
    codigo: "LIB-003",
    titulo: "Matemática básica",
    autor: "Laura Méndez",
    categoria: "educacion",
    estado: "Prestado",
  },
];

let prestamos = JSON.parse(localStorage.getItem("prestamos")) || [
  {
    codigo: "LIB-004",
    titulo: "El principito",
    solicitante: "Ana Morales",
    fecha: "2026-11-15",
    estado: "Activo",
  },
  {
    codigo: "LIB-001",
    titulo: "El principito",
    solicitante: "Luis García",
    fecha: "2026-11-07",
    estado: "Devuelto",
  },
  {
    codigo: "LIB-003",
    titulo: "Matemática básica",
    solicitante: "Pedro Ramírez",
    fecha: "2026-11-06",
    estado: "Vencido",
  },
];

// Guardará el préstamo que se está devolviendo en ese momento
let prestamoSeleccionado = null;

function guardarDatos() {
  localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
  localStorage.setItem("prestamos", JSON.stringify(prestamos));
}

// 2. FUNCIONALIDAD DE LOS DIÁLOGOS (MODALES) Y EVENTOS

document.addEventListener("DOMContentLoaded", () => {
  // --- REGISTRAR LIBRO ---
  const dialogoLibro = document.getElementById("dialogo-registrar-libro");
  const btnRegistrarLibro = document.getElementById("btn-registrar-libro");
  const btnCancelarLibro = document.getElementById("btn-cancelar-libro");
  const formRegistrarLibro = document.getElementById("form-registrar-libro");

  btnRegistrarLibro.addEventListener("click", () => dialogoLibro.showModal());
  btnCancelarLibro.addEventListener("click", () => dialogoLibro.close());

  formRegistrarLibro.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo-libro").value.trim();
    const autor = document.getElementById("autor-libro").value.trim();
    const categoria = document.getElementById("categoria-libro").value;

    if (!titulo || !autor || !categoria) {
      alert("Completá título, autor y categoría.");
      return;
    }

    // Generar código que no se repita
    let numero = biblioteca.length + 1;
    let nuevoCodigo = `LIB-00${numero}`;

    while (biblioteca.some((libro) => libro.codigo === nuevoCodigo)) {
      numero++;
      nuevoCodigo = `LIB-00${numero}`;
    }

    biblioteca.push({
      codigo: nuevoCodigo,
      titulo: titulo,
      autor: autor,
      categoria: categoria,
      estado: "Disponible",
    });

    guardarDatos();
    formRegistrarLibro.reset();
    dialogoLibro.close();
    actualizarVistaCatalogo();
  });

  // --- PRESTAR LIBRO ---
  const dialogoPrestamo = document.getElementById("dialogo-registrar-prestamo");
  const btnCancelarPrestamo = document.getElementById("btn-cancelar-prestamo");
  const formRegistrarPrestamo = document.getElementById(
    "form-registrar-prestamo",
  );

  btnCancelarPrestamo.addEventListener("click", () => dialogoPrestamo.close());

  formRegistrarPrestamo.addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = document.getElementById("prestamo-codigo").value;
    const solicitante = document
      .getElementById("prestamo-solicitante")
      .value.trim();
    const fecha = document.getElementById("prestamo-fecha-devolucion").value;

    if (!solicitante || !fecha) {
      alert("Completá el nombre del solicitante y la fecha de devolución.");
      return;
    }

    const libro = biblioteca.find((item) => item.codigo === codigo);

    // Comprobar disponibilidad antes de guardar
    if (!libro || libro.estado !== "Disponible") {
      alert("Este libro no está disponible.");
      dialogoPrestamo.close();
      return;
    }

    libro.estado = "Prestado";

    prestamos.push({
      codigo: libro.codigo,
      titulo: libro.titulo,
      solicitante: solicitante,
      fecha: fecha,
      estado: "Activo",
    });

    guardarDatos();
    formRegistrarPrestamo.reset();
    dialogoPrestamo.close();
    actualizarVistaCatalogo();
    actualizarVistaPrestamos();
  });

  // --- REGISTRAR DEVOLUCIÓN ---
  const dialogoDevolucion = document.getElementById(
    "dialogo-confirmar-devolucion",
  );
  const btnCancelarDevolucion = document.getElementById(
    "btn-cancelar-devolucion",
  );
  const btnConfirmarDevolucion = document.getElementById(
    "btn-confirmar-devolucion",
  );

  btnCancelarDevolucion.addEventListener("click", () =>
    dialogoDevolucion.close(),
  );

  btnConfirmarDevolucion.addEventListener("click", () => {
    if (!prestamoSeleccionado) return;

    // Marcar préstamo como Devuelto (se conserva en el array)
    prestamoSeleccionado.estado = "Devuelto";

    // Marcar el ejemplar como Disponible
    const libro = biblioteca.find(
      (item) => item.codigo === prestamoSeleccionado.codigo,
    );
    if (libro) {
      libro.estado = "Disponible";
    }

    guardarDatos();
    dialogoDevolucion.close();
    actualizarVistaCatalogo();
    actualizarVistaPrestamos();
  });

  // --- BUSCADOR DEL CATÁLOGO ---
  const inputBuscarLibro = document.getElementById("buscar-libro");
  const btnBuscar = document.getElementById("btn-buscar");

  btnBuscar.addEventListener("click", () => actualizarVistaCatalogo());
  inputBuscarLibro.addEventListener("input", () => actualizarVistaCatalogo());

  // Mostrar tablas al cargar la página
  actualizarVistaCatalogo();
  actualizarVistaPrestamos();
});

// 3. ACTUALIZAR TABLAS Y CONTADORES

function actualizarVistaCatalogo() {
  const cuerpoCatalogo = document.getElementById("cuerpo-catalogo");
  cuerpoCatalogo.innerHTML = "";

  // Contar disponibles y prestados reales
  let totalDisponibles = 0;
  let totalPrestados = 0;

  biblioteca.forEach((libro) => {
    if (libro.estado === "Disponible") totalDisponibles++;
    else totalPrestados++;
  });

  document.getElementById("total-ejemplares").textContent = biblioteca.length;
  document.getElementById("total-disponibles").textContent = totalDisponibles;
  document.getElementById("total-prestados").textContent = totalPrestados;

  // Filtrar libros por título o autor
  const textoBusqueda = document
    .getElementById("buscar-libro")
    .value.toLowerCase();

  const librosFiltrados = biblioteca.filter((libro) => {
    return (
      libro.titulo.toLowerCase().includes(textoBusqueda) ||
      libro.autor.toLowerCase().includes(textoBusqueda)
    );
  });

  // Mostrar mensaje si no hay resultados
  if (librosFiltrados.length === 0) {
    cuerpoCatalogo.innerHTML = `
      <tr>
        <td colspan="6">No se encontraron libros con ese título o autor.</td>
      </tr>
    `;
    return;
  }

  // Dibujar filas del catálogo
  librosFiltrados.forEach((libro) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${libro.codigo}</td>
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.categoria}</td>
      <td class="${libro.estado.toLowerCase()}">${libro.estado}</td>
      <td>
        <button type="button" class="btn-prestar" ${libro.estado === "Prestado" ? "disabled" : ""}>
          ${libro.estado === "Prestado" ? "No disponible" : "Prestar"}
        </button>
      </td>
    `;

    // Evento del botón Prestar de esta fila
    const btnPrestar = tr.querySelector(".btn-prestar");
    btnPrestar.addEventListener("click", () => {
      document.getElementById("prestamo-codigo").value = libro.codigo;
      document.getElementById("prestamo-libro").value = libro.titulo;
      document.getElementById("dialogo-registrar-prestamo").showModal();
    });

    cuerpoCatalogo.appendChild(tr);
  });
}

function actualizarVistaPrestamos() {
  const cuerpoPrestamos = document.getElementById("cuerpo-prestamos");
  cuerpoPrestamos.innerHTML = "";

  // Contar estados de préstamos reales
  let activos = 0;
  let vencidos = 0;
  let devueltos = 0;

  prestamos.forEach((prestamo) => {
    if (prestamo.estado === "Activo" || prestamo.estado === "Vencido") {
      activos++;
    }

    if (prestamo.estado === "Vencido") {
      vencidos++;
    }

    if (prestamo.estado === "Devuelto") {
      devueltos++;
    }
  });

  document.getElementById("total-prestamos-activos").textContent = activos;
  document.getElementById("total-prestamos-vencidos").textContent = vencidos;
  document.getElementById("total-prestamos-devueltos").textContent = devueltos;

  // Dibujar filas de préstamos
  prestamos.forEach((prestamo) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prestamo.codigo}</td>
      <td>${prestamo.titulo}</td>
      <td>${prestamo.solicitante}</td>
      <td>${prestamo.fecha}</td>
      <td class="${prestamo.estado.toLowerCase()}">${prestamo.estado}</td>
      <td>
        <button type="button" class="btn-devolver" ${prestamo.estado === "Devuelto" ? "disabled" : ""}>
          ${prestamo.estado === "Devuelto" ? "Ya devuelto" : "Registrar devolución"}
        </button>
      </td>
    `;

    // Evento del botón Registrar devolución de esta fila
    const btnDevolver = tr.querySelector(".btn-devolver");
    btnDevolver.addEventListener("click", () => {
      prestamoSeleccionado = prestamo;
      document.getElementById("detalle-devolucion").textContent =
        `${prestamo.codigo} - ${prestamo.titulo}`;
      document.getElementById("dialogo-confirmar-devolucion").showModal();
    });

    cuerpoPrestamos.appendChild(tr);
  });
}
