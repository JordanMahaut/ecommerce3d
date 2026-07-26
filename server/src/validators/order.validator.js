const { z } = require("zod");

const optionalText = (maxLength) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .or(z.literal(""));

const addressSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100),

  lastname: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100),

  company: optionalText(150),

  street: z
    .string()
    .trim()
    .min(3, "L’adresse est obligatoire")
    .max(255),

  street2: optionalText(255),

  postalCode: z
    .string()
    .trim()
    .min(2, "Le code postal est obligatoire")
    .max(20),

  city: z
    .string()
    .trim()
    .min(2, "La ville est obligatoire")
    .max(150),

  country: z
    .string()
    .trim()
    .min(2, "Le pays est obligatoire")
    .max(100),

  phone: optionalText(30),
});

const orderSchema = z
  .object({
    customerEmail: z
      .string()
      .trim()
      .email("L’adresse e-mail est invalide"),

    customerNote: optionalText(2000),

    shippingMethod: z.enum(
      ["COLISSIMO", "MONDIAL_RELAY", "CHRONOPOST", "PICKUP"],
      {
        message: "Le mode de livraison est invalide",
      },
    ),

    relayPointId: optionalText(100),
    relayPointName: optionalText(255),

    shippingAddress: addressSchema,
    billingAddress: addressSchema,

    items: z
      .array(
        z.object({
          productId: z.coerce
            .number()
            .int("L’identifiant du produit est invalide")
            .positive("L’identifiant du produit est invalide"),

          quantity: z.coerce
            .number()
            .int("La quantité doit être un nombre entier")
            .min(1, "La quantité minimale est de 1")
            .max(100, "La quantité maximale est de 100"),
        }),
      )
      .min(1, "Le panier est vide")
      .max(100, "Le panier contient trop de produits"),
  })
  .superRefine((data, context) => {
    if (data.shippingMethod === "MONDIAL_RELAY") {
      if (!data.relayPointId) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["relayPointId"],
          message: "Le point relais est obligatoire",
        });
      }

      if (!data.relayPointName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["relayPointName"],
          message: "Le nom du point relais est obligatoire",
        });
      }
    }
  });

module.exports = {
  orderSchema,
};