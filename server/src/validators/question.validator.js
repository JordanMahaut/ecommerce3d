const { z } = require("zod");

const questionTypes = [
  "TEXT",
  "TEXTAREA",
  "NUMBER",
  "EMAIL",
  "PHONE",
  "SELECT",
  "RADIO",
  "CHECKBOX",
  "FILE",
  "COLOR",
  "DIMENSIONS",
];

const questionSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Le libellé est obligatoire."),

  description: z.string().optional().nullable(),

  placeholder: z.string().optional().nullable(),

  type: z.enum(questionTypes),

  required: z.coerce.boolean().default(false),

  active: z.coerce.boolean().default(true),

  position: z.coerce.number().int().min(0),

  options: z.any().optional(),

  validation: z.any().optional(),
});

const updateQuestionSchema = questionSchema.partial();

module.exports = {
  questionSchema,
  updateQuestionSchema,
};