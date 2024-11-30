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
import { useRef } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth0();
  const preferences = loadUserPreferences();
  const displayName =
    preferences?.firstName || user?.name?.split(" ")[0] || "User";
  const dashboardRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const discussionBoardRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 shadow-md">
          <h1 className="text-xl font-semibold text-primary">
            Chill-Bill

          </h1>

          <nav className="flex space-x-4">
            <Button variant="link" onClick={() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth' })}>Dashboard</Button>
            <Button variant="link" onClick={() => calendarRef.current?.scrollIntoView({ behavior: 'smooth' })}>Calendar</Button>
            <Button variant="link" onClick={() => discussionBoardRef.current?.scrollIntoView({ behavior: 'smooth' })}>Discussion Board</Button>
            <Button variant="link">Spending Analysis</Button>
          </nav>

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

        <main className="p-8">
          <div ref={dashboardRef}>{/* Dashboard Section */}</div>
          <div ref={calendarRef}>{/* Calendar Section */}</div>
          <div ref={discussionBoardRef}>{/* Discussion Board Section */}</div>
          {children}
        </main>

      </div>
    </>
  );
};

export default MainLayout;
