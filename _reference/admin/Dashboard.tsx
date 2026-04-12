import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Pencil, Trash2, LogOut, Settings, Quote } from "lucide-react";
import { usePrograms } from "@/lib/ProgramsContext";
import { Program } from "@/lib/mockData";

export default function AdminDashboard() {
  const { programs, deleteProgram, updateProgram } = usePrograms();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPrograms = programs.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      deleteProgram(id);
    }
  };

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Admin Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl">
            <div className="bg-primary text-white px-2 py-0.5 rounded text-sm">YMS</div>
            <span>Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings size={16} /> Settings
            </Button>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut size={16} /> Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/testimonials">
              <Button variant="outline" className="gap-2 font-bold">
                <Quote size={18} /> Manage Testimonials
              </Button>
            </Link>
            <Link href="/admin/programs/new">
              <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                <Plus size={18} /> Add New Program
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Active Programs</div>
            <div className="text-3xl font-display font-bold text-green-600">{programs.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Programs Finished</div>
            <div className="text-3xl font-display font-bold text-muted-foreground">0</div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Planned (Not Live)</div>
            <div className="text-3xl font-display font-bold text-orange-500">0</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search programs..." 
              className="pl-9 bg-muted/30" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Add more filters here later */}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[300px]">Program Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Age Group</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted">
                        <img src={program.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-primary">{program.title}</div>
                        <div className="text-xs text-muted-foreground">{program.price}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-bold">{program.type}</Badge>
                  </TableCell>
                  <TableCell>{program.ageGroup}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={14} /> {program.location}
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center space-x-2">
                      <Switch 
                        checked={program.featured}
                        onCheckedChange={(checked) => updateProgram(program.id, { featured: checked })}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/programs/${program.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                          <Pencil size={16} />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(program.id)}
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

function MapPin({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
