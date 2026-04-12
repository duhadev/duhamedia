import { TestimonialSlider } from "@/components/TestimonialSlider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProgramCard } from "@/components/ProgramCard";
import { LocationCard } from "@/components/LocationCard";
import { programs, locations } from "@/lib/mockData";
import { usePrograms } from "@/lib/ProgramsContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, Star, MapPin, Shield, Heart, Zap } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImg from "@assets/stock_images/kids_playing_soccer__a37e02ff.jpg";
import actionShot1 from "@assets/WhatsApp_Image_2025-12-17_at_11.15.45_PM_1767568064186.jpeg";
import actionShot2 from "@assets/IMG_1882_1767568064191.jpg";

export default function Home() {
  const { programs } = usePrograms();
  const featuredPrograms = programs.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background z-10" />
          <img 
            src={heroImg} 
            alt="Hero background" 
            className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-accent/90 backdrop-blur-sm text-sm font-bold tracking-wide uppercase shadow-lg text-white">
              Registration Now Open for Summer 2026
            </div>
            <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter mb-6 leading-[0.85] italic text-white text-glow">
              BUILDING <br/> <span className="text-accent">CHAMPIONS</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-medium leading-relaxed drop-shadow-md">
              Developing youth in sports and character. Fostering a strong sense of belonging, positive influences, and athletic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/programs">
                <Button size="lg" className="rounded-full text-lg h-16 px-10 font-bold hover-lift bg-primary hover:bg-primary/90 text-white border-0 shadow-xl shadow-primary/20">
                  Find a Program
                </Button>
              </Link>
              <Link href="/locations">
                <Button size="lg" variant="outline" className="rounded-full text-lg h-16 px-10 font-bold hover-lift bg-accent hover:bg-accent/90 border-0 text-white shadow-xl shadow-accent/20">
                  Our Locations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platinum Partners Section */}
      <section className="py-16 bg-white border-y border-border/50 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] mb-12">Our Platinum Partners</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* 3 Platinum Partners per location constraint applied visually */}
            <div className="text-2xl font-display font-black tracking-tighter text-slate-400">PARTNER ONE</div>
            <div className="text-2xl font-display font-black tracking-tighter text-slate-400">PARTNER TWO</div>
            <div className="text-2xl font-display font-black tracking-tighter text-slate-400">PARTNER THREE</div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-accent font-bold uppercase tracking-widest text-sm">
                <Zap size={16} /> Upcoming Seasons
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Featured Programs</h2>
              <p className="text-muted-foreground max-w-lg text-lg">
                Discover our most popular upcoming clinics and camps. Designed for every age and skill level.
              </p>
            </div>
            <Link href="/programs">
              <Button variant="outline" className="hidden md:flex gap-2 group rounded-full px-6 border-primary text-primary hover:bg-primary hover:text-white font-bold">
                View All Programs <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/programs">
              <Button className="w-full rounded-full py-6 font-bold">View All Programs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About & Testimonials Combined Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="text-accent" size={32} />
                  <h2 className="text-4xl font-display font-bold text-primary">Why We Exist</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every parent longs for their children’s to be surrounded by positive influences and have a strong sense of belonging. We believe that when youth are given the opportunities to grow, they will carry their faith and community into the future.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Heart className="text-accent" size={32} />
                  <h2 className="text-4xl font-display font-bold text-primary">Who We Are</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We aim to be a communal backbone for youth development. What defines us are the values we bring to each and every experience.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/about">
                  <Button variant="link" className="text-primary font-bold text-lg p-0 h-auto hover:text-accent gap-2">
                    Learn more about our values <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-accent font-bold uppercase tracking-widest text-xs">
                  <Star size={14} /> Community Voice
                </div>
                <TestimonialSlider />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-[250px] rounded-2xl overflow-hidden shadow-lg">
                  <img 
                     src={actionShot1}
                     alt="Youth playing basketball"
                     className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="relative h-[250px] rounded-2xl overflow-hidden shadow-lg">
                   <img 
                     src={actionShot2}
                     alt="Competitive play"
                     className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Preview */}

      {/* Locations Preview */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-display font-bold mb-6 text-primary">Where We Play</h2>
            <p className="text-xl text-muted-foreground">
              Our facilities are selected for safety, accessibility, and quality. Find a YMS center in your community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary text-white relative overflow-hidden">
        {/* Abstract shapes/texture */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-accent/20 -skew-x-12 transform translate-x-32" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-white/10 skew-x-12 transform -translate-x-12" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 drop-shadow-lg">Ready to Level Up?</h2>
          <p className="text-2xl text-white/95 mb-12 max-w-2xl mx-auto font-medium drop-shadow-md">
            Join the community of athletes dedicated to improvement. Registration is open for all upcoming seasons.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="rounded-full h-16 px-12 text-lg font-bold shadow-2xl bg-accent text-white hover:bg-accent/90 hover:-translate-y-1 transition-all border-0">
              Get Started Today
            </Button>
            <div className="text-white/80 text-sm font-bold uppercase tracking-widest drop-shadow-sm">
              Limited spots available
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
