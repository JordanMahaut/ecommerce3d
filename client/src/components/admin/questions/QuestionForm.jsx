import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_FORM = {
  label: "",
  description: "",
  placeholder: "",
  type: "TEXT",
  required: false,
  active: true,
  options: [],
};

const QUESTION_TYPES = [
  { value: "TEXT", label: "Texte" },
  { value: "TEXTAREA", label: "Zone de texte" },
  { value: "SELECT", label: "Liste déroulante" },
  { value: "RADIO", label: "Boutons radio" },
  { value: "CHECKBOX", label: "Cases à cocher" },
  { value: "FILE", label: "Fichier" },
  { value: "COLOR", label: "Couleur" },
  { value: "DIMENSIONS", label: "Dimensions" },
];

const TYPES_WITH_OPTIONS = ["SELECT", "RADIO", "CHECKBOX"];

export default function QuestionForm({
  open,
  onOpenChange,
  question,
  onSubmit,
  isSubmitting = false,
}) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [optionsText, setOptionsText] = useState("");

  const isEditing = Boolean(question);

  useEffect(() => {
    if (!open) return;

    if (question) {
      setForm({
        label: question.label ?? "",
        description: question.description ?? "",
        placeholder: question.placeholder ?? "",
        type: question.type ?? "TEXT",
        required: Boolean(question.required),
        active: question.active ?? true,
        options: Array.isArray(question.options) ? question.options : [],
      });

      setOptionsText(
        Array.isArray(question.options) ? question.options.join("\n") : "",
      );
    } else {
      setForm(DEFAULT_FORM);
      setOptionsText("");
    }
  }, [open, question]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      ...form,
      label: form.label.trim(),
      description: form.description.trim() || null,
      placeholder: form.placeholder.trim() || null,
      options: TYPES_WITH_OPTIONS.includes(form.type)
        ? optionsText
            .split("\n")
            .map((option) => option.trim())
            .filter(Boolean)
        : [],
    };

    onSubmit(payload);
  }

  const hasOptions = TYPES_WITH_OPTIONS.includes(form.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la question" : "Nouvelle question"}
          </DialogTitle>

          <DialogDescription>
            Configurez la question affichée dans le formulaire de demande de
            devis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-label">Libellé</Label>

            <Input
              id="question-label"
              value={form.label}
              onChange={(event) => updateField("label", event.target.value)}
              placeholder="Exemple : Quel matériau souhaitez-vous ?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-description">Description</Label>

            <Textarea
              id="question-description"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Texte d'aide affiché sous la question"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-placeholder">Placeholder</Label>

            <Input
              id="question-placeholder"
              value={form.placeholder}
              onChange={(event) =>
                updateField("placeholder", event.target.value)
              }
              placeholder="Exemple : Saisissez votre réponse"
            />
          </div>

          <div className="space-y-2">
            <Label>Type de question</Label>

            <Select
              value={form.type}
              onValueChange={(value) => updateField("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>

              <SelectContent>
                {QUESTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasOptions && (
            <div className="space-y-2">
              <Label htmlFor="question-options">Options</Label>

              <Textarea
                id="question-options"
                value={optionsText}
                onChange={(event) => setOptionsText(event.target.value)}
                placeholder={"PLA\nPETG\nABS"}
                rows={6}
              />

              <p className="text-xs text-muted-foreground">
                Ajoutez une option par ligne.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="question-required">Obligatoire</Label>

                <p className="text-xs text-muted-foreground">
                  Le client devra répondre.
                </p>
              </div>

              <Switch
                id="question-required"
                checked={form.required}
                onCheckedChange={(checked) =>
                  updateField("required", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="question-active">Active</Label>

                <p className="text-xs text-muted-foreground">
                  Afficher cette question.
                </p>
              </div>

              <Switch
                id="question-active"
                checked={form.active}
                onCheckedChange={(checked) => updateField("active", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !form.label.trim()}
            >
              {isSubmitting
                ? "Enregistrement..."
                : isEditing
                  ? "Enregistrer"
                  : "Créer la question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}