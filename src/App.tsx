import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartMenu from "./pages/StartMenu";
import Home from "./pages/Home";
import Campaign from "./pages/Campaign";
import SelectTables from "./pages/SelectTables";
import Game from "./pages/Game";
import Results from "./pages/Results";
import RanksPreview from "./pages/RanksPreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartMenu />} />
          <Route path="/practice" element={<Home />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/select-tables" element={<SelectTables />} />
          <Route path="/game" element={<Game />} />
          <Route path="/results" element={<Results />} />
          <Route path="/ranks-preview" element={<RanksPreview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
