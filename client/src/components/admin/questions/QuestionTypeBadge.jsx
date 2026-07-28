import { Badge } from "@/components/ui/badge";

const TYPES = {
  TEXT: {
    label: "Texte",
    variant: "default",
  },
  TEXTAREA: {
    label: "Zone de texte",
    variant: "secondary",
  },
  SELECT: {
    label: "Liste",
    variant: "outline",
  },
  RADIO: {
    label: "Radio",
    variant: "secondary",
  },
  CHECKBOX: {
    label: "Cases à cocher",
    variant: "outline",
  },
  FILE: {
    label: "Fichier",
    variant: "destructive",
  },
  COLOR: {
    label: "Couleur",
    variant: "default",
  },
  DIMENSIONS: {
    label: "Dimensions",
    variant: "secondary",
  },
};

export default function QuestionTypeBadge({ type }) {
  const questionType = TYPES[type];

  if (!questionType) {
    return <Badge variant="outline">Inconnu</Badge>;
  }

  return (
    <Badge variant={questionType.variant}>
      {questionType.label}
    </Badge>
  );
}