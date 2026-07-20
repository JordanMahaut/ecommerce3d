const { z } = require("zod");

const productSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Le nom est trop long"),

  slug: z
    .string()
    .min(2, "Le slug est obligatoire")
    .max(140, "Le slug est trop long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets",
    ),

  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),

  price: z.coerce
    .number()
    .positive("Le prix doit être supérieur à 0"),

  stock: z.coerce
    .number()
    .int("Le stock doit être un nombre entier")
    .min(0, "Le stock ne peut pas être négatif"),

  image: z
    .string()
    .url("L’image doit être une URL valide")
    .optional()
    .nullable(),

  gallery: z
    .array(z.string().url("Chaque image doit être une URL valide"))
    .optional()
    .nullable(),

  featured: z.coerce.boolean().optional().default(false),

  isActive: z.coerce.boolean().optional().default(true),

  categoryId: z.coerce
    .number()
    .int("La catégorie est invalide")
    .positive("La catégorie est obligatoire"),
});

const updateProductSchema = productSchema.partial();

module.exports = {
  productSchema,
  updateProductSchema,
};