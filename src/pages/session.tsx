import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Check,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Clock,
  Dumbbell,
  Target,
  Zap,
} from "lucide-react";

interface Exercise {
  id?: number;
  sessionId?: number;
  name: string;
  category?: string;
  sets?: number;
  reps?: string;
  weight?: number;
  targetWeight?: number;
  duration?: number;
  rest?: number;
  rpeTarget?: number;
  rpeActual?: number;
  completed: number;
  notes?: string;
  setupInstructions?: string;
  techniqueNotes?: string;
  breathingPattern?: string;
  muscleFocus?: string;
}

const exerciseTemplates = {
  "Lower Body + Core": [
    { name: "Box Squat", category: "Strength", sets: 4, reps: "8", targetWeight: 80, rest: 180, muscleFocus: "Quadricipiti, Glutei" },
    { name: "Romanian Deadlift", category: "Strength", sets: 3, reps: "10", targetWeight: 60, rest: 120, muscleFocus: "Ischio-crurali, Glutei" },
    { name: "Bulgarian Split Squat", category: "Accessory", sets: 3, reps: "10/lato", targetWeight: 20, rest: 90, muscleFocus: "Quadricipiti unilaterale" },
    { name: "Nordic Hamstring Curl", category: "Accessory", sets: 3, reps: "6-8", rest: 90, muscleFocus: "Ischio-crurali eccentrici" },
    { name: "Dead Bug", category: "Core", sets: 3, reps: "8/lato", rest: 60, muscleFocus: "Core anti-estensione" },
    { name: "Pallof Press", category: "Core", sets: 3, reps: "10/lato", rest: 60, muscleFocus: "Core anti-rotazione" },
  ],
  "Upper Body Pull": [
    { name: "Pull-ups", category: "Strength", sets: 4, reps: "6-8", rest: 180, muscleFocus: "Dorsali, Bicipiti" },
    { name: "Bent-Over Row", category: "Strength", sets: 4, reps: "8", targetWeight: 40, rest: 120, muscleFocus: "Dorsali, Trapezio" },
    { name: "Face Pulls", category: "Accessory", sets: 3, reps: "15", rest: 60, muscleFocus: "Deltoidi posteriori, Cuffia" },
    { name: "Bicep Curls", category: "Accessory", sets: 3, reps: "12", targetWeight: 10, rest: 60, muscleFocus: "Bicipiti" },
    { name: "Farmer's Carry", category: "Grip", sets: 3, reps: "40m", targetWeight: 30, rest: 90, muscleFocus: "Grip, Core" },
  ],
  "Upper Body Push + Core": [
    { name: "Bench Press", category: "Strength", sets: 4, reps: "8", targetWeight: 60, rest: 180, muscleFocus: "Pettorali, Tricipiti" },
    { name: "Overhead Press", category: "Strength", sets: 4, reps: "8", targetWeight: 35, rest: 150, muscleFocus: "Deltoidi, Tricipiti" },
    { name: "Dips", category: "Accessory", sets: 3, reps: "10-12", rest: 90, muscleFocus: "Pettorali inferiori, Tricipiti" },
    { name: "Lateral Raises", category: "Accessory", sets: 3, reps: "15", targetWeight: 8, rest: 60, muscleFocus: "Deltoidi laterali" },
    { name: "Ab Wheel Rollout", category: "Core", sets: 3, reps: "10", rest: 90, muscleFocus: "Core anteriore" },
    { name: "Side Plank", category: "Core", sets: 3, reps: "30s/lato", rest: 60, muscleFocus: "Core laterale" },
  ],
  "Lower Body Power": [
    { name: "Trap Bar Jump", category: "Power", sets: 5, reps: "3", targetWeight: 40, rest: 180, muscleFocus: "Potenza lower body" },
    { name: "Box Jump", category: "Power", sets: 4, reps: "5", rest: 120, muscleFocus: "Pliometria" },
    { name: "Kettlebell Swing", category: "Power", sets: 4, reps: "15", targetWeight: 24, rest: 90, muscleFocus: "Hip hinge esplosivo" },
    { name: "Lateral Bound", category: "Power", sets: 3, reps: "6/lato", rest: 90, muscleFocus: "Potenza laterale" },
    { name: "Single-Leg RDL", category: "Stability", sets: 3, reps: "8/lato", targetWeight: 16, rest: 60, muscleFocus: "Equilibrio, Ischio" },
  ],
};

export default function SessionDetail() {
  const navigate = useNavigate();
  const { week, day } = useParams();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessionData, setSessionData] = useState({
    duration: 0,
    rpeAvg: 7,
    notes: "",
  });

  const weekNumber = parseInt(week || "1");
  const dayName = day || "monday";
  const sessionType = getDaySessionType(dayName);

  function getDaySessionType(day: string) {
    const types: Record<string, string> = {
      monday: "Lower Body + Core",
      tuesday: "Upper Body Pull",
      wednesday: "Conditioning / Active Recovery",
      thursday: "Lower Body Power",
      friday: "Upper Body Push + Core",
      saturday: "Full Body / Skill Work",
      sunday: "Rest / Stretching",
    };
    return types[day.toLowerCase()] || "Training";
  }

  useEffect(() => {
    if (sessionType && exerciseTemplates[sessionType as keyof typeof exerciseTemplates]) {
      const template = exerciseTemplates[sessionType as keyof typeof exerciseTemplates];
      setExercises(
        template.map((ex) => ({
          ...ex,
          completed: 0,
        }))
      );
    }
  }, [sessionType]);

  const completedExercises = exercises.filter((ex) => ex.completed).length;
  const progress = exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const toggleExerciseComplete = (index: number) => {
    updateExercise(index, "completed", exercises[index].completed ? 0 : 1);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        name: "",
        sets: 3,
        reps: "10",
        completed: 0,
      },
    ]);
  };

  const saveSession = async () => {
    console.log("Saving session...", { weekNumber, dayName, sessionType, exercises, sessionData });
    // In a real app, this would save to the API
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Dumbbell className="w-8 h-8 text-red-500" />
                  {sessionType}
                </CardTitle>
                <CardDescription>
                  Week {weekNumber} • {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Annulla
                    </Button>
                    <Button onClick={saveSession} size="sm" className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Salva
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifica
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso Sessione</span>
                  <span className="text-sm text-muted-foreground">
                    {completedExercises}/{exercises.length} esercizi
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-sm">
                    Durata (minuti)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={sessionData.duration}
                    onChange={(e) =>
                      setSessionData({ ...sessionData, duration: parseInt(e.target.value) || 0 })
                    }
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="rpe" className="text-sm">
                    RPE Medio: {sessionData.rpeAvg}/10
                  </Label>
                  <Slider
                    value={[sessionData.rpeAvg]}
                    onValueChange={(v) => setSessionData({ ...sessionData, rpeAvg: v[0] })}
                    max={10}
                    step={0.5}
                    min={1}
                    disabled={!editing}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm">
                  Note Sessione
                </Label>
                <Textarea
                  id="notes"
                  value={sessionData.notes}
                  onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                  placeholder="Come ti sei sentito, punti di attenzione..."
                  rows={2}
                  disabled={!editing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Esercizi</h2>
          {editing && (
            <Button onClick={addExercise} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Esercizio
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, idx) => (
            <Card
              key={idx}
              className={`transition-all ${
                exercise.completed
                  ? "bg-green-500/5 border-2 border-green-500"
                  : "hover:shadow-md"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      variant={exercise.completed ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleExerciseComplete(idx)}
                      className={exercise.completed ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {exercise.completed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </Button>
                    {editing ? (
                      <Input
                        value={exercise.name}
                        onChange={(e) => updateExercise(idx, "name", e.target.value)}
                        placeholder="Nome esercizio"
                        className="font-semibold"
                      />
                    ) : (
                      <div>
                        <CardTitle className="text-lg">{exercise.name}</CardTitle>
                        {exercise.category && (
                          <CardDescription>{exercise.category}</CardDescription>
                        )}
                      </div>
                    )}
                  </div>
                  {editing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Sets</Label>
                    <Input
                      type="number"
                      value={exercise.sets || ""}
                      onChange={(e) =>
                        updateExercise(idx, "sets", parseInt(e.target.value) || 0)
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Reps</Label>
                    <Input
                      value={exercise.reps || ""}
                      onChange={(e) => updateExercise(idx, "reps", e.target.value)}
                      disabled={!editing}
                      placeholder="8-12"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Peso (kg)</Label>
                    <Input
                      type="number"
                      value={exercise.weight || ""}
                      onChange={(e) =>
                        updateExercise(idx, "weight", parseFloat(e.target.value) || 0)
                      }
                      disabled={!editing}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Riposo (s)</Label>
                    <Input
                      type="number"
                      value={exercise.rest || ""}
                      onChange={(e) =>
                        updateExercise(idx, "rest", parseInt(e.target.value) || 0)
                      }
                      disabled={!editing}
                      placeholder="90"
                      className="mt-1"
                    />
                  </div>
                </div>

                {editing && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Target Peso (kg)
                        </Label>
                        <Input
                          type="number"
                          value={exercise.targetWeight || ""}
                          onChange={(e) =>
                            updateExercise(
                              idx,
                              "targetWeight",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Target"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Focus Muscolare</Label>
                        <Input
                          value={exercise.muscleFocus || ""}
                          onChange={(e) => updateExercise(idx, "muscleFocus", e.target.value)}
                          placeholder="es. Quadricipiti, Glutei"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Note Tecnica</Label>
                        <Textarea
                          value={exercise.techniqueNotes || ""}
                          onChange={(e) => updateExercise(idx, "techniqueNotes", e.target.value)}
                          placeholder="Punti chiave della tecnica..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </>
                )}

                {!editing && exercise.muscleFocus && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                    <Target className="w-4 h-4" />
                    <span>{exercise.muscleFocus}</span>
                  </div>
                )}

                {exercise.targetWeight && exercise.weight && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progresso peso</span>
                      <span className="font-medium">
                        {exercise.weight}kg / {exercise.targetWeight}kg (
                        {Math.round((exercise.weight / exercise.targetWeight) * 100)}%)
                      </span>
                    </div>
                    <Progress
                      value={(exercise.weight / exercise.targetWeight) * 100}
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {exercises.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nessun esercizio</h3>
              <p className="text-muted-foreground mb-4">
                Aggiungi esercizi per questa sessione di allenamento
              </p>
              <Button onClick={addExercise}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Primo Esercizio
              </Button>
            </CardContent>
          </Card>
        )}

        {!editing && exercises.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Riepilogo Sessione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durata</p>
                    <p className="text-2xl font-bold">{sessionData.duration}min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RPE Medio</p>
                    <p className="text-2xl font-bold">{sessionData.rpeAvg}/10</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Target className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carico</p>
                    <p className="text-2xl font-bold">
                      {Math.round(sessionData.duration * sessionData.rpeAvg)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
