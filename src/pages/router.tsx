import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import LoadingPage from "@/pages/loading";

const GlobalLayout = lazy(() => import("@/pages/layout"));
const PrivateLayout = lazy(() => import("@/pages/private/layout"));
const HomePage = lazy(() => import("@/pages/private/home"));
const LoginPage = lazy(() => import("@/pages/public/login"));
const NotFoundPage = lazy(() => import("@/pages/public/not-found"));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<GlobalLayout />}>
            <Route element={<PrivateLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
