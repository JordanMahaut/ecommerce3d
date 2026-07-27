import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Boxes,
  ClipboardList,
  FileQuestion,
  FolderTree,
  Gauge,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAuth } from "@/context/AuthContext";

const navigation = [
  {
    label: "Tableau de bord",
    path: "/admin",
    icon: Gauge,
    end: true,
  },
  {
    label: "Produits",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Catégories",
    path: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Commandes",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Devis",
    path: "/admin/quotes",
    icon: MessageSquareText,
  },
  {
    label: "Questionnaire",
    path: "/admin/questions",
    icon: FileQuestion,
  },
  {
    label: "Utilisateurs",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Paramètres",
    path: "/admin/settings",
    icon: Settings,
  },
];

function getPageTitle(pathname) {
  const currentRoute = navigation.find((item) => {
    if (item.end) {
      return pathname === item.path;
    }

    return pathname.startsWith(item.path);
  });

  return currentRoute?.label || "Administration";
}

function AdminNavigation({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")
            }
          >
            <Icon className="size-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function AdminLogo() {
  return (
    <NavLink
      to="/admin"
      className="flex items-center gap-3 px-5 py-5"
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Boxes className="size-6" />
      </div>

      <div>
        <p className="font-semibold leading-none">3D Factory</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Administration
        </p>
      </div>
    </NavLink>
  );
}

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const pageTitle = getPageTitle(location.pathname);

  const initials = `${user?.firstname?.[0] || ""}${
    user?.lastname?.[0] || ""
  }`.toUpperCase() || "AD";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Sidebar ordinateur */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background lg:flex">
        <AdminLogo />

        <div className="border-t" />

        <AdminNavigation />

        <div className="border-t p-4">
          <div className="rounded-xl bg-muted p-3">
            <p className="text-sm font-medium">
              {user?.firstname || "Administrateur"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email || "admin@3dfactory.fr"}
            </p>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            {/* Menu mobile */}
            <Sheet
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            >
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Ouvrir le menu"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex w-72 flex-col p-0"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation administrateur</SheetTitle>
                </SheetHeader>

                <div className="flex items-center justify-between">
                  <AdminLogo />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-3"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Fermer le menu"
                  >
                    <X className="size-5" />
                  </Button>
                </div>

                <div className="border-t" />

                <AdminNavigation
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-lg font-semibold md:text-xl">
                {pageTitle}
              </h1>

              <p className="hidden text-sm text-muted-foreground sm:block">
                Gérez votre boutique 3D Factory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative"
            >
              <Bell className="size-5" />

              <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="h-auto gap-2 px-2 py-1.5"
                  />
                }
              >
                <Avatar className="size-9">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="hidden text-left md:block">
                  <p className="max-w-32 truncate text-sm font-medium">
                    {user?.firstname || "Administrateur"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Administrateur
                  </p>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  Mon compte
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                >
                  <ClipboardList className="size-4" />
                  Mon profil
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/")}
                >
                  <Boxes className="size-4" />
                  Voir la boutique
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}