// ==========================================
// DASHBOARD PERSONAL DE PRODUCTIVIDAD - APP.JS
// ==========================================

// --- 1. SELECCIÓN DE ELEMENTOS DEL DOM ---
const clockElement = document.getElementById('clock');
const greetingElement = document.getElementById('greeting');
const dateDisplayElement = document.getElementById('date-display');

const cityInput = document.getElementById('city-input');
const searchWeatherBtn = document.getElementById('search-weather-btn');
const weatherInfo = document.getElementById('weather-info');

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tasksCounter = document.getElementById('tasks-counter');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Array principal donde guardaremos las tareas en memoria
let tasks = [];

// --- 2. RELOJ Y SALUDO DINÁMICO ---
function updateClock() {
  const now = new Date();
  
  // Obtener hora, minutos y segundos con formato de 2 dígitos
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;

  // Formatear Fecha en español
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateDisplayElement.textContent = now.toLocaleDateString('es-ES', options);

  // Cambiar el saludo según la hora
  const currentHour = now.getHours();
  if (currentHour >= 5 && currentHour < 12) {
    greetingElement.textContent = '¡Buenos días! ☀️';
  } else if (currentHour >= 12 && currentHour < 19) {
    greetingElement.textContent = '¡Buenas tardes! 🌤️';
  } else {
    greetingElement.textContent = '¡Buenas noches! 🌙';
  }
}

// Ejecutar la función cada segundo (1000 ms)
setInterval(updateClock, 1000);
updateClock();

// --- 3. CLIMA EN TIEMPO REAL (USANDO API GRATUITA OPEN-METEO) ---
async function fetchWeather(city) {
  if (!city.trim()) return;

  weatherInfo.innerHTML = `<p class="weather-placeholder">Buscando clima para "${city}"...</p>`;

  try {
    // Paso A: Convertir el nombre de la ciudad a coordenadas (Latitud/Longitud)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      weatherInfo.innerHTML = `<p class="weather-placeholder" style="color: var(--danger-color);">No se encontró la ciudad.</p>`;
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Paso B: Obtener la temperatura y clima actual
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const temp = Math.round(weatherData.current_weather.temperature);
    const weatherCode = weatherData.current_weather.weathercode;
    const weatherDescription = getWeatherDescription(weatherCode);

    // Pintar los datos en la pantalla
    weatherInfo.innerHTML = `
      <div class="weather-details">
        <h3>${name}, ${country}</h3>
        <p class="weather-temp">${temp}°C</p>
        <p class="weather-desc">${weatherDescription}</p>
      </div>
    `;

    // Guardar la última ciudad buscada en la memoria del navegador
    localStorage.setItem('lastCity', city);

  } catch (error) {
    console.error('Error al obtener el clima:', error);
    weatherInfo.innerHTML = `<p class="weather-placeholder" style="color: var(--danger-color);">Error de conexión al obtener el clima.</p>`;
  }
}

// Mapeo de códigos de clima a descripciones en español
function getWeatherDescription(code) {
  const codes = {
    0: 'Cielo despejado ☀️',
    1: 'Principalmente despejado 🌤️',
    2: 'Parcialmente nublado ⛅',
    3: 'Nublado ☁️',
    45: 'Niebla 🌫️',
    51: 'Llovizna ligera 🌧️',
    61: 'Lluvia moderada 🌧️',
    95: 'Tormenta eléctrica 🌩️'
  };
  return codes[code] || 'Clima variable 🌡️';
}

// Escuchar clics en el botón de buscar
searchWeatherBtn.addEventListener('click', () => {
  fetchWeather(cityInput.value);
});

// Permitir buscar al presionar la tecla Enter
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    fetchWeather(cityInput.value);
  }
});

// --- 4. LISTA DE TAREAS Y LOCALSTORAGE ---

// Cargar tareas guardadas previamente
function loadTasks() {
  const storedTasks = localStorage.getItem('dashboard_tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  } else {
    // Tareas iniciales de demostración
    tasks = [
      { id: 1, text: 'Aprender HTML, CSS y JavaScript', completed: true },
      { id: 2, text: 'Construir mi primer proyecto web', completed: false }
    ];
  }
  renderTasks();
}

// Guardar tareas en LocalStorage
function saveTasks() {
  localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
}

// Dibujar las tareas en la pantalla
function renderTasks() {
  todoList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
        <span>${escapeHTML(task.text)}</span>
      </div>
      <button class="delete-btn" data-id="${task.id}" title="Eliminar tarea">&times;</button>
    `;

    todoList.appendChild(li);
  });

  updateTasksCounter();
}

// Función de seguridad para evitar inyección de código
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Actualizar el contador de pendientes
function updateTasksCounter() {
  const pendingCount = tasks.filter(t => !t.completed).length;
  tasksCounter.textContent = `${pendingCount} ${pendingCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
}

// Evento para agregar una nueva tarea
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (text !== '') {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    todoInput.value = '';
  }
});

// Evento para marcar/completar o eliminar una tarea
todoList.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.type === 'checkbox') {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
  } else if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
});

// Evento para limpiar todas las tareas completadas
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

// --- 5. INICIALIZACIÓN DE LA APLICACIÓN ---
function init() {
  loadTasks();

  const savedCity = localStorage.getItem('lastCity') || 'Bogota';
  cityInput.value = savedCity;
  fetchWeather(savedCity);
}

// Iniciar todo cuando el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', init);