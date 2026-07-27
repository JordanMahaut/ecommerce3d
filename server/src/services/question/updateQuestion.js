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

async function updateQuestion(id, data) {
  const questionId = Number(id);

  if (!Number.isInteger(questionId) || questionId <= 0) {
    throw new Error("L’identifiant de la question est invalide.");
  }

  const existingQuestion = await prisma.quoteQuestion.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!existingQuestion) {
    throw new Error("Question introuvable.");
  }

  const {
    label,
    description,
    type,
    options,
    isRequired,
    isActive,
    position,
  } = data;

  if (
    label !== undefined &&
    (typeof label !== "string" || !label.trim())
  ) {
    throw new Error("Le libellé de la question ne peut pas être vide.");
  }

  if (type !== undefined && !ALLOWED_TYPES.includes(type)) {
    throw new Error("Le type de question est invalide.");
  }

  const finalType = type ?? existingQuestion.type;
  const finalOptions =
    options !== undefined ? options : existingQuestion.options;

  if (
    ["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(finalType) &&
    (!Array.isArray(finalOptions) || finalOptions.length === 0)
  ) {
    throw new Error(
      "Les questions à choix doivent contenir au moins une option."
    );
  }

  return prisma.quoteQuestion.update({
    where: {
      id: questionId,
    },
    data: {
      ...(label !== undefined && {
        label: label.trim(),
      }),

      ...(description !== undefined && {
        description: description?.trim() || null,
      }),

      ...(type !== undefined && {
        type,
      }),

      ...((type !== undefined || options !== undefined) && {
        options: ["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(finalType)
          ? finalOptions
          : null,
      }),

      ...(isRequired !== undefined && {
        isRequired: Boolean(isRequired),
      }),

      ...(isActive !== undefined && {
        isActive: Boolean(isActive),
      }),

      ...(position !== undefined && {
        position: Number.isInteger(position)
          ? position
          : existingQuestion.position,
      }),
    },
  });
}

module.exports = {
  updateQuestion,
};