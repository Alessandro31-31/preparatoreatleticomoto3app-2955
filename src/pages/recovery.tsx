import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Play, Edit, Trash2, Check } from "lucide-react";

type ProtocolType = "warmup" | "cooldown" | "stretching" | "foam_rolling";

interface Protocol {
  id: number;
  type: ProtocolType;
  name: string;
  description: string | null;
  duration: number | null;
  exercises: string;
  instructions: string | null;
  videoUrl: string | null;
  order: number;
  isActive: number;
}

const protocolTypes: { value: ProtocolType; label: string; icon: string }[] = [
  { value: "warmup", label: "Riscaldamento", icon: "🔥" },
  { value: "cooldown", label: "Defaticamento", icon: "❄️" },
  { value: "stretching", label: "Stretching", icon: "🧘" },
  { value: "foam_rolling", label: "Foam Rolling", icon: "🎯" },
];

export default function Recovery() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<ProtocolType>("warmup");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    exercises: "",
    instructions: "",
  });

  const { data: protocols } = useQuery({
    queryKey: ["recovery-protocols", selectedType],
    queryFn: async () => {
      const res = await apiClient.recovery.protocols.$get({
        query: { type: selectedType },
      });
      const data = await res.json();
      return data.protocols as Protocol[];
    },
  });

  const createProtocolMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.recovery.protocols.$post({ json: data });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recovery-protocols"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateProtocolMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiClient.recovery.protocols[":id"].$put({
        param: { id: id.toString() },
        json: data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recovery-protocols"] });
      setIsDialogOpen(false);
      setEditingProtocol(null);
      resetForm();
    },
  });

  const deleteProtocolMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.recovery.protocols[":id"].$delete({
        param: { id: id.toString() },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recovery-protocols"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      exercises: "",
      instructions: "",
    });
  };

  const handleEdit = (protocol: Protocol) => {
    setEditingProtocol(protocol);
    setFormData({
      name: protocol.name,
      description: protocol.description || "",
      duration: protocol.duration?.toString() || "",
      exercises: protocol.exercises || "",
      instructions: protocol.instructions || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      type: selectedType,
      name: formData.name,
      description: formData.description || undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      exercises: formData.exercises,
      instructions: formData.instructions || undefined,
      order: 0,
    };

    if (editingProtocol) {
      updateProtocolMutation.mutate({ id: editingProtocol.id, data });
    } else {
      createProtocolMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Preparazione e Recupero</h1>
          <p className="text-muted-foreground">
            Gestisci i protocolli di riscaldamento, defaticamento, stretching e foam rolling
          </p>
        </div>

        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as ProtocolType)}>
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              {protocolTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value}>
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuovo Protocollo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProtocol ? "Modifica Protocollo" : "Nuovo Protocollo"}
                  </DialogTitle>
                  <DialogDescription>
                    Crea o modifica un protocollo di {protocolTypes.find(t => t.value === selectedType)?.label.toLowerCase()}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Durata (minuti)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrizione</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exercises">Esercizi (uno per riga)</Label>
                    <Textarea
                      id="exercises"
                      value={formData.exercises}
                      onChange={(e) => setFormData({ ...formData, exercises: e.target.value })}
                      rows={5}
                      placeholder="Es:&#10;- Corsa leggera 5 min&#10;- Jumping jacks 2x20&#10;- High knees 2x15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructions">Istruzioni</Label>
                    <Textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annulla
                    </Button>
                    <Button type="submit" className="bg-red-500 hover:bg-red-600">
                      <Check className="w-4 h-4 mr-2" />
                      Salva
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {protocolTypes.map((type) => (
            <TabsContent key={type.value} value={type.value} className="space-y-4">
              {!protocols || protocols.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      Nessun protocollo di {type.label.toLowerCase()} trovato
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crea il primo protocollo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {protocols.map((protocol) => (
                    <Card key={protocol.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{protocol.name}</CardTitle>
                            {protocol.duration && (
                              <CardDescription>{protocol.duration} minuti</CardDescription>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(protocol)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteProtocolMutation.mutate(protocol.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {protocol.description && (
                          <p className="text-sm text-muted-foreground">{protocol.description}</p>
                        )}
                        {protocol.exercises && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Esercizi:</h4>
                            <div className="text-sm whitespace-pre-line bg-muted/50 p-3 rounded">
                              {protocol.exercises}
                            </div>
                          </div>
                        )}
                        {protocol.instructions && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Istruzioni:</h4>
                            <p className="text-sm text-muted-foreground">{protocol.instructions}</p>
                          </div>
                        )}
                        <Button className="w-full bg-red-500 hover:bg-red-600">
                          <Play className="w-4 h-4 mr-2" />
                          Inizia Protocollo
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
