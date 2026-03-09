import express from 'express';
import { pool } from '../main.js';

const router = express.Router();

// Create a new Role
router.post('/role', async (req, res) => {
  try {
    const { id, nom } = req.body;
    
    const query = 'INSERT INTO "Role" (id, nom) VALUES ($1, $2) RETURNING *;';
    const result = await pool.query(query, [id, nom]);
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Roles
router.get('/role', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Role" ORDER BY id;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Role by ID
router.get('/role/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Role" WHERE id = $1;', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Role
router.put('/role/:id', async (req, res) => {
  try {
    const { nom } = req.body;
    
    const query = 'UPDATE "Role" SET nom = COALESCE($1, nom) WHERE id = $2 RETURNING *;';
    const result = await pool.query(query, [nom, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Role
router.delete('/role/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM "Role" WHERE id = $1 RETURNING *;', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json({ message: 'Role deleted successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
