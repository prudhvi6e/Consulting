import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
// Secondary pages load on demand so the home page ships a smaller bundle.
const About = lazy(() => import("@/pages/about"));
const Services = lazy(() => import("@/pages/services"));
const Team = lazy(() => import("@/pages/team"));
const Insights = lazy(() => import("@/pages/insights"));
const ArticleDetail = lazy(() => import("@/pages/article"));
const Careers = lazy(() => import("@/pages/careers"));
const Apply = lazy(() => import("@/pages/apply"));
const Contact = lazy(() => import("@/pages/contact"));
import { AppLayout } from "@/components/layout/AppLayout";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
// scripts/prerender.mjs embeds the CMS responses the page used as window.__CMS__ (keyed by the
// react-query key). Seeding the cache means hydration renders the same images/text as the
// pre-rendered HTML — no flash of bundled fallbacks and no duplicate image downloads.
const seeded = (globalThis as { __CMS__?: Record<string, unknown> }).__CMS__;
if (seeded) for (const [k, v] of Object.entries(seeded)) queryClient.setQueryData(JSON.parse(k), v);
(globalThis as { __QUERY_CACHE__?: () => Record<string, unknown> }).__QUERY_CACHE__ = () => {
  const out: Record<string, unknown> = {};
  for (const q of queryClient.getQueryCache().getAll()) {
    const key = q.queryKey as unknown[];
    if ((key[0] === "cms" || key[0] === "events") && q.state.data !== undefined) out[JSON.stringify(key)] = q.state.data;
  }
  return out;
};

function Router() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/team" component={Team} />
        <Route path="/insights" component={Insights} />
        <Route path="/insights/:slug" component={ArticleDetail} />
        <Route path="/careers" component={Careers} />
        <Route path="/careers/apply" component={Apply} />
        <Route path="/careers/apply/:id" component={Apply} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <SmoothScroll>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </SmoothScroll>
          <Toaster />
        </TooltipProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}

export default App;
