import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { usePrograms } from "@/lib/ProgramsContext";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import NotFound from "./not-found";

export default function ProgramDetails() {
  const { programs } = usePrograms();
  const [match, params] = useRoute("/programs/:id");
  
  if (!match) return <NotFound />;

  const program = programs.find(p => p.id === params.id);
  
  if (!program) return <NotFound />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pb-24">
        {/* Hero Header */}
        <div className="relative h-[60vh] bg-black">
          <div className="absolute inset-0 opacity-60">
            <img 
              src={program.image} 
              alt={program.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <div className="absolute bottom-0 w-full container mx-auto px-4 pb-12">
            <Link href="/programs">
              <Button variant="link" className="text-white/80 hover:text-white mb-6 pl-0 gap-2">
                <ArrowLeft size={16} /> Back to Programs
              </Button>
            </Link>
            <Badge className="bg-primary hover:bg-primary text-white mb-4 text-lg py-1 px-4">
              {program.type}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4">
              {program.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary" /> {program.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" /> {program.date}
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="text-primary" /> Ages {program.ageGroup}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-3xl font-bold font-display mb-4">About the Program</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {program.description} Designed to help young athletes reach their full potential, this program combines 
                  expert coaching with structured gameplay. Whether you are looking to master the basics or refine advanced 
                  skills, our curriculum adapts to your level.
                </p>
                
                <h4 className="text-xl font-bold mb-4">What to Expect</h4>
                <ul className="space-y-4">
                  {[
                    "Professional Coaching Staff",
                    "Skill Development Drills",
                    "Competitive Scrimmages",
                    "Performance Analysis",
                    "Official Team Jersey"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="text-primary shrink-0" size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-2xl p-8 sticky top-24 shadow-lg">
                <div className="mb-6 pb-6 border-b">
                  <div className="text-sm text-muted-foreground mb-1">Registration Fee</div>
                  <div className="text-4xl font-bold text-primary">{program.price}</div>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <div className="font-bold mb-1">Location</div>
                    <div className="text-muted-foreground text-sm flex items-start gap-2">
                       <MapPin size={16} className="mt-1" />
                       NextLevel Sports Center<br/>
                       123 Athlete Way<br/>
                       {program.location}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold mb-1">Schedule</div>
                    <div className="text-muted-foreground text-sm flex items-start gap-2">
                       <Clock size={16} className="mt-1" />
                       Monday - Friday<br/>
                       9:00 AM - 3:00 PM
                    </div>
                  </div>
                </div>

                {program.registrationUrl ? (
                  <a href={program.registrationUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full h-12 text-lg font-bold rounded-xl mb-3 shadow-lg bg-accent hover:bg-accent/90 text-white border-0 hover:shadow-accent/20">
                      Register Now
                    </Button>
                  </a>
                ) : (
                  <Button className="w-full h-12 text-lg font-bold rounded-xl mb-3 shadow-lg hover:shadow-primary/20" disabled>
                    Registration Closed
                  </Button>
                )}
                
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout powered by Fillout
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
