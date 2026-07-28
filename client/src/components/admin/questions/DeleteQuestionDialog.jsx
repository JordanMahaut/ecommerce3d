import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteQuestionDialog({
  open,
  onOpenChange,
  question,
  onConfirm,
  isDeleting = false,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Supprimer cette question ?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Cette action est irréversible.

            {question && (
              <>
                <br />
                <br />
                <strong>{question.label}</strong> sera définitivement supprimée.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isDeleting}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}