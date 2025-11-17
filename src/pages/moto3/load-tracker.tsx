import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface LoadEntry {
  id: string;
  date: string;
  duration: number;
  intensity: number;
  rpe: number;
  load: number;
}

export default function LoadTracker() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [rpe, setRPE] = useState('');
  const [calculatedLoad, setCalculatedLoad] = useState<number | null>(null);
  const [entries, setEntries] = useState<LoadEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('moto3_load_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const calculateLoad = () => {
    const d = parseFloat(duration);
    const i = parseFloat(intensity);
    const r = parseFloat(rpe);

    if (isNaN(d) || isNaN(i) || isNaN(r)) {
      alert('⚠️ Inserisci valori validi');
      return;
    }

    if (r < 1 || r > 10) {
      alert('⚠️ RPE deve essere tra 1 e 10');
      return;
    }

    if (i < 0 || i > 100) {
      alert('⚠️ Intensità deve essere tra 0 e 100%');
      return;
    }

    const load = d * (i / 100) * r;
    setCalculatedLoad(Math.round(load));
  };

  const addEntry = () => {
    if (calculatedLoad === null) {
      alert('⚠️ Calcola prima il load');
      return;
    }

    const newEntry: LoadEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: parseFloat(duration),
      intensity: parseFloat(intensity),
      rpe: parseFloat(rpe),
      load: calculatedLoad,
    };

    const updated = [newEntry, ...entries].slice(0, 30); // Keep last 30 entries
    setEntries(updated);
    localStorage.setItem('moto3_load_entries', JSON.stringify(updated));

    // Reset form
    setDuration('');
    setIntensity('');
    setRPE('');
    setCalculatedLoad(null);
  };

  const getWeeklySummary = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekEntries = entries.filter(e => new Date(e.date) >= weekAgo);
    const totalLoad = weekEntries.reduce((sum, e) => sum + e.load, 0);
    const avgRPE = weekEntries.length > 0
      ? weekEntries.reduce((sum, e) => sum + e.rpe, 0) / weekEntries.length
      : 0;

    return {
      count: weekEntries.length,
      totalLoad: Math.round(totalLoad),
      avgRPE: avgRPE.toFixed(1),
    };
  };

  const summary = getWeeklySummary();

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRPEColor = (rpe: number) => {
    if (rpe <= 3) return 'bg-green-100 text-green-700 border-green-300';
    if (rpe <= 5) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (rpe <= 7) return 'bg-amber-100 text-amber-700 border-amber-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Load Tracker</h1>
          <p className="text-cyan-100">Monitora il carico di allenamento</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Formula Training Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                Load = Durata × Intensità × RPE
              </div>
              <p className="text-sm text-muted-foreground">
                Combina durata, intensità percentuale e percezione dello sforzo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Calcola Training Load</CardTitle>
            <CardDescription>Inserisci i parametri della sessione</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Durata (minuti)
                </label>
                <Input
                  type="number"
                  placeholder="es. 60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  step="1"
                  min="1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Durata totale della sessione
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Intensità (% FC max)
                </label>
                <Input
                  type="number"
                  placeholder="es. 75"
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  step="1"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentuale della frequenza cardiaca massima
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  RPE (Rate of Perceived Exertion)
                </label>
                <Input
                  type="number"
                  placeholder="es. 7"
                  value={rpe}
                  onChange={(e) => setRPE(e.target.value)}
                  step="0.5"
                  min="1"
                  max="10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Scala 1-10 (vedi guida sotto)
                </p>
              </div>

              <Button onClick={calculateLoad} className="w-full" size="lg">
                Calcola Load
              </Button>

              {calculatedLoad !== null && (
                <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Training Load</p>
                    <div className="text-5xl font-bold text-teal-600 mb-3">
                      {calculatedLoad}
                    </div>
                    <Button onClick={addEntry} size="sm" className="bg-teal-600 hover:bg-teal-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi alla Storia
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Riepilogo Settimanale
            </CardTitle>
            <CardDescription>Ultimi 7 giorni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">{summary.totalLoad}</div>
                <div className="text-xs text-muted-foreground">Load Totale</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{summary.count}</div>
                <div className="text-xs text-muted-foreground">Sessioni</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{summary.avgRPE}</div>
                <div className="text-xs text-muted-foreground">RPE Medio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        {entries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Storico Sessioni</CardTitle>
              <CardDescription>Ultime {Math.min(entries.length, 30)} sessioni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{formatDate(entry.date)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {entry.duration} min • {entry.intensity}% FC • RPE {entry.rpe}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRPEColor(entry.rpe)}>
                        RPE {entry.rpe}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">{entry.load}</div>
                        <div className="text-xs text-muted-foreground">load</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* RPE Scale Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Scala RPE (Rate of Perceived Exertion)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 p-2 rounded bg-green-50">
                <Badge className="bg-green-600">1-2</Badge>
                <span>Molto leggero - Conversazione facile</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-green-100">
                <Badge className="bg-green-600">3-4</Badge>
                <span>Leggero - Ancora confortevole</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-blue-50">
                <Badge className="bg-blue-600">5-6</Badge>
                <span>Moderato - Conversazione possibile ma impegnativa</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-amber-50">
                <Badge className="bg-amber-600">7-8</Badge>
                <span>Duro - Parole singole, respiro pesante</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-red-50">
                <Badge className="bg-red-600">9-10</Badge>
                <span>Massimale - Impossibile parlare, sprint all-out</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
