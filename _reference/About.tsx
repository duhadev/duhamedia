import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Download, Mail, Star, Users, Target, Heart } from "lucide-react";
import communityImg from "@assets/WhatsApp_Image_2025-12-17_at_11.18.33_PM_1767568064184.JPG";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-primary py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526676023131-d356eda0dee3?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"
            >
              Our Mission & Values
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-6 italic tracking-tighter">
              BEYOND <span className="text-accent">THE GAME</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed font-medium">
              We are a community dedicated to raising the next generation of confident, character-driven Muslim youth through elite athletic training.
            </p>
          </div>
        </section>

        {/* Mission & Vision Detail */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={communityImg} 
                  alt="YMS Community" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-primary mb-4">Fertile Ground to Grow</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Every parent longs for their children’s to be surrounded by positive influences and have a strong sense of belonging. We believe that when youth are given the opportunities to grow, they will carry their faith and community into the future.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                    We aim to be a communal backbone for youth development. What defines us are the values we bring to each and every experience.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-secondary/30 p-6 rounded-xl border border-secondary">
                    <Target className="text-accent mb-3" size={32} />
                    <h3 className="font-bold text-lg mb-2">Our Mission</h3>
                    <p className="text-sm text-muted-foreground">To provide safe, structured, and spirited environments where youth develop athletic excellence and strong character.</p>
                  </div>
                  <div className="bg-secondary/30 p-6 rounded-xl border border-secondary">
                    <Heart className="text-accent mb-3" size={32} />
                    <h3 className="font-bold text-lg mb-2">Our Values</h3>
                    <p className="text-sm text-muted-foreground">Faith, Integrity, Teamwork, and Excellence in everything we do, on and off the field.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coach / Staff Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl font-display font-bold text-primary mb-6">Our Leadership & Coaches</h2>
              <p className="text-xl text-muted-foreground">
                The dedicated individuals who make YMS a fertile ground for growth.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Coach Kareem", role: "Head of Basketball Operations", bio: "Former college athlete with 10+ years of youth coaching experience." },
                { name: "Sister Sarah", role: "Youth Development Coordinator", bio: "Specializes in character-building curriculum and youth mentorship." },
                { name: "Coach Omar", role: "Soccer Technical Director", bio: "USSF licensed coach passionate about developing tactical excellence." },
                { name: "Brother Hisham", role: "Executive Director", bio: "Visionary leader committed to scaling Islamic youth sports nationwide." },
              ].map((member, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border shadow-sm hover-lift group">
                  <div className="w-full aspect-square bg-slate-100 rounded-xl mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                       <Users size={64} />
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-bold text-primary group-hover:text-accent transition-colors">{member.name}</h3>
                  <div className="text-accent text-sm font-bold uppercase tracking-wider mb-3">{member.role}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
