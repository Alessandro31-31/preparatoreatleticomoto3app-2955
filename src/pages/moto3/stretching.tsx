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

const DEFAULT_STRETCHING_EXERCISES: Exercise[] = [
  // Lower Body
  { id: '1', name: 'Quad Stretch', duration: '45 sec per lato', category: 'lower-body', notes: 'Porta il tallone al gluteo. Mantieni ginocchia vicine. Senti lo stretch nel quadricipite.' },
  { id: '2', name: 'Hamstring Stretch', duration: '45 sec per lato', category: 'lower-body', notes: 'Piega in avanti con schiena dritta. Sentire stiramento dietro coscia. Non rimbalzare.' },
  { id: '3', name: 'Hip Flexor Stretch', duration: '45 sec per lato', category: 'lower-body', notes: 'Affondo basso. Spingi bacino in avanti. Busto eretto. Senti stretch davanti anca.' },
  { id: '4', name: 'Glute Stretch', duration: '45 sec per lato', category: 'lower-body', notes: 'Figura 4 da seduto. Tira ginocchio verso petto opposto. Schiena dritta.' },
  { id: '5', name: 'Calf Stretch', duration: '45 sec per lato', category: 'lower-body', notes: 'Tallone a terra, gamba tesa. Spingi muro con le mani. Senti stretch nel polpaccio.' },
  { id: '6', name: 'Groin Stretch', duration: '60 sec', category: 'lower-body', notes: 'Farfalla seduto. Piedi vicini. Spingi ginocchia verso terra con gomiti.' },

  // Upper Body
  { id: '7', name: 'Chest Stretch', duration: '45 sec', category: 'upper-body', notes: 'Mani dietro schiena intrecciate. Apri petto e solleva braccia. Spalle indietro.' },
  { id: '8', name: 'Lat Stretch', duration: '30 sec per lato', category: 'upper-body', notes: 'Braccio sopra la testa, piega lateralmente. Sentire stiramento sul lato.' },
  { id: '9', name: 'Shoulder Stretch', duration: '30 sec per lato', category: 'upper-body', notes: 'Porta braccio attraverso il petto. Usa altro braccio per assistere stretch.' },
  { id: '10', name: 'Tricep Stretch', duration: '30 sec per lato', category: 'upper-body', notes: 'Gomito sopra testa, mano dietro schiena. Assist con altra mano.' },

  // Spine
  { id: '11', name: 'Spinal Twist', duration: '45 sec per lato', category: 'spine', notes: 'Seduto, ruota busto. Mano opposta su ginocchio esterno. Respira profondo.' },
  { id: '12', name: 'Cat-Cow', duration: '60 sec', category: 'spine', notes: 'Alterna flessione ed estensione della colonna. Movimento fluido e controllato.' },
];

const CATEGORIES = [
  { id: 'lower-body', name: 'Lower Body', color: 'from-green-500 to-emerald-500', icon: '🦵' },
  { id: 'upper-body', name: 'Upper Body', color: 'from-blue-500 to-cyan-500', icon: '💪' },
  { id: 'spine', name: 'Colonna Vertebrale', color: 'from-purple-500 to-pink-500', icon: '🧘' },
];

export default function Stretching() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moto3_stretching_exercises');
    const savedCompleted = localStorage.getItem('moto3_stretching_completed_today');

    if (saved) {
      setExercises(JSON.parse(saved));
    } else {
      setExercises(DEFAULT_STRETCHING_EXERCISES);
      localStorage.setItem('moto3_stretching_exercises', JSON.stringify(DEFAULT_STRETCHING_EXERCISES));
    }

    if (savedCompleted) {
      const saved = JSON.parse(savedCompleted);
      const today = new Date().toDateString();
      if (saved.date === today) {
        setCompletedIds(saved.ids);
      } else {
        setCompletedIds([]);
        localStorage.setItem('moto3_stretching_completed_today', JSON.stringify({ date: today, ids: [] }));
      }
    }
  }, []);

  const toggleComplete = (id: string) => {
    const newCompleted = completedIds.includes(id)
      ? completedIds.filter(cid => cid !== id)
      : [...completedIds, id];

    setCompletedIds(newCompleted);
    const today = new Date().toDateString();
    localStorage.setItem('moto3_stretching_completed_today', JSON.stringify({ date: today, ids: newCompleted }));
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
      <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Stretching</h1>
          <p className="text-green-100">Programma flessibilità completo</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        {/* Progress Card */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle>Progress Totale</CardTitle>
            <CardDescription>{completedIds.length} di {exercises.length} esercizi completati</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600">{totalProgress}%</div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✨ Benefici
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Migliora flessibilità e range di movimento</p>
            <p>• Riduce rigidità muscolare post-allenamento</p>
            <p>• Previene infortuni e stiramenti</p>
            <p>• Migliora postura e allineamento</p>
            <p>• Favorisce recupero e circolazione</p>
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
                          ⏱️ {exercise.duration}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => showDetails(exercise)}
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

        {/* Guidelines */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Linee Guida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1. Mantieni posizioni statiche</strong> - No rimbalzi o movimenti bruschi</p>
            <p><strong>2. Respira profondamente</strong> - Non trattenere il respiro durante lo stretch</p>
            <p><strong>3. Tensione non dolore</strong> - Senti stretching ma non dolore acuto</p>
            <p><strong>4. Riscaldamento prima</strong> - Fai stretching con muscoli caldi</p>
            <p><strong>5. Consistenza</strong> - Migliori risultati con pratica regolare</p>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
            <DialogDescription>
              ⏱️ {selectedExercise?.duration}
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
