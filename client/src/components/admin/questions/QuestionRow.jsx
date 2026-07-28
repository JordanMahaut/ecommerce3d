import { GripVertical, Pencil, Trash2 } from "lucide-react";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import QuestionTypeBadge from "./QuestionTypeBadge";

export default function QuestionRow({
  question,
  onEdit,
  onDelete,
}) {
  return (
    <TableRow>
      <TableCell className="w-12">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
      </TableCell>

      <TableCell className="font-medium">
        {question.label}
      </TableCell>

      <TableCell>
        <QuestionTypeBadge type={question.type} />
      </TableCell>

      <TableCell>
        <Badge variant={question.required ? "default" : "secondary"}>
          {question.required ? "Oui" : "Non"}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge variant={question.active ? "default" : "outline"}>
          {question.active ? "Active" : "Inactive"}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(question)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(question)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}