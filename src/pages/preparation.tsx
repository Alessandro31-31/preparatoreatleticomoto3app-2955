import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  Pause,
  Check,
  RotateCcw,
  Flame,
  Snowflake,
  Sparkles,
  Activity,
  BookOpen,
} from "lucide-react";

const warmupProtocol = [
  { name: "Cat-Cow (Mobilità spinale)", duration: 60, reps: "2×15", focus: "Colonna lombare/toracica" },
  { name: "Thread the Needle", duration: 45, reps: "2×8/lato", focus: "Rotazione toracica" },
  { name: "Hip Circles", duration: 45, reps: "2×10/direzione", focus: "Mobilità anca" },
  { name: "Glute Bridge (attivazione)", duration: 60, reps: "2×12", focus: "Attivazione catena posteriore" },
  { name: "Dead Bug", duration: 60, reps: "2×8/lato", focus: "Stabilità core" },
  { name: "Ankle Mobility", duration: 45, reps: "2×10/lato", focus: "Dorsi-flessione caviglia" },
  { name: "Wrist Circles", duration: 30, reps: "2×10/direzione", focus: "Mobilità polsi" },
  { name: "Scapular Push-ups", duration: 45, reps: "2×10", focus: "Attivazione scapolare" },
];

const cooldownProtocol = [
  { name: "Walk/Light Cardio", duration: 180, intensity: "RPE 3-4", focus: "Riduzione FC graduale" },
  { name: "Child's Pose", duration: 60, breath: "5-8 respiri", focus: "Rilassamento lombare" },
  { name: "Supine Twist", duration: 60, breath: "5 respiri/lato", focus: "Decompressione colonna" },
  { name: "Figure-4 Stretch", duration: 60, hold: "30s/lato", focus: "Glutei e piriforme" },
  { name: "Quad Stretch", duration: 45, hold: "30s/lato", focus: "Quadricipiti" },
  { name: "Hamstring Stretch", duration: 60, hold: "30s/lato", focus: "Ischio-crurali" },
  { name: "Shoulder/Chest Doorway Stretch", duration: 60, hold: "30s/lato", focus: "Apertura toracica" },
];

const stretchingProtocol = [
  { name: "Hip Flexor Stretch (Couch Stretch)", duration: 90, hold: "45s/lato", focus: "Psoas/Retto femorale" },
  { name: "Pigeon Pose", duration: 120, hold: "60s/lato", focus: "Rotatori esterni anca" },
  { name: "90/90 Hip Stretch", duration: 90, hold: "45s/lato", focus: "Rotazione interna/esterna" },
  { name: "Hamstring Stretch (seduto)", duration: 90, hold: "45s/lato", focus: "Catena posteriore" },
  { name: "Spinal Twist (Supino)", duration: 90, hold: "45s/lato", focus: "Mobilità rotazionale" },
  { name: "Lat Stretch", duration: 60, hold: "30s/lato", focus: "Gran dorsale" },
  { name: "Pec Stretch (Doorway)", duration: 60, hold: "30s/lato", focus: "Pettorali" },
  { name: "Neck Stretch", duration: 60, hold: "20s/lato", focus: "Cervicale" },
  { name: "Wrist Extensors Stretch", duration: 45, hold: "30s/lato", focus: "Avambracci" },
  { name: "Ankle Dorsiflexion Wall Stretch", duration: 60, hold: "30s/lato", focus: "Gastrocnemio/Soleo" },
];

const foamRollingProtocol = [
  { name: "Quadricipiti", duration: 90, technique: "Lento, 1 inch/sec, pause su trigger points", sets: "2 passaggi" },
  { name: "IT Band (lateral thigh)", duration: 60, technique: "Attenzione, pressione moderata", sets: "2 passaggi/lato" },
  { name: "Adduttori", duration: 60, technique: "Posizione prona, gamba abdotta", sets: "2 passaggi/lato" },
  { name: "Glutei", duration: 60, technique: "Seduto sul rullo, inclinazione laterale", sets: "2 passaggi/lato" },
  { name: "Ischio-crurali", duration: 60, technique: "Seduto, gamba estesa", sets: "2 passaggi/lato" },
  { name: "Polpacci", duration: 60, technique: "Gambe incrociate per maggior pressione", sets: "2 passaggi/lato" },
  { name: "Dorsale (Upper Back)", duration: 60, technique: "Braccia incrociate sul petto", sets: "2 passaggi" },
  { name: "Lat (Gran dorsale)", duration: 45, technique: "Posizione laterale, braccio esteso", sets: "2 passaggi/lato" },
];

const quickReference = {
  preWorkout: ["5-min walk/bike facile", "Cat-Cow 2×15", "Glute Bridge 2×12", "Dead Bug 2×8/lato", "Hip Circles 2×10"],
  postWorkout: ["3-min walk down", "Child's Pose 60s", "Figure-4 Stretch 30s/lato", "Quad Stretch 30s/lato"],
  restDay: ["Morning Routine completa", "Stretching Protocol 20-30min", "Foam Rolling 15min", "HRV + Readiness Check"],
  recovery: ["Sonno 7-9h", "HRV ≥55ms", "Idratazione 3L/giorno", "Readiness ≥20/25"],
};

export default function PreparationRecovery() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("warmup");
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const getCurrentProtocol = () => {
    switch (activeTab) {
      case "warmup":
        return warmupProtocol;
      case "cooldown":
        return cooldownProtocol;
      case "stretching":
        return stretchingProtocol;
      case "foam":
        return foamRollingProtocol;
      default:
        return warmupProtocol;
    }
  };

  const protocol = getCurrentProtocol();
  const exercise = protocol[currentExercise];
  const progress = ((currentExercise + 1) / protocol.length) * 100;

  const startExercise = () => {
    if (exercise) {
      setTimeRemaining(exercise.duration);
      setIsRunning(true);
    }
  };

  const completeExercise = () => {
    setCompleted([...completed, currentExercise]);
    if (currentExercise < protocol.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimeRemaining(0);
      setIsRunning(false);
    }
  };

  const resetProtocol = () => {
    setCurrentExercise(0);
    setCompleted([]);
    setTimeRemaining(0);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Preparazione e Recupero</CardTitle>
            <CardDescription>
              Protocolli completi per pre-allenamento, post-allenamento e recupero
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); resetProtocol(); }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="warmup">
              <Flame className="w-4 h-4 mr-2" />
              Riscaldamento
            </TabsTrigger>
            <TabsTrigger value="cooldown">
              <Snowflake className="w-4 h-4 mr-2" />
              Raffreddamento
            </TabsTrigger>
            <TabsTrigger value="stretching">
              <Sparkles className="w-4 h-4 mr-2" />
              Stretching
            </TabsTrigger>
            <TabsTrigger value="foam">
              <Activity className="w-4 h-4 mr-2" />
              Foam Rolling
            </TabsTrigger>
            <TabsTrigger value="reference">
              <BookOpen className="w-4 h-4 mr-2" />
              Riferimenti
            </TabsTrigger>
          </TabsList>

          {/* WARMUP TAB */}
          <TabsContent value="warmup">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Riscaldamento Pre-Allenamento</CardTitle>
                    <CardDescription>Durata totale: ~8 minuti</CardDescription>
                  </div>
                  <Badge variant="destructive" className="bg-orange-500">
                    <Flame className="w-3 h-3 mr-1" />
                    {Math.round((completed.length / protocol.length) * 100)}% completato
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={progress} className="h-2" />

                <div className="bg-muted/50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{exercise?.name}</h3>
                    {completed.includes(currentExercise) && (
                      <Badge variant="default" className="bg-green-500">
                        <Check className="w-4 h-4 mr-1" />
                        Completato
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ripetizioni/Durata</p>
                      <p className="text-lg font-semibold">{exercise?.reps}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Focus</p>
                      <p className="text-lg font-semibold">{exercise?.focus}</p>
                    </div>
                  </div>

                  <div className="text-center py-6">
                    <div className="text-6xl font-bold mb-2">
                      {minutes}:{seconds.toString().padStart(2, "0")}
                    </div>
                    <p className="text-sm text-muted-foreground">Timer</p>
                  </div>

                  <div className="flex gap-3">
                    {!isRunning && timeRemaining === 0 && (
                      <Button onClick={startExercise} className="flex-1" size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        Avvia
                      </Button>
                    )}
                    {isRunning && (
                      <Button
                        onClick={() => setIsRunning(false)}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pausa
                      </Button>
                    )}
                    {timeRemaining > 0 && !isRunning && (
                      <Button onClick={() => setIsRunning(true)} className="flex-1" size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        Riprendi
                      </Button>
                    )}
                    <Button onClick={completeExercise} variant="default" size="lg" className="flex-1 bg-green-500 hover:bg-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      Completa
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Tutti gli esercizi:</h4>
                  {warmupProtocol.map((ex, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        idx === currentExercise
                          ? "bg-red-500/10 border-2 border-red-500"
                          : completed.includes(idx)
                          ? "bg-green-500/10 border-2 border-green-500"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => {
                        setCurrentExercise(idx);
                        setTimeRemaining(0);
                        setIsRunning(false);
                      }}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{ex.name}</p>
                        <p className="text-sm text-muted-foreground">{ex.reps}</p>
                      </div>
                      {completed.includes(idx) && <Check className="w-5 h-5 text-green-500" />}
                    </div>
                  ))}
                </div>

                <Button onClick={resetProtocol} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Protocollo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COOLDOWN TAB */}
          <TabsContent value="cooldown">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Raffreddamento Post-Allenamento</CardTitle>
                    <CardDescription>Durata totale: ~7 minuti</CardDescription>
                  </div>
                  <Badge variant="default" className="bg-blue-500">
                    <Snowflake className="w-3 h-3 mr-1" />
                    {Math.round((completed.length / protocol.length) * 100)}% completato
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cooldownProtocol.map((ex, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      completed.includes(idx) ? "bg-green-500/10 border-2 border-green-500" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{ex.name}</h4>
                      {completed.includes(idx) ? (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="w-4 h-4 mr-1" />
                          Fatto
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setCompleted([...completed, idx])}
                          variant="outline"
                        >
                          Segna come completato
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Durata: </span>
                        <span className="font-medium">{ex.duration}s</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {ex.intensity ? "Intensità" : ex.breath ? "Respiri" : "Hold"}: </span>
                        <span className="font-medium">{ex.intensity || ex.breath || ex.hold}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Focus: </span>
                        <span className="font-medium">{ex.focus}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={() => setCompleted([])} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STRETCHING TAB */}
          <TabsContent value="stretching">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Stretching Dedicato (Giorno di Riposo)</CardTitle>
                    <CardDescription>Durata totale: ~20-30 minuti</CardDescription>
                  </div>
                  <Badge variant="default" className="bg-purple-500">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {Math.round((completed.length / protocol.length) * 100)}% completato
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {stretchingProtocol.map((ex, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      completed.includes(idx) ? "bg-green-500/10 border-2 border-green-500" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{ex.name}</h4>
                      {completed.includes(idx) ? (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="w-4 h-4 mr-1" />
                          Fatto
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setCompleted([...completed, idx])}
                          variant="outline"
                        >
                          Segna come completato
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Durata: </span>
                        <span className="font-medium">{ex.duration}s</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hold: </span>
                        <span className="font-medium">{ex.hold}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Focus: </span>
                        <span className="font-medium">{ex.focus}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={() => setCompleted([])} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FOAM ROLLING TAB */}
          <TabsContent value="foam">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Protocollo Foam Rolling</CardTitle>
                    <CardDescription>Durata totale: ~15 minuti</CardDescription>
                  </div>
                  <Badge variant="default" className="bg-indigo-500">
                    <Activity className="w-3 h-3 mr-1" />
                    {Math.round((completed.length / protocol.length) * 100)}% completato
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-500/10 p-4 rounded-lg border-2 border-blue-500/20">
                  <p className="text-sm font-medium mb-2">📋 Tecnica generale:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Movimento lento: ~1 inch per secondo</li>
                    <li>Pause di 20-30s su trigger points (punti dolenti)</li>
                    <li>Pressione moderata, mai dolore acuto</li>
                    <li>Respirazione profonda e rilassata</li>
                  </ul>
                </div>

                {foamRollingProtocol.map((ex, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      completed.includes(idx) ? "bg-green-500/10 border-2 border-green-500" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{ex.name}</h4>
                      {completed.includes(idx) ? (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="w-4 h-4 mr-1" />
                          Fatto
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setCompleted([...completed, idx])}
                          variant="outline"
                        >
                          Segna come completato
                        </Button>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">Durata: </span>
                        <span className="font-medium">{ex.duration}s</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sets: </span>
                        <span className="font-medium">{ex.sets}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tecnica: </span>
                        <span className="font-medium">{ex.technique}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={() => setCompleted([])} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QUICK REFERENCE TAB */}
          <TabsContent value="reference">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Pre-Allenamento (5min)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quickReference.preWorkout.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Snowflake className="w-5 h-5 text-blue-500" />
                    Post-Allenamento (5min)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quickReference.postWorkout.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Giorno di Riposo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quickReference.restDay.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    Target Recupero
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quickReference.recovery.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
