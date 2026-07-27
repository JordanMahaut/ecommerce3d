const prisma = require("../../lib/prisma");

const ALLOWED_TYPES = [
  "TEXT",
  "TEXTAREA",
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "BOOLEAN",
  "NUMBER",
  "FILE",
];

async function createQuestion(data) {
  const {
    label,
    description,
    type,
    options,
    isRequired = false,
    isActive = true,
    position = 0,
  } = data;

  if (!label || typeof label !== "string" || !label.trim()) {
    throw new Error("Le libellé de la question est obligatoire.");
  }

  if (!ALLOWED_TYPES.includes(type)) {
    throw new Error("Le type de question est invalide.");
  }

  if (
    ["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(type) &&
    (!Array.isArray(options) || options.length === 0)
  ) {
    throw new Error(
      "Les questions à choix doivent contenir au moins une option."
    );
  }

  return prisma.quoteQuestion.create({
    data: {
      label: label.trim(),
      description: description?.trim() || null,
      type,
      options:
        ["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(type)
          ? options
          : null,
      isRequired: Boolean(isRequired),
      isActive: Boolean(isActive),
      position: Number.isInteger(position) ? position : 0,
    },
  });
}

module.exports = {
  createQuestion,
};