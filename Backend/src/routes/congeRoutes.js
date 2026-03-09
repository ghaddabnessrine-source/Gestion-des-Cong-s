import express from 'express';
import { pool } from '../main.js';

const router = express.Router();

// Create a new Conge
router.post('/conge', async (req, res) => {
  try {
    const { id, id_demandeur, type_conge_id, date_debut, date_fin, statut, motif, commentaire_refus } = req.body;
    
    const query = `
      INSERT INTO "Conge" (id, id_demandeur, type_conge_id, date_debut, date_fin, statut, motif, commentaire_refus)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const result = await pool.query(query, [id, id_demandeur, type_conge_id, date_debut, date_fin, statut || 'en_attente', motif, commentaire_refus]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Conges
router.get('/conge', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Conge" ORDER BY id DESC;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Conge by ID
router.get('/conge/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Conge" WHERE id = $1;', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Conge not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Conge
router.put('/conge/:id', async (req, res) => {
  try {
    const { type_conge_id, date_debut, date_fin, statut, motif, commentaire_refus } = req.body;
    
    const query = `
      UPDATE "Conge" 
      SET type_conge_id = COALESCE($1, type_conge_id),
          date_debut = COALESCE($2, date_debut),
          date_fin = COALESCE($3, date_fin),
          statut = COALESCE($4, statut),
          motif = COALESCE($5, motif),
          commentaire_refus = COALESCE($6, commentaire_refus)
      WHERE id = $7
      RETURNING *;
    `;
    
    const result = await pool.query(query, [type_conge_id, date_debut, date_fin, statut, motif, commentaire_refus, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Conge not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Conge
router.delete('/conge/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM "Conge" WHERE id = $1 RETURNING *;', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Conge not found' });
    }
    
    res.json({ message: 'Conge deleted successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
