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
  duration?: string;
  sets?: number;
  reps?: number | string;
  notes?: string;
  category: string;
}

const DEFAULT_WARMUP_EXERCISES: Exercise[] = [
  // Cardiovascolare
  { id: '1', name: 'Jumping Jacks', duration: '2 min', category: 'cardiovascular', notes: 'Mantieni un ritmo costante. Braccia completamente estese sopra la testa.' },
  { id: '2', name: 'High Knees', duration: '1 min', category: 'cardiovascular', notes: 'Porta le ginocchia all\'altezza del bacino. Mantieni il busto eretto.' },
  { id: '3', name: 'Butt Kicks', duration: '1 min', category: 'cardiovascular', notes: 'Calci ai glutei mantenendo ginocchia sotto i fianchi.' },

  // Upper Body
  { id: '4', name: 'Arm Circles', sets: 2, reps: '15 avanti/indietro', category: 'upper-body', notes: 'Cerchi ampi con le braccia tese. Aumenta gradualmente il diametro.' },
  { id: '5', name: 'Shoulder Rotations', sets: 2, reps: 20, category: 'upper-body', notes: 'Rotazioni lente e controllate in entrambe le direzioni.' },
  { id: '6', name: 'Wrist Circles', sets: 2, reps: '15 per lato', category: 'upper-body', notes: 'Importanti per il grip sul manubrio.' },

  // Core
  { id: '7', name: 'Cat-Cow Stretch', sets: 2, reps: 12, category: 'core', notes: 'Alternare flessione ed estensione della colonna vertebrale.' },
  { id: '8', name: 'Standing Torso Twists', sets: 2, reps: '20 totali', category: 'core', notes: 'Ruota il busto mantenendo i fianchi stabili.' },
  { id: '9', name: 'Dead Bug', sets: 2, reps: 10, category: 'core', notes: 'Mantieni la schiena piatta a terra. Movimenti controllati.' },

  // Lower Body
  { id: '10', name: 'Leg Swings (Frontali)', sets: 2, reps: '15 per gamba', category: 'lower-body', notes: 'Oscillazioni controllate avanti e indietro.' },
  { id: '11', name: 'Leg Swings (Laterali)', sets: 2, reps: '15 per gamba', category: 'lower-body', notes: 'Oscillazioni laterali mantenendo il busto stabile.' },
  { id: '12', name: 'Bodyweight Squats', sets: 2, reps: 15, category: 'lower-body', notes: 'Scendi fino a parallelo. Talloni a terra.' },
  { id: '13', name: 'Walking Lunges', sets: 2, reps: '10 per gamba', category: 'lower-body', notes: 'Ginocchio posteriore quasi a terra. Busto eretto.' },
  { id: '14', name: 'Ankle Circles', sets: 2, reps: '15 per piede', category: 'lower-body', notes: 'Rotazioni complete della caviglia in entrambe le direzioni.' },
];

const CATEGORIES = [
  { id: 'cardiovascular', name: 'Cardiovascolare', color: 'from-cyan-500 to-blue-500', icon: '🏃' },
  { id: 'upper-body', name: 'Upper Body', color: 'from-purple-500 to-pink-500', icon: '💪' },
  { id: 'core', name: 'Core', color: 'from-green-500 to-emerald-500', icon: '🎯' },
  { id: 'lower-body', name: 'Lower Body', color: 'from-amber-500 to-orange-500', icon: '🦵' },
];

export default function Warmup() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Load exercises from localStorage or use defaults
    const saved = localStorage.getItem('moto3_warmup_exercises');
    const savedCompleted = localStorage.getItem('moto3_warmup_completed_today');

    if (saved) {
      setExercises(JSON.parse(saved));
    } else {
      setExercises(DEFAULT_WARMUP_EXERCISES);
      localStorage.setItem('moto3_warmup_exercises', JSON.stringify(DEFAULT_WARMUP_EXERCISES));
    }

    if (savedCompleted) {
      const saved = JSON.parse(savedCompleted);
      const today = new Date().toDateString();
      if (saved.date === today) {
        setCompletedIds(saved.ids);
      } else {
        // Reset for new day
        setCompletedIds([]);
        localStorage.setItem('moto3_warmup_completed_today', JSON.stringify({ date: today, ids: [] }));
      }
    }
  }, []);

  const toggleComplete = (id: string) => {
    const newCompleted = completedIds.includes(id)
      ? completedIds.filter(cid => cid !== id)
      : [...completedIds, id];

    setCompletedIds(newCompleted);
    const today = new Date().toDateString();
    localStorage.setItem('moto3_warmup_completed_today', JSON.stringify({ date: today, ids: newCompleted }));
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

  const showDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-cyan-600 via-blue-500 to-purple-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Warmup</h1>
          <p className="text-cyan-100">Preparazione pre-allenamento</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        {/* Progress Card */}
        <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardHeader>
            <CardTitle>Progress Totale</CardTitle>
            <CardDescription>{completedIds.length} di {exercises.length} esercizi completati</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="text-3xl font-bold text-cyan-600">{totalProgress}%</div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
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
                        {progress.completed}/{progress.total} completati
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {progress.percentage}%
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {categoryExercises.map((exercise, idx) => (
                    <div
                      key={exercise.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">#{idx + 1}</span>
                          <span className={`font-medium ${completedIds.includes(exercise.id) ? 'line-through text-muted-foreground' : ''}`}>
                            {exercise.name}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {exercise.duration && `⏱️ ${exercise.duration}`}
                          {exercise.sets && ` • ${exercise.sets} sets`}
                          {exercise.reps && ` • ${exercise.reps} reps`}
                        </div>
                      </div>
                      {exercise.notes && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showDetails(exercise)}
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Tips */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Consigli
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Esegui il warmup 10-15 minuti prima dell'allenamento principale</p>
            <p>• Inizia gradualmente e aumenta l'intensità progressivamente</p>
            <p>• Non saltare mai il warmup, riduce il rischio infortuni del 50%</p>
            <p>• Concentrati sulla qualità del movimento, non sulla velocità</p>
            <p>• Se senti dolore, fermati e consulta il trainer</p>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
            <DialogDescription>
              {selectedExercise?.duration && `⏱️ ${selectedExercise.duration}`}
              {selectedExercise?.sets && ` • ${selectedExercise.sets} sets`}
              {selectedExercise?.reps && ` • ${selectedExercise.reps} reps`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="font-semibold mb-2">Note Tecniche:</h4>
            <p className="text-sm text-muted-foreground">{selectedExercise?.notes}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
