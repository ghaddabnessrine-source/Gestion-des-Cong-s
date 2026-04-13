import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../main.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, mot_de_passe, role } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({
                message: "email et mot_de_passe sont obligatoires"
            });
        }

        const normalizedRole = String(role || "").toLowerCase();
        // Front: "rh" / "employe"
        // DB enum: "admin" / "employe"
        const dbRole = normalizedRole === "rh" ? "admin" : "employe";

        const [localPart] = String(email).split("@");
        const parts = String(localPart || "")
          .split(/[._-]/g)
          .map((p) => p.trim())
          .filter(Boolean);

        // DB requires NOT NULL fields: provide simple defaults from email.
        const nom = parts[0] ? parts[0] : "Utilisateur";
        const prenom = parts[1] ? parts[1] : "Compte";

        const hashedPassword = await bcrypt.hash(String(mot_de_passe), 10);

        const existing = await pool.query('SELECT id FROM "Utilisateur" WHERE email = $1;', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "User already exists!" });
        }

        await pool.query(
            `
            INSERT INTO "Utilisateur" (nom, prenom, email, mot_de_passe, role, date_embauche)
            VALUES ($1, $2, $3, $4, $5, $6);
            `,
            [nom, prenom, email, hashedPassword, dbRole, new Date()]
        );

        res.status(200).json({ message: "Registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({
                message: "email et mot_de_passe sont obligatoires"
            });
        }

        const dbRes = await pool.query('SELECT id, email, mot_de_passe, role FROM "Utilisateur" WHERE email = $1;', [email]);
        if (dbRes.rows.length === 0) {
            return res.status(400).json({ message: "Wrong email or password!" });
        }

        const findUser = dbRes.rows[0];
        const passwordMatch = await bcrypt.compare(String(mot_de_passe), findUser.mot_de_passe);

        if (!passwordMatch) {
            return res.status(400).json({ message: "Wrong email or password!" });
        }

        const token = jwt.sign(
            { email: findUser.email, id: findUser.id, role: findUser.role },
            "secret_temporaire",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Logged in successfully!",
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;