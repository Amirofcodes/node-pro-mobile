const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = function(req, res, next) {
  // Récupération du token depuis le header Authorization
  const token = req.header('Authorization')?.split(' ')[1];
  
  // Vérification de la présence du token
  if (!token) {
    return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajout des informations de l'utilisateur décodées à la requête
    req.user = decoded.user;
    next();
  } catch (err) {
    // En cas de token invalide, renvoyer une erreur
    res.status(401).json({ msg: 'Token non valide' });
  }
};