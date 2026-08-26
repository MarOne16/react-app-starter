import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { SwrProvider } from "@/lib/api/swr-config";

export default function GlobalLayout() {
  return (
    <SwrProvider>
      <Outlet />
      <Toaster
        richColors
        toastOptions={{
          className: "!bg-card border border-current!",
          classNames: {
            success: "text-success!",
            error: "text-destructive!",
            loading: "text-primary!",
            info: "text-info!",
          },
        }}
      />
    </SwrProvider>
  );
}
