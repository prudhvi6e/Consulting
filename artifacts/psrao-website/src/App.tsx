import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Team from "@/pages/team";
import Insights from "@/pages/insights";
import ArticleDetail from "@/pages/article";
import Careers from "@/pages/careers";
import Apply from "@/pages/apply";
import Contact from "@/pages/contact";
import { AppLayout } from "@/components/layout/AppLayout";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
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
