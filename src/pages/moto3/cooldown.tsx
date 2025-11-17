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

const DEFAULT_COOLDOWN_EXERCISES: Exercise[] = [
  // Decelerazione Cardiovascolare
  { id: '1', name: 'Walking', duration: '3 min', category: 'cardio', notes: 'Cammina lentamente per rallentare gradualmente la frequenza cardiaca. Respira profondamente.' },
  { id: '2', name: 'Light Jogging', duration: '2 min', category: 'cardio', notes: 'Corsa molto leggera, ritmo conversazione. Riduci progressivamente l\'intensità.' },

  // Respirazione e Reset
  { id: '3', name: 'Box Breathing', duration: '3 min', category: 'breathing', notes: '4 secondi inspira, 4 trattieni, 4 espira, 4 trattieni. Ripeti il ciclo.' },
  { id: '4', name: 'Diaphragmatic Breathing', duration: '2 min', category: 'breathing', notes: 'Respira con il diaframma, mano sulla pancia. Pancia si solleva in inspirazione.' },

  // Stretching Post-Allenamento
  { id: '5', name: 'Quad Stretch', duration: '45 sec per lato', category: 'stretching', notes: 'Porta il tallone al gluteo. Mantieni ginocchia vicine. Stretching statico.' },
  { id: '6', name: 'Hamstring Stretch', duration: '45 sec per lato', category: 'stretching', notes: 'Piega in avanti con schiena dritta. Sentire stiramento dietro coscia.' },
  { id: '7', name: 'Hip Flexor Stretch', duration: '45 sec per lato', category: 'stretching', notes: 'Posizione affondo basso. Spingi bacino in avanti. Mantieni busto eretto.' },
  { id: '8', name: 'Glute Stretch', duration: '45 sec per lato', category: 'stretching', notes: 'Figura 4 da seduto. Tira ginocchio verso petto opposto.' },
  { id: '9', name: 'Calf Stretch', duration: '45 sec per lato', category: 'stretching', notes: 'Tallone a terra, gamba tesa. Spingi muro con le mani.' },
  { id: '10', name: 'Lat Stretch', duration: '30 sec per lato', category: 'stretching', notes: 'Braccio sopra la testa, piega lateralmente. Sentire stiramento sul lato.' },
  { id: '11', name: 'Chest Stretch', duration: '30 sec', category: 'stretching', notes: 'Mani dietro schiena intrecciate. Apri petto e solleva braccia.' },
  { id: '12', name: 'Neck Stretch', duration: '30 sec per lato', category: 'stretching', notes: 'Porta orecchio alla spalla. Usa mano per assistere delicatamente.' },

  // Recupero Finale
  { id: '13', name: 'Child\'s Pose', duration: '1 min', category: 'recovery', notes: 'Posizione rilassante. Braccia avanti, fronte a terra. Respira profondamente.' },
  { id: '14', name: 'Legs Up the Wall', duration: '2 min', category: 'recovery', notes: 'Gambe verticali contro muro. Favorisce ritorno venoso e riduce gonfiore.' },
  { id: '15', name: 'Supine Spinal Twist', duration: '1 min per lato', category: 'recovery', notes: 'Schiena a terra, ginocchia piegate su un lato. Braccia aperte a T.' },
];

const CATEGORIES = [
  { id: 'cardio', name: 'Decelerazione Cardiovascolare', color: 'from-cyan-500 to-blue-500', icon: '💓' },
  { id: 'breathing', name: 'Respirazione e Reset', color: 'from-purple-500 to-pink-500', icon: '🧘' },
  { id: 'stretching', name: 'Stretching Post-Allenamento', color: 'from-green-500 to-emerald-500', icon: '🤸' },
  { id: 'recovery', name: 'Recupero Finale', color: 'from-amber-500 to-orange-500', icon: '😌' },
];

export default function Cooldown() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moto3_cooldown_exercises');
    const savedCompleted = localStorage.getItem('moto3_cooldown_completed_today');

    if (saved) {
      setExercises(JSON.parse(saved));
    } else {
      setExercises(DEFAULT_COOLDOWN_EXERCISES);
      localStorage.setItem('moto3_cooldown_exercises', JSON.stringify(DEFAULT_COOLDOWN_EXERCISES));
    }

    if (savedCompleted) {
      const saved = JSON.parse(savedCompleted);
      const today = new Date().toDateString();
      if (saved.date === today) {
        setCompletedIds(saved.ids);
      } else {
        setCompletedIds([]);
        localStorage.setItem('moto3_cooldown_completed_today', JSON.stringify({ date: today, ids: [] }));
      }
    }
  }, []);

  const toggleComplete = (id: string) => {
    const newCompleted = completedIds.includes(id)
      ? completedIds.filter(cid => cid !== id)
      : [...completedIds, id];

    setCompletedIds(newCompleted);
    const today = new Date().toDateString();
    localStorage.setItem('moto3_cooldown_completed_today', JSON.stringify({ date: today, ids: newCompleted }));
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
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Cooldown</h1>
          <p className="text-purple-100">Defaticamento post-allenamento</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        {/* Progress Card */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle>Progress Totale</CardTitle>
            <CardDescription>{completedIds.length} di {exercises.length} esercizi completati</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600">{totalProgress}%</div>
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

        {/* Benefits Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✅ Benefici del Cooldown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Riduce gradualmente la frequenza cardiaca prevenendo accumulo sangue</p>
            <p>• Elimina acido lattico e metaboliti dall'allenamento</p>
            <p>• Previene vertigini e nausea post-workout</p>
            <p>• Migliora flessibilità quando muscoli sono caldi</p>
            <p>• Riduce DOMS (dolore muscolare ritardato) fino al 30%</p>
            <p>• Favorisce recupero e preparazione per prossima sessione</p>
          </CardContent>
        </Card>

        {/* Warning Card */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚠️ Attenzione
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Non saltare il cooldown dopo allenamenti intensi</p>
            <p>• Mantieni stretching statico per almeno 30 secondi</p>
            <p>• Evita rimbalzi durante gli allungamenti</p>
            <p>• Se senti dolore acuto, interrompi immediatamente</p>
            <p>• Idratati durante il cooldown</p>
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
