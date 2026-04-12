import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Settings, ArrowLeft, Quote } from "lucide-react";

// Mock data for testimonials
const initialTestimonials = [
  {
    id: 1,
    text: "Zakariya Baig really enjoyed last Friday’s session. He thoroughly enjoyed learning and practicing drills with his friends. He’s looking forward to learning and playing again this Friday i’A.",
    author: "Parent of Zakariya",
    role: "Program Participant",
    status: "Active"
  },
  {
    id: 2,
    text: "Assalam alikum sister noora- jazakallahu Khair for all your hard work and efforts. My daughters Maryam and Zaynab really enjoyed the sessions. May Allah swt bless you tremendously for this Ameen.",
    author: "Mother of Maryam & Zaynab",
    role: "Program Participant",
    status: "Active"
  },
  {
    id: 3,
    text: "Young muslim sports and its management is very kind and I'm grateful for everything Alhamdulilah!",
    author: "YMS Parent",
    role: "Community Member",
    status: "Active"
  },
  {
    id: 4,
    text: "Maryam (4 y.o) wakes up every morning asking if it's Saturday because she's so excited for the next session",
    author: "Parent of Maryam",
    role: "Program Participant",
    status: "Active"
  },
  {
    id: 5,
    text: "Jazakallahu Khair for organizing such wonderful programs mashallah :) My kids have really benefited from them. My son continues to enjoy the Sunday soccer games, and over the summer, my girls loved playing volleyball and are now interested in trying tennis.",
    author: "YMS Parent",
    role: "Multi-Sport Family",
    status: "Active"
  }
];

export default function AdminTestimonials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/10 pb-12">
      <header className="bg-white border-b sticky top-0 z-30 mb-8">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft size={16} /> Back to Dashboard
              </Button>
            </Link>
            <h1 className="font-display font-bold text-xl flex items-center gap-2">
              <Quote size={20} className="text-primary" />
              Manage Testimonials
            </h1>
          </div>
          <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
            <Plus size={18} /> Add New
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search testimonials..." 
              className="pl-9 bg-muted/30" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[400px]">Testimonial</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestimonials.map((t) => (
                <TableRow key={t.id} className="group">
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">"{t.text}"</p>
                  </TableCell>
                  <TableCell className="font-bold text-primary">{t.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium text-xs">
                      {t.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(t.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
