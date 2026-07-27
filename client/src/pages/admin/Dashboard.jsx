import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDashboard from "@/hooks/useDashboard";
import {
  Euro,
  FolderTree,
  MessageSquareText,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const { stats, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Chargement du tableau de bord...
      </div>
    );
  }

  const cards = [
    {
      title: "Produits",
      value: stats?.products ?? 0,
      icon: Package,
    },
    {
      title: "Catégories",
      value: stats?.categories ?? 0,
      icon: FolderTree,
    },
    {
      title: "Commandes",
      value: stats?.orders ?? 0,
      icon: ShoppingCart,
    },
    {
      title: "Devis",
      value: stats?.quotes ?? 0,
      icon: MessageSquareText,
    },
    {
      title: "Utilisateurs",
      value: stats?.users ?? 0,
      icon: Users,
    },
    {
      title: "Chiffre d'affaires",
      value: `${stats?.revenue ?? 0} €`,
      icon: Euro,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Tableau de bord
        </h1>

        <p className="text-muted-foreground">
          Bienvenue dans l'administration de votre boutique.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>

                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}