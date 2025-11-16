import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, TrendingUp, Target, Check } from "lucide-react";

interface Progression {
  id: number;
  exerciseName: string;
  week: number;
  targetWeight: number | null;
  targetReps: number | null;
  targetDuration: number | null;
  actualWeight: number | null;
  actualReps: number | null;
  actualDuration: number | null;
  percentAchieved: number | null;
  milestone: string | null;
}

export default function Progressions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    exerciseName: "",
    week: "1",
    targetWeight: "",
    targetReps: "",
    targetDuration: "",
    milestone: "",
  });

  const { data: progressions } = useQuery({
    queryKey: ["progressions", selectedWeek],
    queryFn: async () => {
      const res = await apiClient.progressions.$get({
        query: { week: selectedWeek.toString() },
      });
      const data = await res.json();
      return data.progressions as Progression[];
    },
  });

  const createProgressionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.progressions.$post({ json: data });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progressions"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateProgressionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiClient.progressions[":id"].$put({
        param: { id: id.toString() },
        json: data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progressions"] });
    },
  });

  const resetForm = () => {
    setFormData({
      exerciseName: "",
      week: "1",
      targetWeight: "",
      targetReps: "",
      targetDuration: "",
      milestone: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      exerciseName: formData.exerciseName,
      week: parseInt(formData.week),
      targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
      targetReps: formData.targetReps ? parseInt(formData.targetReps) : undefined,
      targetDuration: formData.targetDuration ? parseInt(formData.targetDuration) : undefined,
      milestone: formData.milestone || undefined,
    };
    createProgressionMutation.mutate(data);
  };

  const handleUpdateActual = (progression: Progression, field: string, value: string) => {
    const data: any = {};
    if (field === "weight") data.actualWeight = parseFloat(value);
    if (field === "reps") data.actualReps = parseInt(value);
    if (field === "duration") data.actualDuration = parseInt(value);

    updateProgressionMutation.mutate({ id: progression.id, data });
  };

  const getProgressColor = (percent: number | null) => {
    if (!percent) return "bg-gray-500";
    if (percent >= 100) return "bg-green-500";
    if (percent >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Progressioni</h1>
            <p className="text-muted-foreground">
              Monitora i tuoi progressi rispetto agli obiettivi settimanali
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Nuovo Obiettivo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuovo Obiettivo</DialogTitle>
                <DialogDescription>
                  Imposta un obiettivo di progressione per un esercizio
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="exerciseName">Esercizio *</Label>
                  <Input
                    id="exerciseName"
                    value={formData.exerciseName}
                    onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="week">Settimana *</Label>
                  <Select value={formData.week} onValueChange={(v) => setFormData({ ...formData, week: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 18 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Settimana {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="targetWeight">Peso (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      step="0.5"
                      value={formData.targetWeight}
                      onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetReps">Ripetizioni</Label>
                    <Input
                      id="targetReps"
                      type="number"
                      value={formData.targetReps}
                      onChange={(e) => setFormData({ ...formData, targetReps: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetDuration">Durata (s)</Label>
                    <Input
                      id="targetDuration"
                      type="number"
                      value={formData.targetDuration}
                      onChange={(e) => setFormData({ ...formData, targetDuration: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="milestone">Milestone</Label>
                  <Input
                    id="milestone"
                    value={formData.milestone}
                    onChange={(e) => setFormData({ ...formData, milestone: e.target.value })}
                    placeholder="Es: Prima volta a questo peso"
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

        <div className="mb-6">
          <Label>Filtra per Settimana</Label>
          <Select value={selectedWeek.toString()} onValueChange={(v) => setSelectedWeek(parseInt(v))}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 18 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Settimana {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!progressions || progressions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Nessuna progressione trovata per la settimana {selectedWeek}
              </p>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crea il primo obiettivo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {progressions.map((prog) => (
              <Card key={prog.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{prog.exerciseName}</CardTitle>
                      <CardDescription>Settimana {prog.week}</CardDescription>
                    </div>
                    {prog.percentAchieved !== null && (
                      <Badge className={getProgressColor(prog.percentAchieved)}>
                        {prog.percentAchieved.toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prog.milestone && (
                    <div className="bg-muted/50 p-3 rounded">
                      <p className="text-sm">
                        <TrendingUp className="w-4 h-4 inline mr-2" />
                        {prog.milestone}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-3">
                    {prog.targetWeight !== null && (
                      <div className="space-y-2">
                        <Label>Peso (kg)</Label>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">
                              Target: {prog.targetWeight} kg
                            </div>
                            <Input
                              type="number"
                              step="0.5"
                              placeholder="Attuale"
                              defaultValue={prog.actualWeight || ""}
                              onBlur={(e) => e.target.value && handleUpdateActual(prog, "weight", e.target.value)}
                            />
                          </div>
                        </div>
                        {prog.actualWeight !== null && (
                          <Progress
                            value={(prog.actualWeight / prog.targetWeight) * 100}
                            className="h-2"
                          />
                        )}
                      </div>
                    )}

                    {prog.targetReps !== null && (
                      <div className="space-y-2">
                        <Label>Ripetizioni</Label>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">
                              Target: {prog.targetReps}
                            </div>
                            <Input
                              type="number"
                              placeholder="Attuale"
                              defaultValue={prog.actualReps || ""}
                              onBlur={(e) => e.target.value && handleUpdateActual(prog, "reps", e.target.value)}
                            />
                          </div>
                        </div>
                        {prog.actualReps !== null && (
                          <Progress
                            value={(prog.actualReps / prog.targetReps) * 100}
                            className="h-2"
                          />
                        )}
                      </div>
                    )}

                    {prog.targetDuration !== null && (
                      <div className="space-y-2">
                        <Label>Durata (s)</Label>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">
                              Target: {prog.targetDuration}s
                            </div>
                            <Input
                              type="number"
                              placeholder="Attuale"
                              defaultValue={prog.actualDuration || ""}
                              onBlur={(e) => e.target.value && handleUpdateActual(prog, "duration", e.target.value)}
                            />
                          </div>
                        </div>
                        {prog.actualDuration !== null && (
                          <Progress
                            value={(prog.actualDuration / prog.targetDuration) * 100}
                            className="h-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
