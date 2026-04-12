import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProgramCard } from "@/components/ProgramCard";
import { ProgramType } from "@/lib/mockData";
import { usePrograms } from "@/lib/ProgramsContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";

export default function Programs() {
  const { programs } = usePrograms();
  const [filter, setFilter] = useState<ProgramType | "All">("All");

  const filteredPrograms = filter === "All" 
    ? programs 
    : programs.filter(p => p.type === filter);

  const filters = ["All", "Clinic", "Camp", "League", "Tournament"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <section className="bg-primary py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"
          >
            Excellence in Motion
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-6 italic tracking-tighter">
            OUR <span className="text-accent">PROGRAMS</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
            Professional training. Character building. Community focus. Find the perfect program for your athlete.
          </p>
        </div>
      </section>

      <main className="flex-grow py-12 container mx-auto px-4">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 sticky top-20 z-30 bg-background/95 backdrop-blur py-4 border-b">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter size={20} className="text-muted-foreground mr-2 shrink-0" />
            {filters.map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f as any)}
                className="rounded-full shrink-0"
              >
                {f}
              </Button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredPrograms.length} results
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredPrograms.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No programs found for this category.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
