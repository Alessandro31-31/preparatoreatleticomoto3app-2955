import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const exercises = [
  {
    id: 'pre-race-meditation',
    name: 'Meditazione Pre-Gara',
    description: 'Calma la mente e focalizza l\'attenzione',
    duration: 300,
    icon: '🧘',
    instructions: [
      'Trova una posizione comoda, seduto o sdraiato',
      'Chiudi gli occhi e respira profondamente',
      'Concentrati sul respiro che entra ed esce',
      'Quando la mente vaga, riportala gentilmente al respiro',
      'Visualizza te stesso calmo e pronto per la gara',
    ],
  },
  {
    id: 'circuit-visualization',
    name: 'Visualizzazione Circuito',
    description: 'Giro perfetto mentale',
    duration: 600,
    icon: '🏁',
    instructions: [
      'Chiudi gli occhi e visualizza il circuito',
      'Immagina ogni curva in dettaglio',
      'Senti il throttle, i freni, il cambio',
      'Vedi le tue linee perfette',
      'Percepisci la velocità e il controllo totale',
      'Completa mentalmente 5 giri perfetti',
    ],
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Gestione stress e ansia',
    duration: 240,
    icon: '📦',
    instructions: [
      'Inspira per 4 secondi',
      'Trattieni per 4 secondi',
      'Espira per 4 secondi',
      'Pausa per 4 secondi',
      'Ripeti il ciclo',
    ],
  },
  {
    id: 'laser-focus',
    name: 'Laser Focus',
    description: 'Concentrazione assoluta',
    duration: 180,
    icon: '🎯',
    instructions: [
      'Fissa un punto davanti a te',
      'Concentrati solo su quel punto',
      'Elimina ogni distrazione',
      'Senti la tua attenzione intensificarsi',
      'Mantieni il focus per tutto l\'esercizio',
    ],
  },
  {
    id: 'pressure-management',
    name: 'Gestione Pressione',
    description: 'Performance sotto stress',
    duration: 420,
    icon: '💎',
    instructions: [
      'Visualizza una situazione di alta pressione',
      'Nota le sensazioni fisiche',
      'Reinterpreta l\'ansia come eccitazione',
      'Ripeti il tuo mantra: "Io sono pronto"',
      'Vedi te stesso eccellere sotto pressione',
    ],
  },
  {
    id: 'deep-recovery',
    name: 'Deep Recovery',
    description: 'Rilassamento profondo',
    duration: 900,
    icon: '😴',
    instructions: [
      'Sdraiati in posizione supina',
      'Respira profondamente e lentamente',
      'Rilassa ogni muscolo del corpo',
      'Inizia dai piedi e sali fino alla testa',
      'Rimani in stato di rilassamento totale',
    ],
  },
];

export default function MentalTraining() {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<typeof exercises[0] | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Alert completion
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startExercise = (exercise: typeof exercises[0]) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (selectedExercise) {
      setTimeLeft(selectedExercise.duration);
      setIsRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedExercise) {
    const progress = selectedExercise.duration > 0
      ? ((selectedExercise.duration - timeLeft) / selectedExercise.duration) * 100
      : 0;

    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 text-white px-6 pt-8 pb-6">
          <div className="max-w-screen-xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedExercise(null)}
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exercises
            </Button>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <span className="text-4xl">{selectedExercise.icon}</span>
              {selectedExercise.name}
            </h1>
            <p className="text-blue-100">{selectedExercise.description}</p>
          </div>
        </div>

        <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-8xl font-bold mb-4">
                {formatTime(timeLeft)}
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : timeLeft === 0 ? (
                    <>
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Restart
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {timeLeft === selectedExercise.duration ? 'Start' : 'Resume'}
                    </>
                  )}
                </Button>
                {timeLeft !== selectedExercise.duration && (
                  <Button onClick={resetTimer} variant="outline" size="lg">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {selectedExercise.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {timeLeft === 0 && (
            <Card className="border-green-500 bg-green-500/10">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-semibold text-green-700 dark:text-green-400">
                  Esercizio completato!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ottimo lavoro sulla preparazione mentale
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Brain className="w-8 h-8" />
            Mental Training
          </h1>
          <p className="text-blue-100">6 esercizi per focus e performance</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto">
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <p className="text-sm">
              <strong>💡 La mente è il tuo strumento più potente.</strong><br />
              Questi esercizi ti aiuteranno a sviluppare concentrazione, gestire lo stress
              e performare al meglio sotto pressione.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {exercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
              onClick={() => startExercise(exercise)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{exercise.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {Math.floor(exercise.duration / 60)} min
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
