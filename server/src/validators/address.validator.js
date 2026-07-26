import { z } from "zod";

const addressTypes = ["SHIPPING", "BILLING"];

export const createAddressSchema = z.object({
  type: z.enum(addressTypes, {
    message: "Le type d'adresse est invalide.",
  }),

  firstname: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(100, "Le prénom est trop long."),

  lastname: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100, "Le nom est trop long."),

  company: z
    .string()
    .trim()
    .max(150, "Le nom de l'entreprise est trop long.")
    .optional()
    .nullable(),

  street: z
    .string()
    .trim()
    .min(3, "L'adresse doit contenir au moins 3 caractères.")
    .max(255, "L'adresse est trop longue."),

  street2: z
    .string()
    .trim()
    .max(255, "Le complément d'adresse est trop long.")
    .optional()
    .nullable(),

  postalCode: z
    .string()
    .trim()
    .min(2, "Le code postal est invalide.")
    .max(20, "Le code postal est trop long."),

  city: z
    .string()
    .trim()
    .min(2, "La ville doit contenir au moins 2 caractères.")
    .max(150, "Le nom de la ville est trop long."),

  country: z
    .string()
    .trim()
    .min(2, "Le pays est obligatoire.")
    .max(100, "Le nom du pays est trop long.")
    .default("France"),

  phone: z
    .string()
    .trim()
    .max(30, "Le numéro de téléphone est trop long.")
    .optional()
    .nullable(),

  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addressIdSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive("L'identifiant de l'adresse est invalide."),
});