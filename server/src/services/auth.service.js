const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

async function register(data) {
  const { firstname, lastname, email, password } = data;

  // Vérifie si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé.");
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création de l'utilisateur
  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      email,
      password: hashedPassword,
    },
  });

  // On ne renvoie jamais le mot de passe
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

async function login(data) {
  const { email, password } = data;

  // Recherche de l'utilisateur
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  // Vérification du mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  // Génération du JWT
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // On ne renvoie jamais le mot de passe
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  return user;
}

module.exports = {
  register,
  login,
  getProfile,
};