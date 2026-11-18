const validateProduit = (req, res, next) => {
  const { nom, prix, stock } = req.body;
  if (!nom || !prix || stock === undefined) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }
  if (typeof prix !== 'number' || prix <= 0) {
    return res.status(400).json({ message: 'Le prix doit être un nombre positif' });
  }
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ message: 'Le stock doit être un nombre non négatif' });
  } 
  next();
};

module.exports = validateProduit;