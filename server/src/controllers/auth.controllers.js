const {
  register,
  login,
  getProfile,
  verifyEmail,
} = require("../services/auth.service");

const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator");

async function registerUser(req, res) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await register(data);

    return res.status(201).json({
      message:
        "Utilisateur créé avec succès. Un e-mail de vérification vous a été envoyé.",
      user,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Données invalides.",
        errors: error.issues,
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }
}

async function verifyEmailUser(req, res) {
  try {
    const { token } = req.body;

    const user = await verifyEmail(token);

    return res.status(200).json({
      message: "Adresse e-mail vérifiée avec succès.",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await login(data);

    return res.status(200).json(result);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Données invalides.",
        errors: error.issues,
      });
    }

    return res.status(401).json({
      message: error.message,
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await getProfile(req.user.id);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  verifyEmailUser,
};