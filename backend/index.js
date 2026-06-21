// Importamos la librería Express, que ya instalamos con npm install express
// "require" es la forma de traer código de otro archivo/librería en CommonJS
const express = require('express');

// Creamos una instancia de la aplicación Express
// "app" es nuestro servidor: a partir de acá le vamos a agregar rutas, middlewares, etc.
const app = express();

// Definimos en qué puerto va a escuchar el servidor
// Un puerto es como un "canal" en la misma computadora donde una app escucha conexiones
const PORT = 3000;

// Definimos una ruta: cuando alguien visite "/" (la raíz del sitio) con método GET,
// se ejecuta esta función
app.get('/', (req, res) => {
  // req = "request" (lo que el cliente/navegador pidió)
  // res = "response" (lo que nosotros respondemos)
  // res.send() manda una respuesta de texto al navegador
  res.send('¡Funciona! Mi primer servidor con Express 🏍️');
});

// Le decimos al servidor que empiece a escuchar conexiones en el puerto definido
// El segundo argumento es una función que se ejecuta una sola vez, cuando arranca
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});