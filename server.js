const express = require('express');
require('dotenv').config();

const produitRoutes = require('./routes/produitRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(express.json()); // Indispensable pour lire le JSON envoyé dans req.body
app.use(express.urlencoded({ extended: true })); // Pour lire les données envoyées via des formulaires
app.use(express.static('public')); // Pour servir des fichiers statiques (images, CSS, JS, etc.)

// Branchement des routes
app.use('/api/produits', produitRoutes);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
