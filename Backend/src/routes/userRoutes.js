import express from 'express';
import { pool } from '../main.js';

const router = express.Router();

// Create a new Utilisateur
router.post('/user', async (req, res) => {
  try {
    const { id, nom, prenom, email, mot_de_passe, role, date_embauche, solde_conges, jours_alloues_annuellement } = req.body;
    
    const query = `
      INSERT INTO "Utilisateur" (id, nom, prenom, email, mot_de_passe, role, date_embauche, solde_conges, jours_alloues_annuellement)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, nom, prenom, email, role, date_embauche, solde_conges, jours_alloues_annuellement;
    `;
    
    const result = await pool.query(query, [id, nom, prenom, email, mot_de_passe, role || 'employe', date_embauche, solde_conges || 0, jours_alloues_annuellement || 25]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Utilisateurs
router.get('/user', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nom, prenom, email, role, date_embauche, solde_conges, jours_alloues_annuellement FROM "Utilisateur" ORDER BY id;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Utilisateur by ID
router.get('/user/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nom, prenom, email, role, date_embauche, solde_conges, jours_alloues_annuellement FROM "Utilisateur" WHERE id = $1;', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Utilisateur
router.put('/user/:id', async (req, res) => {
  try {
    const { nom, prenom, email, role, date_embauche, solde_conges, jours_alloues_annuellement } = req.body;
    
    const query = `
      UPDATE "Utilisateur" 
      SET nom = COALESCE($1, nom),
          prenom = COALESCE($2, prenom),
          email = COALESCE($3, email),
          role = COALESCE($4, role),
          date_embauche = COALESCE($5, date_embauche),
          solde_conges = COALESCE($6, solde_conges),
          jours_alloues_annuellement = COALESCE($7, jours_alloues_annuellement)
      WHERE id = $8
      RETURNING id, nom, prenom, email, role, date_embauche, solde_conges, jours_alloues_annuellement;
    `;
    
    const result = await pool.query(query, [nom, prenom, email, role, date_embauche, solde_conges, jours_alloues_annuellement, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Utilisateur
router.delete('/user/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM "Utilisateur" WHERE id = $1 RETURNING id, nom, prenom, email;', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur not found' });
    }
    
    res.json({ message: 'Utilisateur deleted successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
