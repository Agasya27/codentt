import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DSALanding from "./pages/DSALanding";
import DSACompany from "./pages/DSACompany";
import DBMSLanding from "./pages/DBMSLanding";
import DBMSCompany from "./pages/DBMSCompany";
import HRLanding from "./pages/HRLanding";
import ResumeLanding from "./pages/ResumeLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dsa" element={<DSALanding />} />
          <Route path="/dsa/:company" element={<DSACompany />} />
          <Route path="/dbms" element={<DBMSLanding />} />
          <Route path="/dbms/:company" element={<DBMSCompany />} />
          <Route path="/hr" element={<HRLanding />} />
          <Route path="/resume" element={<ResumeLanding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
