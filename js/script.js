// 1. INICIALIZACIÓN Y PERSISTENCIA (LOCALSTORAGE)

let biblioteca = [
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

let prestamos = [
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

function obtenerFechaHoy() {
  const hoy = new Date();

  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function actualizarVencimientos() {
  const hoy = obtenerFechaHoy();
  let huboCambios = false;

  prestamos.forEach((prestamo) => {
    if (prestamo.estado !== "Devuelto") {
      const estadoCorrecto = prestamo.fecha < hoy ? "Vencido" : "Activo";

      if (prestamo.estado !== estadoCorrecto) {
        prestamo.estado = estadoCorrecto;
        huboCambios = true;
      }
    }
  });

  if (huboCambios) {
    guardarDatos();
  }
}

function leerListaGuardada(clave, datosIniciales, campos) {
  const contenido = localStorage.getItem(clave);

  if (contenido === null) {
    return datosIniciales;
  }

  const lista = JSON.parse(contenido);

  const estructuraValida =
    Array.isArray(lista) &&
    lista.every(
      (registro) =>
        registro &&
        campos.every((campo) => typeof registro[campo] === "string"),
    );

  if (!estructuraValida) {
    throw new Error(`Los datos de "${clave}" tienen un formato incorrecto.`);
  }

  return lista;
}

// 2. FUNCIONALIDAD DE LOS DIÁLOGOS (MODALES) Y EVENTOS

document.addEventListener("DOMContentLoaded", () => {
  try {
    biblioteca = leerListaGuardada("biblioteca", biblioteca, [
      "codigo",
      "titulo",
      "autor",
      "categoria",
      "estado",
    ]);

    prestamos = leerListaGuardada("prestamos", prestamos, [
      "codigo",
      "titulo",
      "solicitante",
      "fecha",
      "estado",
    ]);
  } catch (error) {
    console.error(error);

    document.querySelector("main").textContent =
      "No se pudieron cargar los datos guardados. " +
      "Las operaciones están detenidas para conservarlos. " +
      "No se borró ni sobrescribió la información.";

    return;
  }

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
    let nuevoCodigo = `LIB-${String(numero).padStart(3, "0")}`;

    while (biblioteca.some((libro) => libro.codigo === nuevoCodigo)) {
      numero++;
      nuevoCodigo = `LIB-${String(numero).padStart(3, "0")}`;
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

    if (fecha < obtenerFechaHoy()) {
      alert("La fecha de devolución no puede ser anterior a hoy.");
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

  const filtroDisponibilidad = document.getElementById("filtro-disponibilidad");

  filtroDisponibilidad.addEventListener("change", actualizarVistaCatalogo);

  const inputBuscarPrestamo = document.getElementById("buscar-prestamo");

  const btnBuscarPrestamo = document.getElementById("btn-buscar-prestamo");

  inputBuscarPrestamo.addEventListener("input", actualizarVistaPrestamos);
  btnBuscarPrestamo.addEventListener("click", actualizarVistaPrestamos);

  const filtroEstadoPrestamo = document.getElementById(
    "filtro-estado-prestamo",
  );

  filtroEstadoPrestamo.addEventListener("change", actualizarVistaPrestamos);

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
    .value.trim()
    .toLowerCase();

  const disponibilidad = document.getElementById("filtro-disponibilidad").value;

  const librosFiltrados = biblioteca.filter((libro) => {
    const coincideTexto =
      libro.titulo.toLowerCase().includes(textoBusqueda) ||
      libro.autor.toLowerCase().includes(textoBusqueda);

    const coincideEstado =
      disponibilidad === "todos" ||
      libro.estado.toLowerCase() === disponibilidad;

    return coincideTexto && coincideEstado;
  });

  // Mostrar mensaje si no hay resultados
  if (librosFiltrados.length === 0) {
    cuerpoCatalogo.innerHTML = `
      <tr>
        <td colspan="6">No se encontraron libros con los criterios seleccionados.</td>
      </tr>
    `;
    return;
  }

  // Dibujar filas del catálogo
  librosFiltrados.forEach((libro) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>
    <button type="button" class="btn-prestar"></button>
  </td>
`;

    const celdas = tr.querySelectorAll("td");

    celdas[0].textContent = libro.codigo;
    celdas[1].textContent = libro.titulo;
    celdas[2].textContent = libro.autor;
    celdas[3].textContent = libro.categoria;
    celdas[4].textContent = libro.estado;
    celdas[4].className = libro.estado.toLowerCase();

    // Evento del botón Prestar de esta fila
    const btnPrestar = tr.querySelector(".btn-prestar");
    btnPrestar.disabled = libro.estado !== "Disponible";

    btnPrestar.textContent = btnPrestar.disabled ? "No disponible" : "Prestar";
    btnPrestar.addEventListener("click", () => {
      document.getElementById("prestamo-codigo").value = libro.codigo;
      document.getElementById("prestamo-libro").value = libro.titulo;
      document.getElementById("dialogo-registrar-prestamo").showModal();
    });

    cuerpoCatalogo.appendChild(tr);
  });
}

function actualizarVistaPrestamos() {
  actualizarVencimientos(); // Actualizar estados antes de mostrar

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

  const textoBusqueda = document
    .getElementById("buscar-prestamo")
    .value.trim()
    .toLowerCase();

  const estadoSeleccionado = document.getElementById(
    "filtro-estado-prestamo",
  ).value;

  const prestamosFiltrados = prestamos.filter((prestamo) => {
    const coincideTexto =
      prestamo.solicitante.toLowerCase().includes(textoBusqueda) ||
      prestamo.titulo.toLowerCase().includes(textoBusqueda) ||
      prestamo.codigo.toLowerCase().includes(textoBusqueda);

    let coincideEstado = false;

    if (estadoSeleccionado === "todos") {
      coincideEstado = true;
    } else if (estadoSeleccionado === "activo") {
      coincideEstado =
        prestamo.estado === "Activo" || prestamo.estado === "Vencido";
    } else {
      coincideEstado = prestamo.estado.toLowerCase() === estadoSeleccionado;
    }

    return coincideTexto && coincideEstado;
  });

  if (prestamosFiltrados.length === 0) {
    cuerpoPrestamos.innerHTML = `
    <tr>
      <td colspan="6">No se encontraron préstamos con esos criterios.</td>
    </tr>
  `;
    return;
  }

  // Dibujar filas de préstamos
  prestamosFiltrados.forEach((prestamo) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>
    <button type="button" class="btn-devolver"></button>
  </td>
`;

    const celdas = tr.querySelectorAll("td");

    celdas[0].textContent = prestamo.codigo;
    celdas[1].textContent = prestamo.titulo;
    celdas[2].textContent = prestamo.solicitante;
    celdas[3].textContent = prestamo.fecha;
    celdas[4].textContent = prestamo.estado;
    celdas[4].className = prestamo.estado.toLowerCase();

    // Evento del botón Registrar devolución de esta fila
    const btnDevolver = tr.querySelector(".btn-devolver");
    btnDevolver.disabled = prestamo.estado === "Devuelto";

    btnDevolver.textContent = btnDevolver.disabled
      ? "Ya devuelto"
      : "Registrar devolución";
    btnDevolver.addEventListener("click", () => {
      prestamoSeleccionado = prestamo;
      document.getElementById("detalle-devolucion").textContent =
        `${prestamo.codigo} - ${prestamo.titulo}`;
      document.getElementById("dialogo-confirmar-devolucion").showModal();
    });

    cuerpoPrestamos.appendChild(tr);
  });
}
