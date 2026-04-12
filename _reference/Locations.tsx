import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocationCard } from "@/components/LocationCard";
import { locations } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function Locations() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-primary py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"
            >
              Find Your Home Field
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-6 italic tracking-tighter">
              OUR <span className="text-accent">LOCATIONS</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
              We operate across Chicago, Dallas, and Virginia. Find a YMS community near you.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-24">

          <div className="grid grid-cols-1 gap-12">
            {locations.map((loc, index) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-muted/20 rounded-3xl p-6 md:p-12 border">
                  <div className="order-2 md:order-1 space-y-6">
                    <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      Now Open
                    </div>
                    <h2 className="text-4xl font-display font-bold">{loc.city}, {loc.state}</h2>
                    <p className="text-muted-foreground">
                      Our {loc.city} facility features state-of-the-art fields and courts tailored for youth development.
                      Home to over {loc.programsAvailable * 50} active athletes.
                    </p>
                    <div className="space-y-2">
                      <div className="font-bold">Featured Sports:</div>
                      <div className="flex gap-2 flex-wrap">
                        {["Soccer", "Basketball", "Tennis", "Volleyball"].map(sport => (
                          <span key={sport} className="px-3 py-1 bg-white border rounded-md text-sm">
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <LocationCard location={loc} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
