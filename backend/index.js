// Cargamos las variables del .env (necesitamos DATABASE_URL)
require('dotenv').config();

// Importamos Express, ya instalado con npm install express
const express = require('express');

// Importamos bcrypt para hashear contraseñas
const bcrypt = require('bcrypt');

// Importamos Pool para conectar con la base de datos
const { Pool } = require('pg');

// Creamos la instancia de la aplicación Express
const app = express();

// Puerto donde el servidor va a escuchar conexiones
const PORT = 3000;

// Conexión a la base de datos, usando la URL guardada en .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware: le permite a Express entender JSON en el body de las peticiones
app.use(express.json());

// Ruta de prueba: responde cuando alguien visita "/" con método GET
app.get('/', (req, res) => {
  res.send('¡Funciona! Mi primer servidor con Express 🏍️');
});

// Endpoint de registro: crea un nuevo usuario
app.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, telefono, rol } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, telefono, rol)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, email, rol`,
      [nombre, email, password_hash, telefono, rol]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.log('Error en registro:', error.message);
    res.status(500).json({ error: 'No se pudo registrar el usuario' });
  }
});

// Arranca el servidor en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});