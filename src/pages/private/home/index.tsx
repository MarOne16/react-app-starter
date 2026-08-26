import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fusion-uis/ui";
import { useHealth } from "@/hooks/use-health";
import { useSessionStore, useUser } from "@/store/session-store";
import { useThemeStore } from "@/store/theme-store";

export default function HomePage() {
  const user = useUser();
  const signOut = useSessionStore((state) => state.signOut);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const { health, error, isLoading, refresh } = useHealth();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Fusion Starter</h1>
          <p className="text-muted-foreground text-sm">
            Signed in as {user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Theme
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Backend health</CardTitle>
          <CardDescription>
            Fetched with SWR and validated with Zod.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm">
            {isLoading && "Checking…"}
            {error && (
              <span className="text-destructive">Unreachable backend</span>
            )}
            {health && `${health.status} ${health.version ?? ""}`}
          </p>
          <Button variant="secondary" size="sm" onClick={() => refresh()}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
