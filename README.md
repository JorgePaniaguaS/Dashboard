readme_content = """# Dashboard Personal de Productividad y Clima

Aplicacion web interactiva desarrollada con JavaScript vanilla (ES6+), HTML5 y CSS3. El proyecto centraliza en un solo panel de control un reloj digital dinamico con saludo automatico, consulta meteorologica en tiempo real y un gestor de tareas pendientes con persistencia de datos local.

Este proyecto fue desarrollado como parte de un portafolio profesional para demostrar el dominio de los fundamentos del desarrollo web frontend, manipulacion del DOM, peticiones HTTP asincronas y almacenamiento local.

---

## Caracteristicas Principales

- **Reloj Digital y Saludo Dinamico:** Muestra la hora actual en tiempo real y ajusta el saludo (Buenos dias, Buenas tardes, Buenas noches) de manera automatica segun la hora del sistema.
- **Consulta de Clima en Tiempo Real:** Permite buscar el clima de cualquier ciudad del mundo. Utiliza la API de geocodificacion para obtener coordenadas exactas y consultar la temperatura y condiciones meteorologicas actuales.
- **Integracion sin Clave de API:** Se implemento la API publica de Open-Meteo, permitiendo el funcionamiento inmediato sin necesidad de registros ni claves privadas expuestas en el codigo.
- **Gestion de Tareas (To-Do List):** Permite agregar tareas, marcarlas como completadas y eliminarlas individualmente o en lote.
- **Persistencia con LocalStorage:** Las tareas agregadas y la ultima ciudad consultada se guardan en la memoria interna del navegador, conservando la informacion incluso despues de cerrar o recargar la pagina.
- **Diseño Adaptable (Responsive Design):** Construido con CSS Grid y Flexbox para garantizar una visualizacion optima en dispositivos moviles, tabletas y ordenadores de escritorio.
- **Seguridad en Entradas:** Incluye sanitizacion de texto en la lista de tareas para prevenir vulnerabilidades de inyeccion de codigo HTML (XSS).

---

## Tecnologias Utilizadas

- **HTML5:** Estructura semantica del sitio web.
- **CSS3:** Variables CSS (Custom Properties), Flexbox, CSS Grid, tipografia personalizada e interfaz moderna en modo oscuro.
- **JavaScript (ES6+):**
  - Manipulacion del DOM (`querySelector`, `addEventListener`, `createElement`).
  - Peticiones asincronas (`fetch`, `async/await`).
  - Manejo de fechas y temporizadores (`Date`, `setInterval`).
  - Almacenamiento local (`localStorage`, `JSON.parse`, `JSON.stringify`).
- **Open-Meteo API:** Servicio web externo para geocodificacion y pronostico del tiempo.

---

## Estructura del Proyecto

```text
dashboard-js/
├── index.html      # Estructura principal y maquetacion semantica
├── styles.css      # Hojas de estilo, variables y diseño responsivo
├── app.js          # Logica del negocio, eventos y peticiones API
└── README.md       # Documentacion del proyecto
