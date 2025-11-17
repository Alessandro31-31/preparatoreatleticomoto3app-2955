import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Exercise {
  id: string;
  name: string;
  category: 'mobility' | 'core';
  duration: string;
  notes: string;
}

const ROUTINE_EXERCISES: Exercise[] = [
  // Mobility (4 min)
  { id: '1', category: 'mobility', name: 'Cat-Cow', duration: '1 min', notes: 'Alternare flessione/estensione colonna. 10 rep lente.' },
  { id: '2', category: 'mobility', name: 'Thoracic Rotations', duration: '1 min', notes: '10 rep per lato. Segui mano con occhi.' },
  { id: '3', category: 'mobility', name: 'Hip CARs', duration: '1 min', notes: '5 cerchi per gamba. Controllo completo ROM.' },
  { id: '4', category: 'mobility', name: 'Ankle Circles', duration: '1 min', notes: '10 cerchi per caviglia in entrambe direzioni.' },

  // Core (5 min)
  { id: '5', category: 'core', name: 'Dead Bug', duration: '2 min', notes: 'Schiena piatta contro terra. Alternate arm/leg extensions. 8 rep per lato.' },
  { id: '6', category: 'core', name: 'Plank', duration: '2 min', notes: '4 sets di 30 sec. Focus retroversione bacino e glute squeeze.' },
  { id: '7', category: 'core', name: 'Bird Dog', duration: '1 min', notes: 'Opposite arm/leg extension. 10 rep per lato. Hold 3 sec.' },
];

export default function MorningRoutine() {
  const navigate = useNavigate();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('moto3_morning_completed_today');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) {
        setCompletedIds(data.ids);
      } else {
        setCompletedIds([]);
        localStorage.setItem('moto3_morning_completed_today', JSON.stringify({ date: today, ids: [] }));
      }
    }
  }, []);

  const toggleComplete = (id: string) => {
    const newCompleted = completedIds.includes(id)
      ? completedIds.filter(cid => cid !== id)
      : [...completedIds, id];

    setCompletedIds(newCompleted);
    const today = new Date().toDateString();
    localStorage.setItem('moto3_morning_completed_today', JSON.stringify({ date: today, ids: newCompleted }));
  };

  const mobilityExercises = ROUTINE_EXERCISES.filter(e => e.category === 'mobility');
  const coreExercises = ROUTINE_EXERCISES.filter(e => e.category === 'core');

  const mobilityCompleted = mobilityExercises.filter(e => completedIds.includes(e.id)).length;
  const coreCompleted = coreExercises.filter(e => completedIds.includes(e.id)).length;
  const totalProgress = Math.round((completedIds.length / ROUTINE_EXERCISES.length) * 100);

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Morning Routine</h1>
          <p className="text-orange-100">12-min mobility + core</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle>Progress {totalProgress}%</CardTitle>
            <CardDescription>
              Mobility: {mobilityCompleted}/4 • Core: {coreCompleted}/3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle>⚠️ Focus Anti-Iperlordosi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Questa routine è progettata per correggere iperlordosi lombare comune nei piloti.</p>
            <p className="mt-2"><strong>Priorità:</strong> Retroversione bacino, attivazione glutei, core stability.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle className="text-white">🧘 Mobility (4 min)</CardTitle>
            <CardDescription className="text-white/80">{mobilityCompleted}/4 completati</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {mobilityExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    completedIds.includes(exercise.id)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Checkbox
                    checked={completedIds.includes(exercise.id)}
                    onCheckedChange={() => toggleComplete(exercise.id)}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">⏱️ {exercise.duration}</div>
                    <div className="text-xs text-muted-foreground mt-1">{exercise.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle className="text-white">💪 Core (5 min)</CardTitle>
            <CardDescription className="text-white/80">{coreCompleted}/3 completati</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {coreExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    completedIds.includes(exercise.id)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Checkbox
                    checked={completedIds.includes(exercise.id)}
                    onCheckedChange={() => toggleComplete(exercise.id)}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">⏱️ {exercise.duration}</div>
                    <div className="text-xs text-muted-foreground mt-1">{exercise.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>📋 Principi Non Negoziabili</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. <strong>Box Breathing 4-2-4</strong> - 4 sec inspira, 2 hold, 4 espira</p>
            <p>2. <strong>Retroversione bacino</strong> - Sempre. Pubis verso ombelico</p>
            <p>3. <strong>Glute squeeze</strong> - Glutei contratti durante tutti esercizi core</p>
            <p>4. <strong>Slow eccentric</strong> - 3 secondi in discesa, 1 in salita</p>
            <p>5. <strong>Consistenza</strong> - Ogni mattina. Non saltare.</p>
          </CardContent>
        </Card>

        {totalProgress === 100 && (
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            onClick={() => navigate('/moto3')}
          >
            ✅ Routine Completa - Vai alla Home
          </Button>
        )}
      </div>
    </div>
  );
}
