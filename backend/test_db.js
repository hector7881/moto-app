// Cargamos las variables del archivo .env para poder usarlas en este archivo
// Esto tiene que ir lo primero, antes de cualquier otra cosa que las necesite
require('dotenv').config();

// Importamos "Pool" de la librería pg
// Pool maneja un conjunto de conexiones a la base de datos de forma eficiente
const { Pool } = require('pg');

// Creamos una nueva instancia de conexión, usando la URL guardada en .env
// process.env.DATABASE_URL lee esa variable que definimos en el archivo .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Función async porque consultar una base de datos toma tiempo
// (no es instantáneo, hay que esperar la respuesta del servidor)
async function probarConexion() {
  try {
    // Mandamos una consulta SQL simple: pedimos la hora actual del servidor
    // Es una consulta clásica para "probar que la conexión funciona"
    const resultado = await pool.query('SELECT NOW()');

    // Si llegamos acá, la conexión funcionó
    console.log('✅ Conexión exitosa');
    console.log('Hora del servidor:', resultado.rows[0].now);
  } catch (error) {
    // Si algo falla (contraseña mal, host incorrecto, problema de red), cae acá
    console.log('❌ Error de conexión:', error.message);
  } finally {
    // Cerramos el pool de conexiones, hayamos tenido éxito o no
    // Si no hacés esto, el script se queda "colgado" sin terminar
    await pool.end();
  }
}

// Ejecutamos la función que definimos arriba
probarConexion(); 