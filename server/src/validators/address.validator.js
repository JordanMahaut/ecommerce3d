const { z } = require("zod");

const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .max(50, "Le nom de l’adresse est trop long")
    .optional()
    .or(z.literal("")),

  type: z.enum(["SHIPPING", "BILLING"], {
    message: "Le type d’adresse est invalide",
  }),

  firstname: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50),

  lastname: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50),

  company: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  street: z
    .string()
    .trim()
    .min(3, "L’adresse est obligatoire")
    .max(150),

  street2: z
    .string()
    .trim()
    .max(150)
    .optional()
    .or(z.literal("")),

  postalCode: z
    .string()
    .trim()
    .regex(/^[0-9A-Za-z -]{3,12}$/, "Le code postal est invalide"),

  city: z
    .string()
    .trim()
    .min(2, "La ville est obligatoire")
    .max(100),

  country: z
    .string()
    .trim()
    .min(2, "Le pays est obligatoire")
    .max(100)
    .default("France"),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("")),

  isDefault: z.boolean().optional().default(false),
});

const updateAddressSchema = addressSchema.partial();

module.exports = {
  addressSchema,
  updateAddressSchema,
};