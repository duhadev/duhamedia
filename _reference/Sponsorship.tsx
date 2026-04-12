import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Mail } from "lucide-react";

export default function Sponsorship() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-primary py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"
            >
              Community Impact
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-6 italic tracking-tighter">
              PARTNER <span className="text-accent">WITH YMS</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed font-medium">
              Join us in providing fertile ground for the next generation. Professional partnerships for meaningful community growth.
            </p>
          </div>
        </section>

        {/* Sponsorship Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Community Sponsor */}
              <div className="relative bg-secondary/30 rounded-3xl p-8 border border-border flex flex-col hover-lift">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground mb-4">Community Sponsor</h3>
                  <div className="text-4xl font-display font-bold text-primary">$500</div>
                  <div className="text-sm text-muted-foreground">per season*</div>
                  <p className="mt-4 text-sm text-muted-foreground italic">Best for small businesses</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "Logo placement on YMS sponsor materials",
                    "Logo on YMS website sponsor page",
                    "Group social media recognition",
                    "Community supporter acknowledgment",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 bg-accent/20 text-accent rounded-full p-0.5">
                        <Zap size={12} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12">
                  Learn More!
                </Button>
              </div>

              {/* Premier Partner */}
              <div className="relative bg-primary rounded-3xl p-8 border border-primary text-white flex flex-col transform md:scale-110 shadow-2xl z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Impact
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-white/70 mb-4">Premier Partner</h3>
                  <div className="text-5xl font-display font-bold text-white">$2500</div>
                  <div className="text-sm text-white/60">per season*</div>
                  <p className="mt-4 text-sm text-white/80 italic">Best for organizations seeking community visibility</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "Primary logo placement",
                    "\"Presented by\" naming association",
                    "Event banner placement (where applicable)",
                    "Featured social media posts",
                    "Verbal recognition at programs and events",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                      <div className="mt-1 bg-accent text-white rounded-full p-0.5">
                        <Zap size={12} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-4 text-center">
                  <Button className="w-full rounded-full bg-accent hover:bg-accent/90 text-white font-bold h-14 text-lg border-0">
                    Learn More!
                  </Button>
                  <div className="text-sm font-bold text-white/80">(920) 257-3464</div>
                </div>
              </div>

              {/* Program Partner */}
              <div className="relative bg-secondary/30 rounded-3xl p-8 border border-border flex flex-col hover-lift">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground mb-4">Program Partner</h3>
                  <div className="text-4xl font-display font-bold text-primary">$1500</div>
                  <div className="text-sm text-muted-foreground">per season*</div>
                  <p className="mt-4 text-sm text-muted-foreground italic">Best for established local brands</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "Sponsorship of a specific program, or age group",
                    "Featured logo placement on program materials",
                    "Individual social media highlight",
                    "Program-level recognition throughout the season",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 bg-accent/20 text-accent rounded-full p-0.5">
                        <Zap size={12} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold h-12">
                  Learn More!
                </Button>
              </div>
            </div>

            {/* Guidelines Section */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-secondary/20 rounded-3xl p-10 md:p-16 border border-border">
                <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">YMS Sponsorship Guidelines</h2>
                <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    YMS Sponsorships operate on a seasonal basis. Each sponsorship applies to a single season (Spring, Summer, Fall, or Winter) and grants sponsor recognition for the full duration of that season across all active YMS programs.
                  </p>
                  <p>
                    This structure ensures clarity, alignment, and fairness. Sponsors support the programs, events, and athletes running within the selected season without committing to undefined long-term obligations.
                  </p>
                  <p>
                    Only essential deliverables are displayed publicly. These are intentionally limited to ensure consistency and avoid overpromising while still providing meaningful visibility.
                  </p>
                  
                  <div className="bg-white/50 rounded-2xl p-8 border border-white/40 space-y-4">
                    <h3 className="text-xl font-display font-bold text-primary">Seasonal sponsorship recognition includes:</h3>
                    <ul className="space-y-3 list-disc pl-5">
                      <li>Brand presence across active seasonal materials</li>
                      <li>Digital recognition on YMS platforms during the season</li>
                      <li>Association with all YMS leagues, camps, or events running in that season</li>
                    </ul>
                  </div>

                  <p>
                    Exact placements may vary depending on the number and type of programs active during that season but remain limited to that season only.
                  </p>
                  <p>
                    Sponsorships do not automatically renew. Sponsors may opt to renew for additional seasons independently based on availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
