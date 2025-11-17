import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Exercise {
  id: string;
  name: string;
  duration: string;
  notes: string;
  category: string;
}

const DEFAULT_EXERCISES: Exercise[] = [
  // Gambe e Anche
  { id: '1', name: 'IT Band', duration: '90 sec per lato', category: 'legs', notes: 'Posizione laterale. Ruota lentamente da anca a ginocchio. Fermati sui trigger points 20-30 sec.' },
  { id: '2', name: 'Quadricipiti', duration: '90 sec per lato', category: 'legs', notes: 'Posizione prona. Dal bacino al ginocchio. Evita rotulare. Movimenti lenti.' },
  { id: '3', name: 'Hamstrings', duration: '90 sec per lato', category: 'legs', notes: 'Seduto, roller sotto coscia. Dal gluteo al ginocchio. Ruota gamba per diverse angolazioni.' },
  { id: '4', name: 'Polpacci', duration: '60 sec per lato', category: 'legs', notes: 'Seduto, gamba sopra roller. Dal ginocchio alla caviglia. Flessione plantare/dorsale.' },
  { id: '5', name: 'Adduttori', duration: '60 sec per lato', category: 'legs', notes: 'Posizione prona, gamba laterale. Ruota dall\'inguine al ginocchio interno.' },
  { id: '6', name: 'Glutei', duration: '90 sec per lato', category: 'legs', notes: 'Seduto su roller. Incrocia gamba sopra ginocchio. Ruota e cerca punti tesi.' },

  // Schiena e Dorsali
  { id: '7', name: 'Toracica', duration: '90 sec', category: 'back', notes: 'Supino, roller sotto scapole. Mani dietro testa. Estendi spine lentamente.' },
  { id: '8', name: 'Lat (Dorsali)', duration: '90 sec per lato', category: 'back', notes: 'Posizione laterale, braccio esteso. Ruota da ascella a metà schiena.' },
  { id: '9', name: 'Romboidi', duration: '60 sec', category: 'back', notes: 'Supino, roller tra scapole. Braccia incrociate davanti. Muovi su/giù.' },
];

const CATEGORIES = [
  { id: 'legs', name: 'Gambe e Anche', color: 'from-orange-500 to-red-500', icon: '🦵' },
  { id: 'back', name: 'Schiena e Dorsali', color: 'from-blue-500 to-purple-500', icon: '💪' },
];

export default function FoamRolling() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moto3_foam_exercises');
    const savedCompleted = localStorage.getItem('moto3_foam_completed_today');

    if (saved) {
      setExercises(JSON.parse(saved));
    } else {
      setExercises(DEFAULT_EXERCISES);
      localStorage.setItem('moto3_foam_exercises', JSON.stringify(DEFAULT_EXERCISES));
    }

    if (savedCompleted) {
      const saved = JSON.parse(savedCompleted);
      const today = new Date().toDateString();
      if (saved.date === today) {
        setCompletedIds(saved.ids);
      } else {
        setCompletedIds([]);
        localStorage.setItem('moto3_foam_completed_today', JSON.stringify({ date: today, ids: [] }));
      }
    }
  }, []);

  const toggleComplete = (id: string) => {
    const newCompleted = completedIds.includes(id)
      ? completedIds.filter(cid => cid !== id)
      : [...completedIds, id];

    setCompletedIds(newCompleted);
    const today = new Date().toDateString();
    localStorage.setItem('moto3_foam_completed_today', JSON.stringify({ date: today, ids: newCompleted }));
  };

  const getCategoryExercises = (categoryId: string) => {
    return exercises.filter(ex => ex.category === categoryId);
  };

  const getCategoryProgress = (categoryId: string) => {
    const categoryExercises = getCategoryExercises(categoryId);
    const completed = categoryExercises.filter(ex => completedIds.includes(ex.id)).length;
    return { completed, total: categoryExercises.length, percentage: Math.round((completed / categoryExercises.length) * 100) };
  };

  const totalProgress = Math.round((completedIds.length / exercises.length) * 100);

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
          <h1 className="text-3xl font-bold mb-2">Foam Rolling</h1>
          <p className="text-orange-100">Auto-massaggio miofasciale</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle>Progress {totalProgress}%</CardTitle>
            <CardDescription>{completedIds.length}/{exercises.length} completati</CardDescription>
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

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>ℹ️ Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Il <strong>foam rolling</strong> è una tecnica di auto-massaggio che usa un rullo di schiuma per rilasciare tensioni muscolari e migliorare mobilità.</p>
            <p className="mt-3">Particolarmente utile per piloti Moto3: riduce DOMS, migliora recovery, previene overuse injuries.</p>
          </CardContent>
        </Card>

        {CATEGORIES.map(category => {
          const progress = getCategoryProgress(category.id);
          const categoryExercises = getCategoryExercises(category.id);

          return (
            <Card key={category.id}>
              <CardHeader className={`bg-gradient-to-r ${category.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <CardTitle className="text-white">{category.name}</CardTitle>
                      <CardDescription className="text-white/80 text-xs">
                        {progress.completed}/{progress.total}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {progress.percentage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {categoryExercises.map((exercise, idx) => (
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
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground">⏱️ {exercise.duration}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedExercise(exercise);
                          setShowDetailModal(true);
                        }}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle>📋 Tecnica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Ruota lentamente (1 cm/sec)</p>
            <p>2. Fermati sui trigger points 20-30 sec</p>
            <p>3. Respira profondamente</p>
            <p>4. Dolore tollerabile (5-7/10)</p>
            <p>5. Evita ossa e articolazioni</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>⚠️ Controindicazioni</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Non usare su infortuni acuti o infiammazioni</p>
            <p>• Evita con trombosi o problemi circolatori</p>
            <p>• Non rotolare direttamente sulla colonna</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
            <DialogDescription>⏱️ {selectedExercise?.duration}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">{selectedExercise?.notes}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
