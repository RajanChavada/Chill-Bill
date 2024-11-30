import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { loadUserPreferences } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth0();
  const preferences = loadUserPreferences();
  const displayName =
    preferences?.firstName || user?.name?.split(" ")[0] || "User";

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-primary">
            Chill Bill
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.picture} alt={displayName} />
                  <AvatarFallback>
                    {displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="p-8 bg-gradient-to-r from-cyan-50 to-blue-200">{children}</main>
      </div>
    </>
  );
};

export default MainLayout;
