import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;

type SessionState = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: "fusion-session" },
  ),
);

export const useUser = () => useSessionStore((state) => state.user);
export const useIsAuthenticated = () =>
  useSessionStore((state) => state.user !== null);
