import Table from "../ui/Table";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function CategoryTable({
  categories,
  onEdit,
  onDelete,
}) {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell header>Nom</Table.Cell>
          <Table.Cell header>Slug</Table.Cell>
          <Table.Cell header>Statut</Table.Cell>
          <Table.Cell header>Actions</Table.Cell>
        </Table.Row>
      </Table.Head>

      <Table.Body>
        {categories.map((category) => (
          <Table.Row key={category.id}>
            <Table.Cell>{category.name}</Table.Cell>

            <Table.Cell>
              <code>{category.slug}</code>
            </Table.Cell>

            <Table.Cell>
              <Badge
                color={
                  category.isActive
                    ? "success"
                    : "danger"
                }
              >
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </Table.Cell>

            <Table.Cell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onEdit(category)}
                >
                  Modifier
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(category)}
                >
                  Supprimer
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default CategoryTable;