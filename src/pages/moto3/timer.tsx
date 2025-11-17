import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface TimerPreset {
  name: string;
  work: number;
  rest: number;
  sets: number;
  description: string;
}

const PRESETS: TimerPreset[] = [
  { name: 'Tabata', work: 20, rest: 10, sets: 8, description: 'Alta intensità 4 minuti totali' },
  { name: 'HIIT Standard', work: 40, rest: 20, sets: 10, description: '10 minuti allenamento completo' },
  { name: 'Resistency', work: 60, rest: 30, sets: 6, description: 'Focus resistenza aerobica' },
];

export default function Timer() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [workDuration, setWorkDuration] = useState(20);
  const [restDuration, setRestDuration] = useState(10);
  const [sets, setSets] = useState(8);
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const maxTime = isWorkPhase ? workDuration : restDuration;

          if (newTime >= maxTime) {
            if (isWorkPhase) {
              setIsWorkPhase(false);
              return 0;
            } else {
              if (currentSet >= sets) {
                setIsRunning(false);
                return 0;
              } else {
                setCurrentSet(prev => prev + 1);
                setIsWorkPhase(true);
                return 0;
              }
            }
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentTime, workDuration, restDuration, isWorkPhase, currentSet, sets]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentSet(1);
    setIsWorkPhase(true);
  };

  const loadPreset = (preset: TimerPreset) => {
    handleReset();
    setWorkDuration(preset.work);
    setRestDuration(preset.rest);
    setSets(preset.sets);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isWorkPhase
    ? (currentTime / workDuration) * 100
    : (currentTime / restDuration) * 100;

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-orange-600 via-red-500 to-pink-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Multi-Interval Timer</h1>
          <p className="text-orange-100">HIIT, Tabata e allenamenti intervallo</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        {/* Timer Display */}
        <Card className={`border-2 ${isWorkPhase ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={isWorkPhase ? 'text-green-700' : 'text-blue-700'}>
                {isWorkPhase ? '💪 LAVORO' : '😌 RIPOSO'}
              </CardTitle>
              <CardDescription className="text-lg font-semibold">
                Serie {currentSet} di {sets}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-7xl font-bold mb-4 ${isWorkPhase ? 'text-green-600' : 'text-blue-600'}`}>
                {formatTime(currentTime)}
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full transition-all ${isWorkPhase ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleStartPause}
                  className={`w-32 ${isWorkPhase ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  className="w-32"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configurazione</CardTitle>
            <CardDescription>Imposta tempi e serie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Lavoro (sec)</label>
                <Input
                  type="number"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  disabled={isRunning}
                  min={5}
                  max={300}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Riposo (sec)</label>
                <Input
                  type="number"
                  value={restDuration}
                  onChange={(e) => setRestDuration(Number(e.target.value))}
                  disabled={isRunning}
                  min={5}
                  max={300}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Serie</label>
                <Input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  disabled={isRunning}
                  min={1}
                  max={20}
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-center">
              Tempo totale: <span className="font-bold">{formatTime((workDuration + restDuration) * sets)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Presets */}
        <Card>
          <CardHeader>
            <CardTitle>Preset Rapidi</CardTitle>
            <CardDescription>Carica configurazioni comuni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-auto py-4 flex-col items-start"
                  onClick={() => loadPreset(preset)}
                  disabled={isRunning}
                >
                  <div className="font-bold text-lg mb-1">{preset.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{preset.description}</div>
                  <div className="text-xs">
                    {preset.work}s lavoro / {preset.rest}s riposo × {preset.sets} serie
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Guida Utilizzo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Tabata:</strong> Ideale per esplosività massima. 20 secondi all-out, 10 secondi recupero.</p>
            <p><strong>HIIT Standard:</strong> Bilanciato tra intensità e volume. Ottimo per conditioning generale.</p>
            <p><strong>Resistency:</strong> Focus sulla capacità aerobica. Intensità moderata-alta sostenibile.</p>
            <p className="mt-4 pt-4 border-t">
              <strong>Tip:</strong> Usa il timer per bike trainer, circuit training, o riscaldamento specifico.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
