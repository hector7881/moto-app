-- Tabla de usuarios: guarda a todos, sean pasajeros o conductores
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  telefono TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('pasajero', 'conductor')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de conductores: datos extra, solo para usuarios con rol 'conductor'
CREATE TABLE conductores (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER UNIQUE NOT NULL REFERENCES usuarios(id),
  modelo_moto TEXT,
  placa TEXT,
  disponible BOOLEAN DEFAULT false,
  latitud_actual DECIMAL,
  longitud_actual DECIMAL
);

-- Tabla de viajes: el corazón del negocio
CREATE TABLE viajes (
  id SERIAL PRIMARY KEY,
  pasajero_id INTEGER NOT NULL REFERENCES usuarios(id),
  conductor_id INTEGER REFERENCES usuarios(id),
  origen_lat DECIMAL NOT NULL,
  origen_lng DECIMAL NOT NULL,
  destino_lat DECIMAL NOT NULL,
  destino_lng DECIMAL NOT NULL,
  estado TEXT NOT NULL DEFAULT 'solicitado'
    CHECK (estado IN ('solicitado', 'aceptado', 'en_camino', 'en_curso', 'finalizado', 'cancelado')),
  tarifa DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);