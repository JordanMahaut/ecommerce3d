import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import QuestionForm from "@/components/admin/questions/QuestionForm";
import QuestionTable from "@/components/admin/questions/QuestionTable";
import DeleteQuestionDialog from "@/components/admin/questions/DeleteQuestionDialog";

import { useQuestions } from "@/hooks/admin/useQuestions";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "@/hooks/admin/useQuestionMutations";

export default function Questions() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const {
    data: questions = [],
    isLoading,
    isError,
  } = useQuestions();

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  function handleCreate() {
    setSelectedQuestion(null);
    setFormOpen(true);
  }

  function handleEdit(question) {
    setSelectedQuestion(question);
    setFormOpen(true);
  }

  function handleDelete(question) {
    setQuestionToDelete(question);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (!questionToDelete) return;

    deleteMutation.mutate(questionToDelete.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setQuestionToDelete(null);
      },
    });
  }

  function handleSubmit(payload) {
    if (selectedQuestion) {
      updateMutation.mutate(
        {
          id: selectedQuestion.id,
          question: payload,
        },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedQuestion(null);
          },
        },
      );

      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setFormOpen(false);
      },
    });
  }

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Impossible de charger les questions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Questionnaire
          </h1>

          <p className="text-sm text-muted-foreground">
            Gérez les questions du formulaire de demande de devis.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle question
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <QuestionTable
            questions={questions}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <QuestionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setSelectedQuestion(null);
          }
        }}
        question={selectedQuestion}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteQuestionDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open && !deleteMutation.isPending) {
            setQuestionToDelete(null);
          }
        }}
        question={questionToDelete}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}