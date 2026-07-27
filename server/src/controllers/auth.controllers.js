const {
  register,
  login,
  getProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../services/auth.service");

const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator");

const asyncHandler = require("../utils/asyncHandler");
const { BadRequestError } = require("../errors");

const registerUser = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const user = await register(data);

  res.status(201).json({
    success: true,
    message:
      "Utilisateur créé avec succès. Un e-mail de vérification vous a été envoyé.",
    user,
  });
});

const verifyEmailUser = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await verifyEmail(token);

  res.status(200).json({
    success: true,
    message: "Adresse e-mail vérifiée avec succès.",
    user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const result = await login(data);

  res.status(200).json({
    success: true,
    ...result,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

const forgotPasswordUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("L'adresse e-mail est obligatoire.");
  }

  await forgotPassword(email);

  res.status(200).json({
    success: true,
    message:
      "Si un compte existe avec cette adresse e-mail, un lien de réinitialisation a été envoyé.",
  });
});

const resetPasswordUser = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new BadRequestError(
      "Le token et le nouveau mot de passe sont obligatoires.",
    );
  }

  const result = await resetPassword(token, password);

  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  verifyEmailUser,
  forgotPasswordUser,
  resetPasswordUser,
};