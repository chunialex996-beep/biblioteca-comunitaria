# Biblioteca Comunitaria

Aplicación web para gestionar el catálogo, los préstamos y las devoluciones de una biblioteca comunitaria. El proyecto busca sustituir el control mediante cuaderno por una herramienta que permita consultar la disponibilidad de los ejemplares y conservar el historial de préstamos.

Proyecto final del curso Introducción a la Programación Web, Universidad del Valle de Guatemala, sede Santa Lucía Cotzumalguapa.

## Integrantes

- Alex Chuní
- Luis Lima
- Geovanny Recinos
- Dylan de Matta

## Funciones principales

### Catálogo de libros

- Registrar ejemplares con título, autor y categoría.
- Asignar automáticamente un código único a cada ejemplar.
- Buscar libros por título o autor.
- Filtrar ejemplares disponibles o prestados.
- Combinar la búsqueda con el filtro de disponibilidad.
- Mostrar los totales de ejemplares registrados, disponibles y prestados.

Cada código identifica un ejemplar físico. Por eso pueden existir varios ejemplares con el mismo título y autor, pero con códigos diferentes.

### Préstamos y devoluciones

- Registrar préstamos con nombre del solicitante y fecha prevista de devolución.
- Impedir préstamos de ejemplares que ya están prestados.
- Rechazar campos vacíos y fechas de devolución anteriores al día actual.
- Permitir préstamos con fecha prevista para el día actual.
- Buscar préstamos por solicitante, título o código del ejemplar.
- Filtrar préstamos pendientes, vencidos o devueltos.
- Confirmar las devoluciones antes de modificar los registros.
- Conservar los préstamos devueltos en el historial.

### Persistencia

Los datos se guardan en localStorage y se recuperan al volver a abrir la aplicación desde el mismo navegador, perfil y dirección.

## Tecnologías utilizadas

- HTML5 para la estructura y los formularios.
- CSS3, Grid, Flexbox y media queries para la presentación y adaptación a pantallas.
- JavaScript para validaciones, eventos y manipulación del DOM.
- localStorage y JSON para conservar los datos.
- Git y GitHub para el control de versiones y la integración del trabajo.

La aplicación no utiliza frameworks, backend ni base de datos de servidor.

## Estructura del proyecto

- `index.html`: estructura de la página, navegación, tablas y formularios.
- `css/styles.css`: estilos generales, estados visuales y adaptación a pantallas pequeñas.
- `js/script.js`: datos, validaciones, búsquedas, filtros, préstamos, devoluciones y persistencia.
- `README.md`: descripción e instrucciones de ejecución.

El catálogo y los préstamos se encuentran en secciones de una misma página. Los enlaces del encabezado permiten desplazarse entre ellas.

## Cómo ejecutar la aplicación

1. Descargar el repositorio o clonarlo con Git.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Tener instalada la extensión Live Server.
4. Abrir `index.html` mediante la opción **Open with Live Server**.
5. Utilizar la aplicación desde la dirección que abra el navegador.

Se debe conservar la estructura de carpetas para que se carguen correctamente los archivos CSS y JavaScript.

Para acceder a los mismos datos guardados, utilizar el mismo navegador, perfil, dirección y puerto. Por ejemplo, `localhost` y `127.0.0.1` utilizan almacenamientos separados, aunque abran el mismo proyecto.

## Uso básico

### Registrar un ejemplar

1. Pulsar **Registrar libro**.
2. Completar título, autor y categoría.
3. Pulsar **Guardar libro**.

El sistema asignará un código automáticamente y registrará el ejemplar como Disponible.

### Registrar un préstamo

1. Buscar un ejemplar disponible en el catálogo.
2. Pulsar **Prestar**.
3. Completar el nombre del solicitante y la fecha prevista de devolución.
4. Pulsar **Confirmar préstamo**.

El ejemplar cambiará a Prestado y se agregará el movimiento al registro de préstamos.

### Registrar una devolución

1. Localizar el préstamo pendiente.
2. Pulsar **Registrar devolución**.
3. Revisar el ejemplar indicado.
4. Pulsar **Confirmar devolución**.

El préstamo quedará como Devuelto y el ejemplar volverá a estar Disponible.

## Estados y contadores

Los ejemplares pueden estar:

- **Disponible:** pueden prestarse.
- **Prestado:** tienen un préstamo pendiente.

Los préstamos pueden estar:

- **Activo:** pendientes con fecha prevista igual o posterior al día actual.
- **Vencido:** pendientes cuya fecha prevista ya pasó.
- **Devuelto:** cerrados y conservados en el historial.

El contador **Préstamos activos** incluye todos los pendientes de devolución, tanto Activos como Vencidos. El contador Vencidos representa un subconjunto de esos pendientes; no deben sumarse ambos para obtener el total.

Los contadores muestran totales generales y no cambian según las coincidencias de una búsqueda.

## Datos de ejemplo

Si no existen datos guardados, la aplicación utiliza tres ejemplares y tres préstamos de ejemplo definidos en JavaScript.

Los nombres de solicitantes se utilizan como datos ficticios para demostrar el funcionamiento del proyecto.

Los estados de los préstamos pendientes se recalculan según la fecha actual. Por ello, un préstamo de ejemplo puede aparecer Vencido cuando se ejecute la aplicación después de su fecha prevista.

## Comprobaciones de funcionamiento

Para revisar el recorrido principal:

1. Registrar un ejemplar y comprobar su código y disponibilidad.
2. Buscarlo por título o autor y combinar la búsqueda con el filtro.
3. Registrar un préstamo con fecha de hoy o posterior.
4. Comprobar que el ejemplar prestado no pueda volver a prestarse.
5. Buscar el préstamo por solicitante, título o código.
6. Confirmar su devolución.
7. Verificar que el ejemplar vuelva a Disponible y el préstamo permanezca como Devuelto.
8. Recargar la página y comprobar que los cambios se conserven.
9. Reducir el ancho de la ventana y comprobar la adaptación del diseño y el desplazamiento de las tablas.

También se pueden comprobar los mensajes sin resultados, el rechazo de campos vacíos o con solo espacios y la visualización literal de textos con signos `<` y `>`.

## Consideraciones y limitaciones

- Los datos pertenecen al almacenamiento del navegador. No se sincronizan entre computadoras, perfiles o navegadores.
- Subir cambios a GitHub comparte los archivos del proyecto, no los registros creados al utilizar la aplicación.
- Borrar los datos del sitio puede eliminar los registros guardados.
- La aplicación no incluye autenticación ni control de acceso.
- La búsqueda ignora mayúsculas y minúsculas, pero distingue las tildes.
- Los vencimientos se recalculan al cargar o actualizar la vista de préstamos; no hay un temporizador continuo.
- La fecha utilizada depende de la configuración del dispositivo.
- Si los datos almacenados no pueden interpretarse o no cumplen la estructura esperada, la aplicación informa del problema y detiene la inicialización para evitar sobrescribirlos.
- El manejo de errores de escritura en localStorage queda como mejora pendiente.

## Documentación técnica

El proyecto cuenta con un documento complementario que explica la estructura de los tres archivos, el modelo de datos, las funciones, los eventos, las validaciones, las limitaciones y las pruebas manuales sugeridas.

## Herramientas de apoyo

Durante el desarrollo se utilizaron Visual Studio Code, Live Server, Git, GitHub y las herramientas de desarrollo del navegador.

También se utilizó asistencia de ChatGPT y Claude para consultar dudas, recibir explicaciones y apoyar la revisión del código.
