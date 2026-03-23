import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import FAQPage from "./pages/FAQPage";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
