import express from 'express';
import { pool } from '../main.js';

const router = express.Router();

// Create a new TypeConge
router.post('/typeconge', async (req, res) => {
  try {
    const { id, nom, jours_par_defaut } = req.body;
    
    const query = `
      INSERT INTO "TypeConge" (id, nom, jours_par_defaut)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    
    const result = await pool.query(query, [id, nom, jours_par_defaut || 0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all TypeConges
router.get('/typeconge', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "TypeConge" ORDER BY id;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get TypeConge by ID
router.get('/typeconge/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "TypeConge" WHERE id = $1;', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'TypeConge not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update TypeConge
router.put('/typeconge/:id', async (req, res) => {
  try {
    const { nom, jours_par_defaut } = req.body;
    
    const query = `
      UPDATE "TypeConge" 
      SET nom = COALESCE($1, nom),
          jours_par_defaut = COALESCE($2, jours_par_defaut)
      WHERE id = $3
      RETURNING *;
    `;
    
    const result = await pool.query(query, [nom, jours_par_defaut, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'TypeConge not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete TypeConge
router.delete('/typeconge/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM "TypeConge" WHERE id = $1 RETURNING *;', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'TypeConge not found' });
    }
    
    res.json({ message: 'TypeConge deleted successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
