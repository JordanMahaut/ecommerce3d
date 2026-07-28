import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import QuestionRow from "./QuestionRow";

export default function QuestionTable({
  questions = [],
  isLoading = false,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        Chargement des questions...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <span className="sr-only">Ordre</span>
            </TableHead>

            <TableHead>Libellé</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Obligatoire</TableHead>
            <TableHead>Statut</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-40 text-center text-muted-foreground"
              >
                Aucune question n’a encore été créée.
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question) => (
              <QuestionRow
                key={question.id}
                question={question}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}