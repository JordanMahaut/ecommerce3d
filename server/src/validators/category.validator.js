const { z } = require("zod");

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(100),

  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  image: z
    .string()
    .url("URL invalide.")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean().optional(),
});

const updateCategorySchema = categorySchema.partial();

module.exports = {
  categorySchema,
  updateCategorySchema,
};