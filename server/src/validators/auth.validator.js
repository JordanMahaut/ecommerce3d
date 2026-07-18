const { z } = require("zod");

const registerSchema = z.object({
  firstname: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),

  lastname: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),

  email: z
    .email("Email invalide"),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

const loginSchema = z.object({
  email: z
    .email("Email invalide"),

  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire"),
});

module.exports = {
  registerSchema,
  loginSchema,
};