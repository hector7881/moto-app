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


// Import nuevo, junto a los otros require de arriba del archivo
const jwt = require('jsonwebtoken');

// Endpoint de login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos al usuario por su email
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    // Si no se encontró ninguna fila, el usuario no existe
    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const usuario = resultado.rows[0];

    // Comparamos la contraseña que mandaron con el hash guardado
    // bcrypt.compare hashea la contraseña recibida y la compara con el hash existente
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Si llegamos acá, las credenciales son correctas: generamos el token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol }, // datos que viajan dentro del token
      process.env.JWT_SECRET,                // la clave secreta para firmarlo
      { expiresIn: '7d' }                     // el token expira en 7 días
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    console.log('Error en login:', error.message);
    res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
});


// Import nuevo arriba del archivo, junto a los demás require
const verificarToken = require('./middleware/auth');

// Ruta de prueba protegida: solo accesible con un token válido
app.get('/perfil', verificarToken, (req, res) => {
  // Si llegamos hasta acá, el middleware ya verificó el token
  // req.usuario tiene los datos que guardamos en el JWT (id, rol)
  res.json({ mensaje: 'Acceso autorizado', usuario: req.usuario });
});