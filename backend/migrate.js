// Cargamos las variables del .env (necesitamos DATABASE_URL)
require('dotenv').config();

// "fs" es el módulo nativo de Node para trabajar con archivos (file system)
// No hay que instalarlo, viene incluido en Node por defecto
const fs = require('fs');

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrar() {
  try {
    // Leemos el contenido del archivo schema.sql como texto plano
    // 'utf8' especifica la codificación, para que se lea como texto legible y no como bytes crudos
    const sql = fs.readFileSync('./schema.sql', 'utf8');

    console.log('Ejecutando schema.sql...');

    // Le mandamos todo el contenido del archivo a Postgres para que lo ejecute
    // pg permite mandar varias instrucciones SQL separadas por ";" en un solo .query()
    await pool.query(sql);

    console.log('✅ Tablas creadas correctamente');
  } catch (error) {
    console.log('❌ Error al crear las tablas:', error.message);
  } finally {
    await pool.end();
  }
}

migrar();