1. Créer le projet avec npm init -y
2. Installer express mysql2 dotenv 
3. Créer le fichier middlewares/produitMiddleware.js
4. Créer le fichier routes/produitRoute.js
5. Créer le fichier config/db.js
6. Sur la racine du projet créer le fichier .env
    # Dans le fichier .env, mettre le contenu
        PORT=3000
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=
        DB_NAME=boutique_db

7. CODAGE
     # 1. Dans le fichier db.js créer le pool de connexion
     const mysql = require('mysql2/promise');

        const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'boutique_db'
        });

        module.exports = pool;

    # 2. Dans le fichier produitMiddleware.js Créer la fonction validateProduit (NB : NE PAS OUBLIER EXPORT)
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

    # 3. Dans le fichier produitRoute.js Créer les routes CRUD

            const express = require('express');
        const router = express.Router();
        const pool = require('../config/db');
        const validationProduit = require('../middlewares/produitMiddleware');

        // GET all products
        router.get('/', async (req, res) => {
        try { 
            const [rows] = await pool.execute('SELECT * FROM produits');
            res.json(rows);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
        });

        // GET a product by ID
        router.get('/:id', async (req, res) => {
        const { id } = req.params;
            try {
            const [rows] = await pool.execute('SELECT * FROM produits WHERE id = ?', [id]);
            if (rows.length === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
            }
            res.json(rows[0]);
            } catch (error) {
            console.error('Erreur lors de la récupération du produit :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
        });

        // POST a new product       
        router.post('/', validationProduit, async (req, res) => {
        const { nom, prix, stock } = req.body;
        try { 
            const [result] = await pool.execute(
            'INSERT INTO produits (nom, prix, stock) VALUES (?, ?, ?)',
            [nom, prix, stock]
            );
            res.status(201).json({ id: result.insertId, nom, prix, stock });
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }     
        });

        // PUT (update) a product by ID
        router.put('/:id', validationProduit, async (req, res) => {
        const { id } = req.params;        
            const { nom, prix, stock } = req.body;
            try {
                const [result] = await pool.execute(
                    'UPDATE produits SET nom = ?, prix = ?, stock = ? WHERE id = ?',
                    [nom, prix, stock, id]
                );
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Produit non trouvé' });
                }
                res.json({ id, nom, prix, stock });
            } catch (error) {
                console.error('Erreur lors de la mise à jour du produit :', error);
                res.status(500).json({ message: 'Erreur interne du serveur' });
            }   
        });

        // DELETE a product by ID
        router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await pool.execute('DELETE FROM produits WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
            }
            res.json({ message: 'Produit supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du produit :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
        });

        module.exports = router;

   # 4. Tester sur postman
   # 5. Créer le fichier public/index.html pour consommer l'api
        


    
