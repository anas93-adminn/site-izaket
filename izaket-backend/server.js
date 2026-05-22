import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import User from "./models/User.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARES ================= */

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.static("public"));
app.use(express.static(path.resolve("public")));

/* ================= MONGODB ================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {
  try {

    const { username, email, password } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      message: "Compte créé avec succès",
      token
    });

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Envoi de la réponse au front-end pour stocker dans localStorage
    return res.json({
      message: "Connexion réussie",
      token,  // <-- Très important pour ton login.js
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("Serveur OK");
});

import verifyToken from "./middlewares/auth.js";

app.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Accès autorisé",
    user: req.user
  });
});

app.get("/test", (req, res) => {
  res.send("serveur OK");
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

