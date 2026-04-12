import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { usePrograms } from "@/lib/ProgramsContext";
import { ProgramType } from "@/lib/mockData";

export default function EditProgram() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/admin/programs/:id");
  const { getProgram, updateProgram, addProgram } = usePrograms();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = match && params?.id !== "new";
  const existingProgram = isEditMode && params?.id ? getProgram(params.id) : undefined;

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "clinic" as ProgramType,
    ageGroup: "",
    price: "",
    location: "Chicago, IL",
    description: "",
    registrationUrl: "",
    image: ""
  });

  useEffect(() => {
    if (existingProgram) {
      setFormData({
        title: existingProgram.title,
        type: existingProgram.type,
        ageGroup: existingProgram.ageGroup,
        price: existingProgram.price.replace('$', ''),
        location: existingProgram.location,
        description: existingProgram.description,
        registrationUrl: existingProgram.registrationUrl || "",
        image: existingProgram.image
      });
    }
  }, [existingProgram]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const programData = {
        title: formData.title,
        type: formData.type,
        ageGroup: formData.ageGroup,
        price: `$${formData.price}`,
        location: formData.location,
        description: formData.description,
        registrationUrl: formData.registrationUrl,
        image: formData.image || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2000", // Fallback image
        date: "TBD" // Placeholder
      };

      if (isEditMode && params?.id) {
        updateProgram(params.id, programData);
      } else {
        addProgram({
          id: Math.random().toString(36).substr(2, 9),
          ...programData
        });
      }

      setIsSubmitting(false);
      setLocation("/admin/dashboard");
    }, 800);
  };

  if (isEditMode && !existingProgram) {
    return <div>Program not found</div>;
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-12">
      <header className="bg-white border-b sticky top-0 z-30 mb-8">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft size={16} /> Back
              </Button>
            </Link>
            <h1 className="font-display font-bold text-xl">{isEditMode ? "Edit Program" : "Add New Program"}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Active Draft
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" className="font-bold min-w-[150px]" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Program"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="details">Program Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule & Staff</TabsTrigger>
              <TabsTrigger value="media">Media & Branding</TabsTrigger>
              <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="grid gap-8">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Core Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Program Title</Label>
                        <Input 
                          id="title" 
                          value={formData.title} 
                          onChange={(e) => handleInputChange("title", e.target.value)} 
                          placeholder="e.g. Summer Soccer Camp" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Program Type</Label>
                        <Select 
                          value={formData.type} 
                          onValueChange={(val) => handleInputChange("type", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Clinic">Clinic</SelectItem>
                            <SelectItem value="Camp">Camp</SelectItem>
                            <SelectItem value="League">League</SelectItem>
                            <SelectItem value="Tournament">Tournament</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="ageGroup">Age Group</Label>
                        <Input 
                          id="ageGroup" 
                          value={formData.ageGroup}
                          onChange={(e) => handleInputChange("ageGroup", e.target.value)}
                          placeholder="e.g. 10-14 years" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          placeholder="150" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select 
                        value={formData.location}
                        onValueChange={(val) => handleInputChange("location", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                          <SelectItem value="Dallas, TX">Dallas, TX</SelectItem>
                          <SelectItem value="Richmond, VA">Richmond, VA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationUrl">Registration Link (Fillout Form)</Label>
                      <Input 
                        id="registrationUrl" 
                        value={formData.registrationUrl}
                        onChange={(e) => handleInputChange("registrationUrl", e.target.value)}
                        placeholder="e.g. https://fillout.com/..." 
                      />
                      <p className="text-xs text-muted-foreground">The direct link to the registration form for this program.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe the program..." 
                        className="min-h-[120px]"
                        required 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                   <div className="space-y-4">
                    <Label>Weekly Schedule</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="flex items-center space-x-2 border p-3 rounded-lg">
                          <Checkbox id={`day-${day}`} />
                          <Label htmlFor={`day-${day}`} className="font-normal cursor-pointer">{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Program Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:bg-muted/10 transition-colors cursor-pointer mb-6 relative overflow-hidden group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    {formData.image ? (
                      <div className="relative z-10">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="max-h-64 mx-auto rounded-lg shadow-md mb-4" 
                        />
                        <div className="text-sm font-bold text-primary">Click to change image</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="bg-primary/10 p-4 rounded-full mb-2">
                          <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div className="font-bold text-primary">Click to upload cover image</div>
                        <div className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. 800x400px)</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Visibility & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Feature on Homepage</Label>
                      <div className="text-sm text-muted-foreground">
                        Pin this program to the top of the homepage
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Registration Open</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow users to register for this program
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </main>
    </div>
  );
}
