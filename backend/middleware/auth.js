const jwt = require('jsonwebtoken');

// Esta función va a interceptar las peticiones antes de que lleguen a la ruta real
function verificarToken(req, res, next) {
  // El token llega en un header llamado "Authorization", con el formato: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // Si no hay header de Authorization, no hay token, así que rechazamos
  if (!authHeader) {
    return res.status(401).json({ error: 'No se proporcionó token de acceso' });
  }

  // El header viene como "Bearer eyJhbGc...", separamos por espacio y nos quedamos con la segunda parte
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify revisa la firma usando el mismo secreto que usamos para crearlo
    // Si la firma no coincide, o si el token expiró, esto lanza un error automáticamente
    const datosUsuario = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario (id, rol) directamente en el objeto "req"
    // Así, cualquier ruta que use este middleware después puede acceder a req.usuario
    req.usuario = datosUsuario;

    // "next()" le dice a Express "todo bien, dejá pasar la petición a la ruta real"
    next();
  } catch (error) {
    // Si jwt.verify falló (firma inválida, token expirado, token mal formado)
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;