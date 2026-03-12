import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const users = [];

router.post("/register", async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({
                message: "email et mot_de_passe sont obligatoires"
            });
        }

        const findUser = users.find((data) => email === data.email);
        if (findUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        users.push({ email, mot_de_passe: hashedPassword });

        res.status(201).json({ message: "Registered successfully!" });
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

        const findUser = users.find((data) => email === data.email);
        if (!findUser) {
            return res.status(400).json({ message: "Wrong email or password!" });
        }

        const passwordMatch = await bcrypt.compare(
            mot_de_passe,
            findUser.mot_de_passe
        );

        if (!passwordMatch) {
            return res.status(400).json({ message: "Wrong email or password!" });
        }

        const token = jwt.sign(
            { email: findUser.email },
            "secret_temporaire",
            { expiresIn: "1d" }
        );

        console.log("Token :", token);

        res.status(200).json({
            message: "Logged in successfully!",
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;