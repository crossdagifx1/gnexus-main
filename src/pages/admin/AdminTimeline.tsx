import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, GripVertical, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimelineEntry {
    id: number;
    year: string;
    title: string;
    description: string;
    icon_name: string;
    display_order: number;
    is_active: boolean;
}

export default function AdminTimeline() {
    const [entries, setEntries] = useState<TimelineEntry[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        year: "",
        title: "",
        description: "",
        icon_name: "Sparkles",
    });
    const { toast } = useToast();

    // Icon options
    const iconOptions = ["Sparkles", "Users", "Box", "Brain", "Rocket", "TrendingUp", "Star", "Award", "Zap"];

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/admin/timeline');
            // const data = await response.json();
            // setEntries(data);

            // Mock data for now
            setEntries([
                { id: 1, year: "2019", title: "Founded", description: "G-Nexus was established", icon_name: "Sparkles", display_order: 1, is_active: true },
                { id: 2, year: "2020", title: "First 50 Clients", description: "Reached 50+ businesses", icon_name: "Users", display_order: 2, is_active: true },
                { id: 3, year: "2021", title: "3D Studio Launch", description: "Expanded to 3D services", icon_name: "Box", display_order: 3, is_active: true },
                { id: 4, year: "2022", title: "AI Integration", description: "Introduced AI tools", icon_name: "Brain", display_order: 4, is_active: true },
                { id: 5, year: "2023", title: "G-Nexus Platform Beta", description: "Launched platform", icon_name: "Rocket", display_order: 5, is_active: true },
                { id: 6, year: "2024", title: "Nationwide Expansion", description: "Scaled operations", icon_name: "TrendingUp", display_order: 6, is_active: true },
            ]);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load timeline entries",
                variant: "destructive",
            });
        }
    };

    const handleSave = async () => {
        try {
            if (isAdding) {
                // TODO: Add API call
                // await fetch('/api/admin/timeline', { method: 'POST', body: JSON.stringify(formData) });
                toast({ title: "Success", description: "Timeline entry added" });
            } else if (isEditing) {
                // TODO: Add API call
                // await fetch(`/api/admin/timeline/${isEditing}`, { method: 'PUT', body: JSON.stringify(formData) });
                toast({ title: "Success", description: "Timeline entry updated" });
            }

            setIsAdding(false);
            setIsEditing(null);
            setFormData({ year: "", title: "", description: "", icon_name: "Sparkles" });
            loadEntries();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save entry",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;

        try {
            // TODO: Add API call
            // await fetch(`/api/admin/timeline/${id}`, { method: 'DELETE' });
            toast({ title: "Success", description: "Timeline entry deleted" });
            loadEntries();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete entry",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (entry: TimelineEntry) => {
        setIsEditing(entry.id);
        setFormData({
            year: entry.year,
            title: entry.title,
            description: entry.description,
            icon_name: entry.icon_name,
        });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setIsEditing(null);
        setFormData({ year: "", title: "", description: "", icon_name: "Sparkles" });
    };

    const toggleActive = async (id: number, currentStatus: boolean) => {
        try {
            // TODO: Add API call
            // await fetch(`/api/admin/timeline/${id}`, { 
            //   method: 'PUT', 
            //   body: JSON.stringify({ is_active: !currentStatus })
            // });
            toast({ title: "Success", description: `Entry ${!currentStatus ? 'activated' : 'deactivated'}` });
            loadEntries();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to toggle status",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Company Timeline</h1>
                    <p className="text-muted-foreground">Manage milestones displayed on the homepage</p>
                </div>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                </Button>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || isEditing) && (
                <Card className="mb-6 border-gold/30">
                    <CardHeader>
                        <CardTitle>{isAdding ? "Add New Milestone" : "Edit Milestone"}</CardTitle>
                        <CardDescription>Fill in the details for the timeline entry</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Year</label>
                                <Input
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    placeholder="2024"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Icon</label>
                                <select
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background"
                                    value={formData.icon_name}
                                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                                >
                                    {iconOptions.map((icon) => (
                                        <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium mb-2 block">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Major Achievement"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium mb-2 block">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe this milestone..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button onClick={handleSave} variant="default">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            <Button onClick={handleCancel} variant="outline">
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Timeline Entries List */}
            <div className="space-y-4">
                {entries.map((entry) => (
                    <Card key={entry.id} className={!entry.is_active ? "opacity-50" : ""}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="cursor-move">
                                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-gold font-bold text-lg">{entry.year}</span>
                                                <span className="text-xs px-2 py-1 rounded bg-gold/10 text-gold">{entry.icon_name}</span>
                                                {!entry.is_active && (
                                                    <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-500">Inactive</span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-xl mb-1">{entry.title}</h3>
                                            <p className="text-muted-foreground">{entry.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toggleActive(entry.id, entry.is_active)}
                                            >
                                                {entry.is_active ? "Deactivate" : "Activate"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(entry)}
                                                disabled={isEditing !== null || isAdding}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(entry.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
