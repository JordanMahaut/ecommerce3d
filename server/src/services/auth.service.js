const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function generateEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return {
    token,
    hashedToken,
  };
}

async function register(data) {
  const { firstname, lastname, email, password } = data;

  const normalizedEmail = email.trim().toLowerCase();

  // Vérifie si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé.");
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Génération du token de vérification
  const { token, hashedToken } =
    generateEmailVerificationToken();

  // Création de l'utilisateur
  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      email: normalizedEmail,
      password: hashedPassword,

      emailVerified: false,
      emailVerificationToken: hashedToken,

      // Le token sera valide pendant 24 heures
      emailVerificationExpires: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
    },
  });

  // On ne renvoie jamais les données sensibles
  const {
    password: _,
    emailVerificationToken: __,
    emailVerificationExpires: ___,
    ...userWithoutSensitiveData
  } = user;

  return {
    user: userWithoutSensitiveData,

    // Token brut destiné à être envoyé par e-mail
    verificationToken: token,
  };
}

async function verifyEmail(token) {
  if (!token) {
    throw new Error("Token de vérification manquant.");
  }

  // On hash le token reçu pour le comparer à celui stocké
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error(
      "Le lien de vérification est invalide ou a expiré."
    );
  }

  const verifiedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  const {
    password: _,
    emailVerificationToken: __,
    emailVerificationExpires: ___,
    ...userWithoutSensitiveData
  } = verifiedUser;

  return userWithoutSensitiveData;
}

async function login(data) {
  const { email, password } = data;

  const normalizedEmail = email.trim().toLowerCase();

  // Recherche de l'utilisateur
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  // Vérification du mot de passe
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  // Optionnel : empêcher la connexion avant validation
  if (!user.emailVerified) {
    throw new Error(
      "Veuillez vérifier votre adresse e-mail avant de vous connecter."
    );
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

  const {
    password: _,
    emailVerificationToken: __,
    emailVerificationExpires: ___,
    ...userWithoutSensitiveData
  } = user;

  return {
    token,
    user: userWithoutSensitiveData,
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
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
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
  verifyEmail,
};