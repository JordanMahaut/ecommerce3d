function admin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "Utilisateur non authentifié.",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Accès interdit.",
    });
  }

  next();
}

module.exports = admin;