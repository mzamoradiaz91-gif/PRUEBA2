const CACHE_NAME = 'dflorens-v1';

// Lista de archivos para guardar en caché
// IMPORTANTE: Debes agregar aquí las rutas a tus imágenes de servicios
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png'
  
  /*
  // --- ¡NO OLVIDES AGREGAR TUS IMÁGENES DE SERVICIOS AQUÍ! ---
  // Descomenta (borra el '//') las líneas de las imágenes que ya tengas
  
  // '/images/logo-app.png',
  // '/images/corte-hombre.jpg',
  // '/images/corte-nino.jpg',
  // '/images/depilacion-ceja.jpg',
  // '/images/corte-barba.jpg',
  // '/images/solo-barba.jpg',
  // '/images/colorimetria.jpg',
  // '/images/corte-hidratacion.jpg',
  // '/images/planchado-ceja.jpg',
  // '/images/tinte-sellador.jpg',
  // '/images/efecto-color.jpg',
  // '/images/alaciado-corto.jpg',
  // '/images/unas.jpg'
  */
];

// Evento de Instalación: Guarda los archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto: ' + CACHE_NAME);
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Fuerza al Service Worker a activarse
  );
});

// Evento de Activación: Limpia cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antiguo: ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Toma control inmediato de la página
});

// Evento Fetch: Responde desde el caché si es posible, si no, va a la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el archivo está en caché, lo devuelve.
        if (response) {
          return response;
        }
        // Si no, va a la red a buscarlo
        return fetch(event.request);
      })
  );
});