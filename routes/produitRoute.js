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